-- ════════════════════════════════════════════════════════════════
-- Checkout: columnas extra de pedidos y funciones atómicas.
-- Las funciones solo las ejecuta el service role (desde el servidor).
-- ════════════════════════════════════════════════════════════════

alter table public.orders
  add column region         text,
  add column subtotal       int  not null default 0 check (subtotal >= 0),
  add column shipping       int  not null default 0 check (shipping >= 0),
  add column paid_at        timestamptz,
  -- true si al confirmar el pago alguna talla ya no tenía stock suficiente (revisar a mano).
  add column stock_conflict boolean not null default false,
  add column updated_at     timestamptz not null default now();

-- ───────────── create_order ─────────────
-- Crea el pedido en estado 'pendiente' con precios leídos de la base (nunca del cliente).
-- Valida producto activo y stock disponible, pero NO descuenta: eso ocurre al confirmarse el pago.
-- Errores: 'ITEMS_VACIOS', 'VARIANTE_NO_DISPONIBLE:<id>', 'STOCK_INSUFICIENTE:<id>:<disponible>'.
create or replace function public.create_order(
  p_reference  text,
  p_customer   jsonb,   -- { name, email, phone, address, city, region }
  p_items      jsonb,   -- [{ variant_id, quantity }]
  p_shipping_flat int,
  p_free_from     int
)
returns table (order_id uuid, subtotal int, shipping int, total int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item     record;
  v_subtotal int := 0;
  v_shipping int;
  v_order_id uuid;
begin
  if jsonb_array_length(coalesce(p_items, '[]'::jsonb)) = 0 then
    raise exception 'ITEMS_VACIOS';
  end if;

  -- Agrupado por variante por si llega repetida.
  for v_item in
    with it as (
      select (i ->> 'variant_id')::uuid as variant_id, sum((i ->> 'quantity')::int)::int as quantity
      from jsonb_array_elements(p_items) i
      group by 1
    )
    select it.variant_id, it.quantity, v.stock, p.price, p.active
    from it
    left join product_variants v on v.id = it.variant_id
    left join products p on p.id = v.product_id
  loop
    if v_item.price is null or not v_item.active or v_item.quantity <= 0 then
      raise exception 'VARIANTE_NO_DISPONIBLE:%', v_item.variant_id;
    end if;
    if v_item.stock < v_item.quantity then
      raise exception 'STOCK_INSUFICIENTE:%:%', v_item.variant_id, v_item.stock;
    end if;
    v_subtotal := v_subtotal + v_item.price * v_item.quantity;
  end loop;

  v_shipping := case when v_subtotal >= p_free_from then 0 else p_shipping_flat end;

  insert into orders (reference, status, customer_name, email, phone, address, city, region, subtotal, shipping, total)
  values (
    p_reference, 'pendiente',
    p_customer ->> 'name', p_customer ->> 'email', p_customer ->> 'phone',
    p_customer ->> 'address', p_customer ->> 'city', p_customer ->> 'region',
    v_subtotal, v_shipping, v_subtotal + v_shipping
  )
  returning id into v_order_id;

  insert into order_items (order_id, variant_id, quantity, unit_price)
  with it as (
    select (i ->> 'variant_id')::uuid as variant_id, sum((i ->> 'quantity')::int)::int as quantity
    from jsonb_array_elements(p_items) i
    group by 1
  )
  select v_order_id, it.variant_id, it.quantity, p.price
  from it
  join product_variants v on v.id = it.variant_id
  join products p on p.id = v.product_id;

  return query select v_order_id, v_subtotal, v_shipping, v_subtotal + v_shipping;
end;
$$;

-- ───────────── confirm_order_payment ─────────────
-- Marca el pedido como pagado y descuenta stock de forma atómica e idempotente.
-- Devuelve: 'paid' | 'already_paid' | 'amount_mismatch' | 'not_found'.
create or replace function public.confirm_order_payment(
  p_reference       text,
  p_transaction_id  text,
  p_amount_in_cents bigint
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order    orders%rowtype;
  v_item     record;
  v_updated  int;
  v_conflict boolean := false;
begin
  -- Bloquea el pedido: dos eventos simultáneos del mismo pago se serializan aquí.
  select * into v_order from orders where reference = p_reference for update;
  if not found then
    return 'not_found';
  end if;

  if v_order.status in ('pagado', 'enviado', 'entregado') then
    return 'already_paid';
  end if;

  if v_order.total::bigint * 100 <> p_amount_in_cents then
    return 'amount_mismatch';
  end if;

  -- Orden fijo por variante para evitar deadlocks entre pedidos concurrentes.
  for v_item in
    select variant_id, sum(quantity)::int as quantity
    from order_items where order_id = v_order.id
    group by variant_id
    order by variant_id
  loop
    update product_variants
      set stock = stock - v_item.quantity
      where id = v_item.variant_id and stock >= v_item.quantity;
    get diagnostics v_updated = row_count;
    if v_updated = 0 then
      v_conflict := true;
    end if;
  end loop;

  update orders
    set status = 'pagado',
        wompi_transaction_id = p_transaction_id,
        paid_at = now(),
        updated_at = now(),
        stock_conflict = v_conflict
    where id = v_order.id;

  return 'paid';
end;
$$;

-- ───────────── mark_order_failed ─────────────
-- Pago rechazado/anulado: solo afecta pedidos aún pendientes.
create or replace function public.mark_order_failed(p_reference text, p_transaction_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update orders
    set status = 'cancelado', wompi_transaction_id = p_transaction_id, updated_at = now()
    where reference = p_reference and status = 'pendiente';
$$;

-- En Supabase las funciones de public son ejecutables por anon/authenticated por defecto.
revoke all on function public.create_order(text, jsonb, jsonb, int, int)       from public, anon, authenticated;
revoke all on function public.confirm_order_payment(text, text, bigint)       from public, anon, authenticated;
revoke all on function public.mark_order_failed(text, text)                   from public, anon, authenticated;
grant execute on function public.create_order(text, jsonb, jsonb, int, int)   to service_role;
grant execute on function public.confirm_order_payment(text, text, bigint)    to service_role;
grant execute on function public.mark_order_failed(text, text)                to service_role;
