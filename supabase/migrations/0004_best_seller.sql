-- ════════════════════════════════════════════════════════════════
-- Etiqueta "Más vendido" en productos (la de "Nuevo" se calcula por created_at).
-- ════════════════════════════════════════════════════════════════

alter table public.products
  add column if not exists best_seller boolean not null default false;

-- admin_save_product: misma función de 0003, ahora guarda best_seller.
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
    insert into products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, active)
    values (
      v_slug, p ->> 'name', p ->> 'brand', nullif(p ->> 'description', ''),
      (p ->> 'price')::int, nullif(p ->> 'compare_at_price', '')::int,
      (p ->> 'gender')::gender, nullif(p ->> 'collection_id', '')::uuid,
      coalesce(array(select jsonb_array_elements_text(p -> 'images')), '{}'),
      coalesce((p ->> 'featured')::boolean, false),
      coalesce((p ->> 'best_seller')::boolean, false),
      coalesce((p ->> 'active')::boolean, true)
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
      best_seller = coalesce((p ->> 'best_seller')::boolean, false),
      active = coalesce((p ->> 'active')::boolean, true)
    where id = v_id;
    if not found then
      raise exception 'NO_ENCONTRADO';
    end if;
  end if;

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

  update product_variants pv set
      size  = (x ->> 'size')::numeric,
      stock = greatest((x ->> 'stock')::int, 0),
      sku   = coalesce(nullif(x ->> 'sku', ''), upper(left(v_slug, 32)) || '-' || (x ->> 'size'))
    from jsonb_array_elements(coalesce(p -> 'variants', '[]')) x
    where nullif(x ->> 'id', '') is not null
      and pv.id = (x ->> 'id')::uuid
      and pv.product_id = v_id;

  insert into product_variants (product_id, size, stock, sku)
    select v_id, (x ->> 'size')::numeric, greatest((x ->> 'stock')::int, 0),
           coalesce(nullif(x ->> 'sku', ''), upper(left(v_slug, 32)) || '-' || (x ->> 'size'))
    from jsonb_array_elements(coalesce(p -> 'variants', '[]')) x
    where nullif(x ->> 'id', '') is null;

  return v_id;
end;
$$;
