-- ════════════════════════════════════════════════════════════════
-- Esquema base de la tienda: catálogo, pedidos y RLS.
-- Precios en COP como enteros (sin decimales).
-- ════════════════════════════════════════════════════════════════

-- ───────────── Tipos ─────────────
create type public.gender as enum ('hombre', 'mujer', 'unisex');
create type public.order_status as enum ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado');

-- ───────────── Admin ─────────────
-- Un usuario es admin si su app_metadata.role = 'admin'.
-- (app_metadata solo lo puede escribir el service role, no el propio usuario.)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- ───────────── Colecciones ─────────────
create table public.collections (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image       text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ───────────── Productos ─────────────
create table public.products (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  brand            text not null,
  description      text,
  price            int  not null check (price >= 0),
  compare_at_price int  check (compare_at_price is null or compare_at_price > price),
  gender           public.gender not null default 'unisex',
  collection_id    uuid references public.collections (id) on delete set null,
  images           text[] not null default '{}',
  featured         boolean not null default false,
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

create index products_active_idx     on public.products (active, created_at desc);
create index products_collection_idx on public.products (collection_id);
create index products_brand_idx      on public.products (brand);

-- ───────────── Variantes (talla + stock) ─────────────
create table public.product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size       numeric(3, 1) not null,
  stock      int  not null default 0 check (stock >= 0),
  sku        text not null unique,
  unique (product_id, size)
);

create index product_variants_product_idx on public.product_variants (product_id);

-- ───────────── Pedidos ─────────────
create table public.orders (
  id                    uuid primary key default gen_random_uuid(),
  reference             text not null unique,
  status                public.order_status not null default 'pendiente',
  customer_name         text not null,
  email                 text not null,
  phone                 text not null,
  address               text not null,
  city                  text not null,
  total                 int  not null check (total >= 0),
  wompi_transaction_id  text unique,
  created_at            timestamptz not null default now()
);

create index orders_status_idx on public.orders (status, created_at desc);

create table public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete restrict,
  quantity   int  not null check (quantity > 0),
  unit_price int  not null check (unit_price >= 0)
);

create index order_items_order_idx on public.order_items (order_id);

-- ════════════════════════════════════════════════════════════════
-- RLS
--   · Catálogo: lectura pública solo de lo activo; escritura solo admin.
--   · Pedidos: sin acceso anónimo. El checkout y el webhook usan el
--     service role desde el servidor (que omite RLS); el admin los lee.
-- ════════════════════════════════════════════════════════════════

alter table public.collections      enable row level security;
alter table public.products         enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;

-- Colecciones
create policy "colecciones: lectura pública"
  on public.collections for select
  using (true);

create policy "colecciones: escritura admin"
  on public.collections for all
  using (public.is_admin()) with check (public.is_admin());

-- Productos
create policy "productos: lectura pública de activos"
  on public.products for select
  using (active or public.is_admin());

create policy "productos: escritura admin"
  on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- Variantes: visibles si su producto es visible
create policy "variantes: lectura pública de productos activos"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.active or public.is_admin())
    )
  );

create policy "variantes: escritura admin"
  on public.product_variants for all
  using (public.is_admin()) with check (public.is_admin());

-- Pedidos: solo admin (lectura y cambio de estado)
create policy "pedidos: admin"
  on public.orders for all
  using (public.is_admin()) with check (public.is_admin());

create policy "items: admin"
  on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());

-- ════════════════════════════════════════════════════════════════
-- Storage: bucket público para imágenes de productos
-- ════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "imagenes: lectura pública"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "imagenes: escritura admin"
  on storage.objects for insert
  with check (bucket_id = 'products' and public.is_admin());

create policy "imagenes: actualización admin"
  on storage.objects for update
  using (bucket_id = 'products' and public.is_admin());

create policy "imagenes: borrado admin"
  on storage.objects for delete
  using (bucket_id = 'products' and public.is_admin());
