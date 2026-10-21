-- Generado por scripts/generate-seed.ts. No editar a mano.
-- Borra y vuelve a crear el catálogo de ejemplo (no toca pedidos).

begin;

delete from public.product_variants where product_id in (select id from public.products);
delete from public.products;
delete from public.collections;

insert into public.collections (slug, name, description, image, sort_order) values
  ('street', 'Street', 'Para la ciudad, todos los días', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&h=1500&q=80', 1),
  ('clasicos', 'Clásicos', 'Siluetas que no pasan de moda', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1200&h=1500&q=80', 2),
  ('running', 'Running', 'Ligereza para cada kilómetro', 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&h=1500&q=80', 3),
  ('retro', 'Retro', 'Iconos de otra década', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&h=1500&q=80', 4);

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'nike-air-force-1-07-blanco', 'Air Force 1 ''07', 'Nike', 'El clásico de cancha que se volvió uniforme de la calle. Cuero liso, suela Air encapsulada y una silueta que combina con todo.', 549900, null, 'unisex',
       c.id, array['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.6&fp-y=0.55&fp-z=2.2']::text[], true, now() - interval '0 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 1, 'FL-001-36'),
  (37, 3, 'FL-001-37'),
  (38, 3, 'FL-001-38'),
  (39, 4, 'FL-001-39'),
  (40, 2, 'FL-001-40'),
  (41, 1, 'FL-001-41'),
  (42, 6, 'FL-001-42'),
  (43, 3, 'FL-001-43'),
  (44, 5, 'FL-001-44')
) as v(size, stock, sku) where p.slug = 'nike-air-force-1-07-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'nike-air-force-1-carhartt-wip', 'Air Force 1 Carhartt WIP', 'Nike', 'Colaboración con lona de trabajo y detalles en cuero marrón. Pensado para durar, hecho para destacar.', 749900, null, 'hombre',
       c.id, array['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.5&fp-y=0.5&fp-z=2.2']::text[], true, now() - interval '1 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (38, 1, 'FL-002-38'),
  (39, 0, 'FL-002-39'),
  (40, 0, 'FL-002-40'),
  (41, 0, 'FL-002-41'),
  (42, 2, 'FL-002-42'),
  (43, 0, 'FL-002-43'),
  (44, 1, 'FL-002-44')
) as v(size, stock, sku) where p.slug = 'nike-air-force-1-carhartt-wip';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'jordan-1-retro-high-bred-toe', 'Air Jordan 1 Retro High ''Bred Toe''', 'Jordan', 'La combinación negro, rojo y blanco que definió una era. Cuero premium y la caña alta que lo empezó todo.', 1099900, 1249900, 'hombre',
       c.id, array['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=1200&h=1500&q=80']::text[], true, now() - interval '2 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (38, 0, 'FL-003-38'),
  (39, 0, 'FL-003-39'),
  (40, 1, 'FL-003-40'),
  (41, 0, 'FL-003-41'),
  (42, 1, 'FL-003-42'),
  (43, 0, 'FL-003-43'),
  (44, 0, 'FL-003-44')
) as v(size, stock, sku) where p.slug = 'jordan-1-retro-high-bred-toe';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'nike-air-max-90-orange', 'Air Max 90', 'Nike', 'Cámara de aire visible, overlays en gamuza y un colorway que no pasa desapercibido.', 699900, null, 'unisex',
       c.id, array['https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.55&fp-y=0.6&fp-z=2.2']::text[], false, now() - interval '3 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-004-36'),
  (37, 1, 'FL-004-37'),
  (38, 3, 'FL-004-38'),
  (39, 1, 'FL-004-39'),
  (40, 1, 'FL-004-40'),
  (41, 6, 'FL-004-41'),
  (42, 6, 'FL-004-42'),
  (43, 5, 'FL-004-43'),
  (44, 3, 'FL-004-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-90-orange';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'nike-air-max-1-sport-red', 'Air Max 1', 'Nike', 'El primero en mostrar el aire. Malla y gamuza en blanco con acentos rojo deportivo.', 659900, null, 'mujer',
       c.id, array['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.5&fp-y=0.5&fp-z=2.2']::text[], false, now() - interval '4 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (35, 5, 'FL-005-35'),
  (36, 6, 'FL-005-36'),
  (37, 1, 'FL-005-37'),
  (38, 6, 'FL-005-38'),
  (39, 0, 'FL-005-39'),
  (40, 3, 'FL-005-40')
) as v(size, stock, sku) where p.slug = 'nike-air-max-1-sport-red';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'nike-air-force-1-shadow-pastel', 'Air Force 1 Shadow', 'Nike', 'Capas duplicadas, plataforma elevada y una paleta pastel que suaviza el clásico.', 629900, 699900, 'mujer',
       c.id, array['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.45&fp-y=0.5&fp-z=2.2']::text[], true, now() - interval '5 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (35, 1, 'FL-006-35'),
  (36, 3, 'FL-006-36'),
  (37, 6, 'FL-006-37'),
  (38, 2, 'FL-006-38'),
  (39, 3, 'FL-006-39'),
  (40, 0, 'FL-006-40')
) as v(size, stock, sku) where p.slug = 'nike-air-force-1-shadow-pastel';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'adidas-eqt-support-adv', 'EQT Support ADV', 'Adidas', 'Tejido transpirable, soporte en el talón y la estética técnica de los noventa reinterpretada.', 499900, null, 'hombre',
       c.id, array['https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.6&fp-y=0.65&fp-z=2.2']::text[], false, now() - interval '6 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (38, 5, 'FL-007-38'),
  (39, 6, 'FL-007-39'),
  (40, 1, 'FL-007-40'),
  (41, 3, 'FL-007-41'),
  (42, 3, 'FL-007-42'),
  (43, 3, 'FL-007-43'),
  (44, 5, 'FL-007-44')
) as v(size, stock, sku) where p.slug = 'adidas-eqt-support-adv';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'adidas-deerupt-runner', 'Deerupt Runner', 'Adidas', 'Malla en rejilla sobre una suela ligera. Minimalismo gráfico para el día a día.', 459900, 529900, 'unisex',
       c.id, array['https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.55&fp-y=0.45&fp-z=2.2']::text[], false, now() - interval '7 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 6, 'FL-008-36'),
  (37, 2, 'FL-008-37'),
  (38, 1, 'FL-008-38'),
  (39, 5, 'FL-008-39'),
  (40, 5, 'FL-008-40'),
  (41, 2, 'FL-008-41'),
  (42, 0, 'FL-008-42'),
  (43, 4, 'FL-008-43'),
  (44, 4, 'FL-008-44')
) as v(size, stock, sku) where p.slug = 'adidas-deerupt-runner';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'nike-free-rn-flyknit', 'Free RN Flyknit', 'Nike', 'Flexibilidad natural y un tejido Flyknit que abraza el pie. Para correr o para no parar.', 489900, null, 'mujer',
       c.id, array['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.45&fp-y=0.5&fp-z=2.2']::text[], false, now() - interval '8 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (35, 1, 'FL-009-35'),
  (36, 5, 'FL-009-36'),
  (37, 4, 'FL-009-37'),
  (38, 0, 'FL-009-38'),
  (39, 2, 'FL-009-39'),
  (40, 5, 'FL-009-40')
) as v(size, stock, sku) where p.slug = 'nike-free-rn-flyknit';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'nike-air-zoom-pegasus-volt', 'Air Zoom Pegasus', 'Nike', 'Respuesta Zoom Air y amortiguación reactiva en un volt imposible de ignorar.', 579900, null, 'unisex',
       c.id, array['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.5&fp-y=0.75&fp-z=2.2']::text[], false, now() - interval '9 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 4, 'FL-010-36'),
  (37, 4, 'FL-010-37'),
  (38, 6, 'FL-010-38'),
  (39, 3, 'FL-010-39'),
  (40, 3, 'FL-010-40'),
  (41, 1, 'FL-010-41'),
  (42, 0, 'FL-010-42'),
  (43, 1, 'FL-010-43'),
  (44, 1, 'FL-010-44')
) as v(size, stock, sku) where p.slug = 'nike-air-zoom-pegasus-volt';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'vans-old-skool-burgundy', 'Old Skool', 'Vans', 'Lona y gamuza con la franja lateral icónica. Skate, calle y todo lo del medio.', 329900, null, 'unisex',
       c.id, array['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.55&fp-y=0.5&fp-z=2.2']::text[], false, now() - interval '10 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 6, 'FL-011-36'),
  (37, 0, 'FL-011-37'),
  (38, 2, 'FL-011-38'),
  (39, 4, 'FL-011-39'),
  (40, 3, 'FL-011-40'),
  (41, 1, 'FL-011-41'),
  (42, 1, 'FL-011-42'),
  (43, 2, 'FL-011-43'),
  (44, 3, 'FL-011-44')
) as v(size, stock, sku) where p.slug = 'vans-old-skool-burgundy';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)
select 'puma-smash-v2-leather', 'Smash v2 Leather', 'Puma', 'Cuero perforado, perfil bajo y una limpieza que funciona con cualquier outfit.', 299900, null, 'unisex',
       c.id, array['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&h=1500&q=80', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&h=1500&q=80&crop=focalpoint&fp-x=0.6&fp-y=0.5&fp-z=2.2']::text[], false, now() - interval '11 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 0, 'FL-012-36'),
  (37, 5, 'FL-012-37'),
  (38, 2, 'FL-012-38'),
  (39, 3, 'FL-012-39'),
  (40, 1, 'FL-012-40'),
  (41, 6, 'FL-012-41'),
  (42, 5, 'FL-012-42'),
  (43, 2, 'FL-012-43'),
  (44, 4, 'FL-012-44')
) as v(size, stock, sku) where p.slug = 'puma-smash-v2-leather';

commit;
