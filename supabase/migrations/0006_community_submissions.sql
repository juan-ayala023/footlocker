-- ════════════════════════════════════════════════════════════════
-- "El estilo de otras personas": los clientes suben su foto desde la web
-- y queda pendiente hasta que el admin la acepta (o la rechaza).
--
-- Flujo:
--   1. /api/community (service role) guarda el archivo en el bucket PRIVADO
--      community-pending y crea la fila con status 'pending' y active = false.
--   2. El admin la ve en /admin/comunidad (URL firmada) y:
--      · Acepta  → se copia al bucket público products/comunidad/, status 'approved'.
--      · Rechaza → se borran el archivo y la fila.
-- ════════════════════════════════════════════════════════════════

alter table public.community_photos
  add column if not exists status text not null default 'approved'
    check (status in ('pending', 'approved'));

-- Las fotos que sube el admin directamente nacen aprobadas (default).
create index if not exists community_photos_status_idx on public.community_photos (status);

-- El público solo ve fotos aprobadas y visibles; el admin ve todo.
drop policy if exists "comunidad: lectura pública de activas" on public.community_photos;
drop policy if exists "comunidad: lectura pública de aprobadas" on public.community_photos;
create policy "comunidad: lectura pública de aprobadas"
  on public.community_photos for select
  using ((active and status = 'approved') or public.is_admin());

-- Bucket privado para fotos por revisar: sin lectura pública.
-- Las sube el servidor con service role; el admin puede verlas (URL firmada) y borrarlas.
insert into storage.buckets (id, name, public)
values ('community-pending', 'community-pending', false)
on conflict (id) do nothing;

drop policy if exists "comunidad pendientes: lectura admin" on storage.objects;
create policy "comunidad pendientes: lectura admin"
  on storage.objects for select
  using (bucket_id = 'community-pending' and public.is_admin());

drop policy if exists "comunidad pendientes: borrado admin" on storage.objects;
create policy "comunidad pendientes: borrado admin"
  on storage.objects for delete
  using (bucket_id = 'community-pending' and public.is_admin());
