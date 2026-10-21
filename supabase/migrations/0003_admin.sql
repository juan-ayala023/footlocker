-- ════════════════════════════════════════════════════════════════
-- Admin: guardado atómico de productos y cambios de estado de pedidos.
-- security invoker: corren con la sesión del usuario, así que RLS
-- y is_admin() siguen aplicando (no hay escalamiento de privilegios).
-- ════════════════════════════════════════════════════════════════

-- ───────────── admin_save_product ─────────────
-- Crea o actualiza un producto y sincroniza sus variantes en una sola transacción.
-- p = { id?, slug, name, brand, description, price, compare_at_price, gender,
--       collection_id, images[], featured, active, variants: [{ id?, size, stock, sku? }] }
-- Variantes quitadas: se borran; si ya tienen pedidos, quedan con stock 0 (no se puede borrar historial).
create or replace function public.admin_save_product(p jsonb)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_id    uuid := nullif(p ->> 'id', '')::uuid;
  v_keep  uuid[];
  v_slug  text := p ->> 'slug';
begin
  if not public.is_admin() then
    raise exception 'NO_AUTORIZADO';
  end if;

  if v_id is null then
    insert into products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, active)
    values (
      v_slug, p ->> 'name', p ->> 'brand', nullif(p ->> 'description', ''),
      (p ->> 'price')::int, nullif(p ->> 'compare_at_price', '')::int,
      (p ->> 'gender')::gender, nullif(p ->> 'collection_id', '')::uuid,
      coalesce(array(select jsonb_array_elements_text(p -> 'images')), '{}'),
      coalesce((p ->> 'featured')::boolean, false), coalesce((p ->> 'active')::boolean, true)
    )
    returning id into v_id;
  else
    update products set
      slug = v_slug,
      name = p ->> 'name',
      brand = p ->> 'brand',
      description = nullif(p ->> 'description', ''),
      price = (p ->> 'price')::int,
      compare_at_price = nullif(p ->> 'compare_at_price', '')::int,
      gender = (p ->> 'gender')::gender,
      collection_id = nullif(p ->> 'collection_id', '')::uuid,
      images = coalesce(array(select jsonb_array_elements_text(p -> 'images')), '{}'),
      featured = coalesce((p ->> 'featured')::boolean, false),
      active = coalesce((p ->> 'active')::boolean, true)
    where id = v_id;
    if not found then
      raise exception 'NO_ENCONTRADO';
    end if;
  end if;

  -- Variantes que se conservan (las que llegan con id).
  select coalesce(array_agg((x ->> 'id')::uuid), '{}')
    into v_keep
    from jsonb_array_elements(coalesce(p -> 'variants', '[]')) x
    where nullif(x ->> 'id', '') is not null;

  update product_variants pv set stock = 0
    where pv.product_id = v_id and not (pv.id = any (v_keep))
      and exists (select 1 from order_items oi where oi.variant_id = pv.id);

  delete from product_variants pv
    where pv.product_id = v_id and not (pv.id = any (v_keep))
      and not exists (select 1 from order_items oi where oi.variant_id = pv.id);

  -- Actualizar existentes.
  update product_variants pv set
      size  = (x ->> 'size')::numeric,
      stock = greatest((x ->> 'stock')::int, 0),
      sku   = coalesce(nullif(x ->> 'sku', ''), upper(left(v_slug, 32)) || '-' || (x ->> 'size'))
    from jsonb_array_elements(coalesce(p -> 'variants', '[]')) x
    where nullif(x ->> 'id', '') is not null
      and pv.id = (x ->> 'id')::uuid
      and pv.product_id = v_id;

  -- Insertar nuevas.
  insert into product_variants (product_id, size, stock, sku)
    select v_id, (x ->> 'size')::numeric, greatest((x ->> 'stock')::int, 0),
           coalesce(nullif(x ->> 'sku', ''), upper(left(v_slug, 32)) || '-' || (x ->> 'size'))
    from jsonb_array_elements(coalesce(p -> 'variants', '[]')) x
    where nullif(x ->> 'id', '') is null;

  return v_id;
end;
$$;

-- ───────────── admin_set_order_status ─────────────
-- Transiciones permitidas desde el panel. "pagado" solo lo pone Wompi (descuenta stock).
--   pendiente → cancelado
--   pagado    → enviado
--   enviado   → entregado
create or replace function public.admin_set_order_status(p_reference text, p_status order_status)
returns order_status
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_current order_status;
begin
  if not public.is_admin() then
    raise exception 'NO_AUTORIZADO';
  end if;

  select status into v_current from orders where reference = p_reference for update;
  if not found then
    raise exception 'NO_ENCONTRADO';
  end if;

  if not (
    (v_current = 'pendiente' and p_status = 'cancelado') or
    (v_current = 'pagado'    and p_status = 'enviado')   or
    (v_current = 'enviado'   and p_status = 'entregado')
  ) then
    raise exception 'TRANSICION_INVALIDA:%:%', v_current, p_status;
  end if;

  update orders set status = p_status, updated_at = now() where reference = p_reference;
  return p_status;
end;
$$;

revoke all on function public.admin_save_product(jsonb)                     from public, anon;
revoke all on function public.admin_set_order_status(text, order_status)    from public, anon;
grant execute on function public.admin_save_product(jsonb)                  to authenticated;
grant execute on function public.admin_set_order_status(text, order_status) to authenticated;
