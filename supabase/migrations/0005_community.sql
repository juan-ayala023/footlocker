-- ════════════════════════════════════════════════════════════════
-- "El estilo de otras personas": fotos de clientes curadas por el admin.
-- Las fotos se suben al bucket products (carpeta comunidad/) desde el panel.
-- ════════════════════════════════════════════════════════════════

create table if not exists public.community_photos (
  id         uuid primary key default gen_random_uuid(),
  image      text not null,
  -- Usuario de Instagram sin @ (crédito de la foto).
  handle     text,
  -- Producto que aparece en la foto (opcional).
  product_id uuid references public.products (id) on delete set null,
  sort_order int  not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists community_photos_product_idx on public.community_photos (product_id);

alter table public.community_photos enable row level security;

create policy "comunidad: lectura pública de activas"
  on public.community_photos for select
  using (active or public.is_admin());

create policy "comunidad: escritura admin"
  on public.community_photos for all
  using (public.is_admin()) with check (public.is_admin());
