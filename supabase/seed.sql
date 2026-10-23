-- Generado por scripts/generate-seed.ts. No editar a mano.
-- Borra y vuelve a crear el catálogo de ejemplo (no toca pedidos).

begin;

delete from public.product_variants where product_id in (select id from public.products);
delete from public.products;
delete from public.collections;

insert into public.collections (slug, name, description, image, sort_order) values
  ('street', 'Street', 'Para la ciudad, todos los días', '/catalog/nike-air-max-dn-blanco-negro/01.webp', 1),
  ('clasicos', 'Clásicos', 'Siluetas que no pasan de moda', '/catalog/adidas-grand-court-base-00s/01.webp', 2),
  ('running', 'Running', 'Ligereza para cada kilómetro', '/catalog/adidas-adizero-evo-sl-negro/01.webp', 3),
  ('retro', 'Retro', 'Iconos de otra década', '/catalog/nike-air-max-90-blanco/01.webp', 4),
  ('futbol', 'Fútbol', 'Para la cancha y la calle', null, 5),
  ('basket', 'Basket', 'Siluetas nacidas en la duela', '/catalog/jordan-air-jordan-3-og-spring-is-in-the-air/01.webp', 6);

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'adidas-adizero-evo-sl-negro', 'Adizero EVO SL Negro', 'Adidas', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/adidas-adizero-evo-sl-negro/01.webp', '/catalog/adidas-adizero-evo-sl-negro/02.webp', '/catalog/adidas-adizero-evo-sl-negro/03.webp', '/catalog/adidas-adizero-evo-sl-negro/04.webp', '/catalog/adidas-adizero-evo-sl-negro/05.webp', '/catalog/adidas-adizero-evo-sl-negro/06.webp', '/catalog/adidas-adizero-evo-sl-negro/07.webp']::text[], false, false, now() - interval '0 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-001-36'),
  (37, 5, 'FL-001-37'),
  (38, 5, 'FL-001-38'),
  (39, 5, 'FL-001-39'),
  (40, 5, 'FL-001-40'),
  (41, 5, 'FL-001-41'),
  (42, 5, 'FL-001-42'),
  (43, 5, 'FL-001-43'),
  (44, 5, 'FL-001-44')
) as v(size, stock, sku) where p.slug = 'adidas-adizero-evo-sl-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'adidas-adizero-evo-sl-blanco', 'Adizero EVO SL Blanco', 'Adidas', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/adidas-adizero-evo-sl-blanco/01.webp', '/catalog/adidas-adizero-evo-sl-blanco/02.webp', '/catalog/adidas-adizero-evo-sl-blanco/03.webp', '/catalog/adidas-adizero-evo-sl-blanco/04.webp', '/catalog/adidas-adizero-evo-sl-blanco/05.webp', '/catalog/adidas-adizero-evo-sl-blanco/06.webp']::text[], false, false, now() - interval '6 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-002-36'),
  (37, 5, 'FL-002-37'),
  (38, 5, 'FL-002-38'),
  (39, 5, 'FL-002-39'),
  (40, 5, 'FL-002-40'),
  (41, 5, 'FL-002-41'),
  (42, 5, 'FL-002-42'),
  (43, 5, 'FL-002-43'),
  (44, 5, 'FL-002-44')
) as v(size, stock, sku) where p.slug = 'adidas-adizero-evo-sl-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'adidas-grand-court-base-00s', 'Grand Court Base 00s', 'Adidas', '', 175000, 200000, 'mujer',
       c.id, array['/catalog/adidas-grand-court-base-00s/01.webp', '/catalog/adidas-grand-court-base-00s/02.webp', '/catalog/adidas-grand-court-base-00s/03.webp', '/catalog/adidas-grand-court-base-00s/04.webp', '/catalog/adidas-grand-court-base-00s/05.webp', '/catalog/adidas-grand-court-base-00s/06.webp', '/catalog/adidas-grand-court-base-00s/07.webp']::text[], false, false, now() - interval '12 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-003-36'),
  (37, 5, 'FL-003-37'),
  (38, 5, 'FL-003-38'),
  (39, 5, 'FL-003-39')
) as v(size, stock, sku) where p.slug = 'adidas-grand-court-base-00s';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'adidas-superstar-classic-blanco', 'Superstar Classic Blanco', 'Adidas', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/adidas-superstar-classic-blanco/01.webp', '/catalog/adidas-superstar-classic-blanco/02.webp', '/catalog/adidas-superstar-classic-blanco/03.webp', '/catalog/adidas-superstar-classic-blanco/04.webp', '/catalog/adidas-superstar-classic-blanco/05.webp', '/catalog/adidas-superstar-classic-blanco/06.webp']::text[], false, false, now() - interval '18 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-004-36'),
  (37, 5, 'FL-004-37'),
  (38, 5, 'FL-004-38'),
  (39, 5, 'FL-004-39'),
  (40, 5, 'FL-004-40'),
  (41, 5, 'FL-004-41'),
  (42, 5, 'FL-004-42'),
  (43, 5, 'FL-004-43'),
  (44, 5, 'FL-004-44')
) as v(size, stock, sku) where p.slug = 'adidas-superstar-classic-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'adidas-superstar-classic-negro', 'Superstar Classic Negro', 'Adidas', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/adidas-superstar-classic-negro/01.webp', '/catalog/adidas-superstar-classic-negro/02.webp', '/catalog/adidas-superstar-classic-negro/03.webp', '/catalog/adidas-superstar-classic-negro/04.webp', '/catalog/adidas-superstar-classic-negro/05.webp', '/catalog/adidas-superstar-classic-negro/06.webp', '/catalog/adidas-superstar-classic-negro/07.webp']::text[], false, false, now() - interval '24 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-005-36'),
  (37, 5, 'FL-005-37'),
  (38, 5, 'FL-005-38'),
  (39, 5, 'FL-005-39'),
  (40, 5, 'FL-005-40'),
  (41, 5, 'FL-005-41'),
  (42, 5, 'FL-005-42'),
  (43, 5, 'FL-005-43'),
  (44, 5, 'FL-005-44')
) as v(size, stock, sku) where p.slug = 'adidas-superstar-classic-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-force-1-07-blanco-rosa', 'Air Force 1 ''07 Blanco/Rosa', 'Nike', '', 175000, 200000, 'mujer',
       c.id, array['/catalog/nike-air-force-1-07-blanco-rosa/01.webp', '/catalog/nike-air-force-1-07-blanco-rosa/02.webp', '/catalog/nike-air-force-1-07-blanco-rosa/03.webp', '/catalog/nike-air-force-1-07-blanco-rosa/04.webp', '/catalog/nike-air-force-1-07-blanco-rosa/05.webp']::text[], false, false, now() - interval '30 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-006-36'),
  (37, 5, 'FL-006-37'),
  (38, 5, 'FL-006-38'),
  (39, 5, 'FL-006-39')
) as v(size, stock, sku) where p.slug = 'nike-air-force-1-07-blanco-rosa';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-force-1-07-blanco', 'Air Force 1 ''07 Blanco', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-air-force-1-07-blanco/01.webp', '/catalog/nike-air-force-1-07-blanco/02.webp', '/catalog/nike-air-force-1-07-blanco/03.webp', '/catalog/nike-air-force-1-07-blanco/04.webp', '/catalog/nike-air-force-1-07-blanco/05.webp', '/catalog/nike-air-force-1-07-blanco/06.webp', '/catalog/nike-air-force-1-07-blanco/07.webp', '/catalog/nike-air-force-1-07-blanco/08.webp']::text[], false, false, now() - interval '36 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-007-36'),
  (37, 5, 'FL-007-37'),
  (38, 5, 'FL-007-38'),
  (39, 5, 'FL-007-39'),
  (40, 5, 'FL-007-40'),
  (41, 5, 'FL-007-41'),
  (42, 5, 'FL-007-42'),
  (43, 5, 'FL-007-43'),
  (44, 5, 'FL-007-44')
) as v(size, stock, sku) where p.slug = 'nike-air-force-1-07-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-force-1-07-negro', 'Air Force 1 ''07 Negro', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-air-force-1-07-negro/01.webp', '/catalog/nike-air-force-1-07-negro/02.webp', '/catalog/nike-air-force-1-07-negro/03.webp', '/catalog/nike-air-force-1-07-negro/04.webp', '/catalog/nike-air-force-1-07-negro/05.webp', '/catalog/nike-air-force-1-07-negro/06.webp', '/catalog/nike-air-force-1-07-negro/07.webp', '/catalog/nike-air-force-1-07-negro/08.webp']::text[], false, false, now() - interval '42 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-008-36'),
  (37, 5, 'FL-008-37'),
  (38, 5, 'FL-008-38'),
  (39, 5, 'FL-008-39'),
  (40, 5, 'FL-008-40'),
  (41, 5, 'FL-008-41'),
  (42, 5, 'FL-008-42'),
  (43, 5, 'FL-008-43'),
  (44, 5, 'FL-008-44')
) as v(size, stock, sku) where p.slug = 'nike-air-force-1-07-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-force-1-07-rojo', 'Air Force 1 ''07 Rojo', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-air-force-1-07-rojo/01.webp', '/catalog/nike-air-force-1-07-rojo/02.webp', '/catalog/nike-air-force-1-07-rojo/03.webp', '/catalog/nike-air-force-1-07-rojo/04.webp']::text[], false, false, now() - interval '48 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-009-36'),
  (37, 5, 'FL-009-37'),
  (38, 5, 'FL-009-38'),
  (39, 5, 'FL-009-39'),
  (40, 5, 'FL-009-40'),
  (41, 5, 'FL-009-41'),
  (42, 5, 'FL-009-42'),
  (43, 5, 'FL-009-43'),
  (44, 5, 'FL-009-44')
) as v(size, stock, sku) where p.slug = 'nike-air-force-1-07-rojo';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-force-1-mid-07-blanco', 'Air Force 1 Mid ''07 Blanco', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-air-force-1-mid-07-blanco/01.webp', '/catalog/nike-air-force-1-mid-07-blanco/02.webp', '/catalog/nike-air-force-1-mid-07-blanco/03.webp', '/catalog/nike-air-force-1-mid-07-blanco/04.webp', '/catalog/nike-air-force-1-mid-07-blanco/05.webp', '/catalog/nike-air-force-1-mid-07-blanco/06.webp', '/catalog/nike-air-force-1-mid-07-blanco/07.webp', '/catalog/nike-air-force-1-mid-07-blanco/08.webp']::text[], false, false, now() - interval '54 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-010-36'),
  (37, 5, 'FL-010-37'),
  (38, 5, 'FL-010-38'),
  (39, 5, 'FL-010-39'),
  (40, 5, 'FL-010-40'),
  (41, 5, 'FL-010-41'),
  (42, 5, 'FL-010-42'),
  (43, 5, 'FL-010-43'),
  (44, 5, 'FL-010-44')
) as v(size, stock, sku) where p.slug = 'nike-air-force-1-mid-07-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-force-1-mid-07-negro', 'Air Force 1 Mid ''07 Negro', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-air-force-1-mid-07-negro/01.webp', '/catalog/nike-air-force-1-mid-07-negro/02.webp', '/catalog/nike-air-force-1-mid-07-negro/03.webp']::text[], false, false, now() - interval '60 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-011-36'),
  (37, 5, 'FL-011-37'),
  (38, 5, 'FL-011-38'),
  (39, 5, 'FL-011-39'),
  (40, 5, 'FL-011-40'),
  (41, 5, 'FL-011-41'),
  (42, 5, 'FL-011-42'),
  (43, 5, 'FL-011-43'),
  (44, 5, 'FL-011-44')
) as v(size, stock, sku) where p.slug = 'nike-air-force-1-mid-07-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-3-og-spring-is-in-the-air', 'Air Jordan 3 OG ''Spring Is in the Air''', 'Jordan', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/jordan-air-jordan-3-og-spring-is-in-the-air/01.webp', '/catalog/jordan-air-jordan-3-og-spring-is-in-the-air/02.webp', '/catalog/jordan-air-jordan-3-og-spring-is-in-the-air/03.webp', '/catalog/jordan-air-jordan-3-og-spring-is-in-the-air/04.webp', '/catalog/jordan-air-jordan-3-og-spring-is-in-the-air/05.webp', '/catalog/jordan-air-jordan-3-og-spring-is-in-the-air/06.webp', '/catalog/jordan-air-jordan-3-og-spring-is-in-the-air/07.webp', '/catalog/jordan-air-jordan-3-og-spring-is-in-the-air/08.webp']::text[], false, false, now() - interval '66 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-012-36'),
  (37, 5, 'FL-012-37'),
  (38, 5, 'FL-012-38'),
  (39, 5, 'FL-012-39'),
  (40, 5, 'FL-012-40'),
  (41, 5, 'FL-012-41'),
  (42, 5, 'FL-012-42'),
  (43, 5, 'FL-012-43'),
  (44, 5, 'FL-012-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-3-og-spring-is-in-the-air';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-3-retro-cobalt-bliss', 'Air Jordan 3 Retro ''Cobalt Bliss''', 'Jordan', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/jordan-air-jordan-3-retro-cobalt-bliss/01.webp', '/catalog/jordan-air-jordan-3-retro-cobalt-bliss/02.webp', '/catalog/jordan-air-jordan-3-retro-cobalt-bliss/03.webp', '/catalog/jordan-air-jordan-3-retro-cobalt-bliss/04.webp']::text[], false, false, now() - interval '72 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-013-36'),
  (37, 5, 'FL-013-37'),
  (38, 5, 'FL-013-38'),
  (39, 5, 'FL-013-39'),
  (40, 5, 'FL-013-40'),
  (41, 5, 'FL-013-41'),
  (42, 5, 'FL-013-42'),
  (43, 5, 'FL-013-43'),
  (44, 5, 'FL-013-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-3-retro-cobalt-bliss';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-3-retro-sail-and-jade-aura', 'Air Jordan 3 Retro ''Sail and Jade Aura''', 'Jordan', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/jordan-air-jordan-3-retro-sail-and-jade-aura/01.webp', '/catalog/jordan-air-jordan-3-retro-sail-and-jade-aura/02.webp', '/catalog/jordan-air-jordan-3-retro-sail-and-jade-aura/03.webp', '/catalog/jordan-air-jordan-3-retro-sail-and-jade-aura/04.webp', '/catalog/jordan-air-jordan-3-retro-sail-and-jade-aura/05.webp', '/catalog/jordan-air-jordan-3-retro-sail-and-jade-aura/06.webp', '/catalog/jordan-air-jordan-3-retro-sail-and-jade-aura/07.webp', '/catalog/jordan-air-jordan-3-retro-sail-and-jade-aura/08.webp']::text[], false, false, now() - interval '78 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-014-40'),
  (41, 5, 'FL-014-41'),
  (42, 5, 'FL-014-42'),
  (43, 5, 'FL-014-43'),
  (44, 5, 'FL-014-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-3-retro-sail-and-jade-aura';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-4-retro-tour-yellow', 'Air Jordan 4 Retro ''Tour Yellow''', 'Jordan', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/jordan-air-jordan-4-retro-tour-yellow/01.webp', '/catalog/jordan-air-jordan-4-retro-tour-yellow/02.webp', '/catalog/jordan-air-jordan-4-retro-tour-yellow/03.webp', '/catalog/jordan-air-jordan-4-retro-tour-yellow/04.webp', '/catalog/jordan-air-jordan-4-retro-tour-yellow/05.webp', '/catalog/jordan-air-jordan-4-retro-tour-yellow/06.webp', '/catalog/jordan-air-jordan-4-retro-tour-yellow/07.webp', '/catalog/jordan-air-jordan-4-retro-tour-yellow/08.webp']::text[], false, false, now() - interval '84 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-015-40'),
  (41, 5, 'FL-015-41'),
  (42, 5, 'FL-015-42'),
  (43, 5, 'FL-015-43'),
  (44, 5, 'FL-015-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-4-retro-tour-yellow';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-90-blanco', 'Air Max 90 Blanco', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-air-max-90-blanco/01.webp', '/catalog/nike-air-max-90-blanco/02.webp', '/catalog/nike-air-max-90-blanco/03.webp', '/catalog/nike-air-max-90-blanco/04.webp', '/catalog/nike-air-max-90-blanco/05.webp']::text[], false, false, now() - interval '90 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-016-36'),
  (37, 5, 'FL-016-37'),
  (38, 5, 'FL-016-38'),
  (39, 5, 'FL-016-39'),
  (40, 5, 'FL-016-40'),
  (41, 5, 'FL-016-41'),
  (42, 5, 'FL-016-42'),
  (43, 5, 'FL-016-43'),
  (44, 5, 'FL-016-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-90-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-90-blanco-rojo', 'Air Max 90 Blanco/Rojo', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-air-max-90-blanco-rojo/01.webp', '/catalog/nike-air-max-90-blanco-rojo/02.webp', '/catalog/nike-air-max-90-blanco-rojo/03.webp']::text[], false, false, now() - interval '96 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-017-40'),
  (41, 5, 'FL-017-41'),
  (42, 5, 'FL-017-42'),
  (43, 5, 'FL-017-43'),
  (44, 5, 'FL-017-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-90-blanco-rojo';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-90-negro', 'Air Max 90 Negro', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-air-max-90-negro/01.webp', '/catalog/nike-air-max-90-negro/02.webp', '/catalog/nike-air-max-90-negro/03.webp', '/catalog/nike-air-max-90-negro/04.webp', '/catalog/nike-air-max-90-negro/05.webp', '/catalog/nike-air-max-90-negro/06.webp', '/catalog/nike-air-max-90-negro/07.webp', '/catalog/nike-air-max-90-negro/08.webp']::text[], false, false, now() - interval '102 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-018-36'),
  (37, 5, 'FL-018-37'),
  (38, 5, 'FL-018-38'),
  (39, 5, 'FL-018-39'),
  (40, 5, 'FL-018-40'),
  (41, 5, 'FL-018-41'),
  (42, 5, 'FL-018-42'),
  (43, 5, 'FL-018-43'),
  (44, 5, 'FL-018-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-90-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-95-big-bubble-verde', 'Air Max 95 ''Big Bubble'' Verde', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-air-max-95-big-bubble-verde/01.webp', '/catalog/nike-air-max-95-big-bubble-verde/02.webp', '/catalog/nike-air-max-95-big-bubble-verde/03.webp', '/catalog/nike-air-max-95-big-bubble-verde/04.webp', '/catalog/nike-air-max-95-big-bubble-verde/05.webp', '/catalog/nike-air-max-95-big-bubble-verde/06.webp']::text[], false, false, now() - interval '108 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-019-40'),
  (41, 5, 'FL-019-41'),
  (42, 5, 'FL-019-42'),
  (43, 5, 'FL-019-43'),
  (44, 5, 'FL-019-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-95-big-bubble-verde';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-95-big-bubble-gris-negro', 'Air Max 95 ''Big Bubble'' Gris/Negro', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-air-max-95-big-bubble-gris-negro/01.webp', '/catalog/nike-air-max-95-big-bubble-gris-negro/02.webp', '/catalog/nike-air-max-95-big-bubble-gris-negro/03.webp', '/catalog/nike-air-max-95-big-bubble-gris-negro/04.webp', '/catalog/nike-air-max-95-big-bubble-gris-negro/05.webp']::text[], false, false, now() - interval '114 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-020-40'),
  (41, 5, 'FL-020-41'),
  (42, 5, 'FL-020-42'),
  (43, 5, 'FL-020-43'),
  (44, 5, 'FL-020-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-95-big-bubble-gris-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-dn-blanco-negro', 'Air Max Dn Blanco/Negro', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-air-max-dn-blanco-negro/01.webp', '/catalog/nike-air-max-dn-blanco-negro/02.webp', '/catalog/nike-air-max-dn-blanco-negro/03.webp']::text[], false, false, now() - interval '120 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-021-40'),
  (41, 5, 'FL-021-41'),
  (42, 5, 'FL-021-42'),
  (43, 5, 'FL-021-43'),
  (44, 5, 'FL-021-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-dn-blanco-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-dn-rojo', 'Air Max Dn Rojo', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-air-max-dn-rojo/01.webp', '/catalog/nike-air-max-dn-rojo/02.webp', '/catalog/nike-air-max-dn-rojo/03.webp', '/catalog/nike-air-max-dn-rojo/04.webp']::text[], false, false, now() - interval '126 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-022-40'),
  (41, 5, 'FL-022-41'),
  (42, 5, 'FL-022-42'),
  (43, 5, 'FL-022-43'),
  (44, 5, 'FL-022-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-dn-rojo';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-plus-blanco-naranja', 'Air Max Plus Blanco/Naranja', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-air-max-plus-blanco-naranja/01.webp', '/catalog/nike-air-max-plus-blanco-naranja/02.webp', '/catalog/nike-air-max-plus-blanco-naranja/03.webp']::text[], false, false, now() - interval '132 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-023-40'),
  (41, 5, 'FL-023-41'),
  (42, 5, 'FL-023-42'),
  (43, 5, 'FL-023-43'),
  (44, 5, 'FL-023-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-plus-blanco-naranja';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-plus-blanco-negro', 'Air Max Plus Blanco/Negro', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-air-max-plus-blanco-negro/01.webp', '/catalog/nike-air-max-plus-blanco-negro/02.webp', '/catalog/nike-air-max-plus-blanco-negro/03.webp']::text[], false, false, now() - interval '138 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-024-40'),
  (41, 5, 'FL-024-41'),
  (42, 5, 'FL-024-42'),
  (43, 5, 'FL-024-43'),
  (44, 5, 'FL-024-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-plus-blanco-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-plus-negro-naranja', 'Air Max Plus Negro/Naranja', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-air-max-plus-negro-naranja/01.webp', '/catalog/nike-air-max-plus-negro-naranja/02.webp', '/catalog/nike-air-max-plus-negro-naranja/03.webp', '/catalog/nike-air-max-plus-negro-naranja/04.webp']::text[], false, false, now() - interval '144 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-025-40'),
  (41, 5, 'FL-025-41'),
  (42, 5, 'FL-025-42'),
  (43, 5, 'FL-025-43'),
  (44, 5, 'FL-025-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-plus-negro-naranja';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-plus-verde', 'Air Max Plus Verde', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-air-max-plus-verde/01.webp', '/catalog/nike-air-max-plus-verde/02.webp', '/catalog/nike-air-max-plus-verde/03.webp']::text[], false, false, now() - interval '150 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-026-40'),
  (41, 5, 'FL-026-41'),
  (42, 5, 'FL-026-42'),
  (43, 5, 'FL-026-43'),
  (44, 5, 'FL-026-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-plus-verde';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-tn-blanco', 'Air Max TN Blanco', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-air-max-tn-blanco/01.webp', '/catalog/nike-air-max-tn-blanco/02.webp', '/catalog/nike-air-max-tn-blanco/03.webp']::text[], false, false, now() - interval '156 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-027-36'),
  (37, 5, 'FL-027-37'),
  (38, 5, 'FL-027-38'),
  (39, 5, 'FL-027-39'),
  (40, 5, 'FL-027-40'),
  (41, 5, 'FL-027-41'),
  (42, 5, 'FL-027-42'),
  (43, 5, 'FL-027-43'),
  (44, 5, 'FL-027-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-tn-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-tn-negro', 'Air Max TN Negro', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-air-max-tn-negro/01.webp', '/catalog/nike-air-max-tn-negro/02.webp', '/catalog/nike-air-max-tn-negro/03.webp', '/catalog/nike-air-max-tn-negro/04.webp', '/catalog/nike-air-max-tn-negro/05.webp', '/catalog/nike-air-max-tn-negro/06.webp', '/catalog/nike-air-max-tn-negro/07.webp']::text[], false, false, now() - interval '162 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-028-36'),
  (37, 5, 'FL-028-37'),
  (38, 5, 'FL-028-38'),
  (39, 5, 'FL-028-39'),
  (40, 5, 'FL-028-40'),
  (41, 5, 'FL-028-41'),
  (42, 5, 'FL-028-42'),
  (43, 5, 'FL-028-43'),
  (44, 5, 'FL-028-44')
) as v(size, stock, sku) where p.slug = 'nike-air-max-tn-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'boss-ttnm-evo', 'TTNM EVO', 'BOSS', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/boss-ttnm-evo/01.webp', '/catalog/boss-ttnm-evo/02.webp', '/catalog/boss-ttnm-evo/03.webp']::text[], false, false, now() - interval '168 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-029-40'),
  (41, 5, 'FL-029-41'),
  (42, 5, 'FL-029-42'),
  (43, 5, 'FL-029-43'),
  (44, 5, 'FL-029-44')
) as v(size, stock, sku) where p.slug = 'boss-ttnm-evo';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-1-retro-low', 'Air Jordan 1 Retro Low', 'Jordan', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/jordan-air-jordan-1-retro-low/01.webp', '/catalog/jordan-air-jordan-1-retro-low/02.webp', '/catalog/jordan-air-jordan-1-retro-low/03.webp']::text[], false, false, now() - interval '174 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-030-36'),
  (37, 5, 'FL-030-37'),
  (38, 5, 'FL-030-38'),
  (39, 5, 'FL-030-39'),
  (40, 5, 'FL-030-40'),
  (41, 5, 'FL-030-41'),
  (42, 5, 'FL-030-42'),
  (43, 5, 'FL-030-43'),
  (44, 5, 'FL-030-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-1-retro-low';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-1-retro-low-paris', 'Air Jordan 1 Retro Low ''Paris''', 'Jordan', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/jordan-air-jordan-1-retro-low-paris/01.webp', '/catalog/jordan-air-jordan-1-retro-low-paris/02.webp', '/catalog/jordan-air-jordan-1-retro-low-paris/03.webp']::text[], false, false, now() - interval '180 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-031-36'),
  (37, 5, 'FL-031-37'),
  (38, 5, 'FL-031-38'),
  (39, 5, 'FL-031-39'),
  (40, 5, 'FL-031-40'),
  (41, 5, 'FL-031-41'),
  (42, 5, 'FL-031-42'),
  (43, 5, 'FL-031-43'),
  (44, 5, 'FL-031-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-1-retro-low-paris';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-1-retro-space-jam', 'Air Jordan 1 Retro ''Space Jam''', 'Jordan', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/jordan-air-jordan-1-retro-space-jam/01.webp', '/catalog/jordan-air-jordan-1-retro-space-jam/02.webp', '/catalog/jordan-air-jordan-1-retro-space-jam/03.webp']::text[], false, false, now() - interval '186 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-032-36'),
  (37, 5, 'FL-032-37'),
  (38, 5, 'FL-032-38'),
  (39, 5, 'FL-032-39'),
  (40, 5, 'FL-032-40'),
  (41, 5, 'FL-032-41'),
  (42, 5, 'FL-032-42'),
  (43, 5, 'FL-032-43'),
  (44, 5, 'FL-032-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-1-retro-space-jam';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-11-retro-low-azul', 'Air Jordan 11 Retro Low Azul', 'Jordan', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/jordan-air-jordan-11-retro-low-azul/01.webp', '/catalog/jordan-air-jordan-11-retro-low-azul/02.webp', '/catalog/jordan-air-jordan-11-retro-low-azul/03.webp', '/catalog/jordan-air-jordan-11-retro-low-azul/04.webp', '/catalog/jordan-air-jordan-11-retro-low-azul/05.webp', '/catalog/jordan-air-jordan-11-retro-low-azul/06.webp', '/catalog/jordan-air-jordan-11-retro-low-azul/07.webp', '/catalog/jordan-air-jordan-11-retro-low-azul/08.webp']::text[], false, false, now() - interval '192 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-033-40'),
  (41, 5, 'FL-033-41'),
  (42, 5, 'FL-033-42'),
  (43, 5, 'FL-033-43'),
  (44, 5, 'FL-033-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-11-retro-low-azul';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-4-retro', 'Air Jordan 4 Retro', 'Jordan', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/jordan-air-jordan-4-retro/01.webp', '/catalog/jordan-air-jordan-4-retro/02.webp', '/catalog/jordan-air-jordan-4-retro/03.webp', '/catalog/jordan-air-jordan-4-retro/04.webp', '/catalog/jordan-air-jordan-4-retro/05.webp', '/catalog/jordan-air-jordan-4-retro/06.webp', '/catalog/jordan-air-jordan-4-retro/07.webp']::text[], false, false, now() - interval '198 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-034-40'),
  (41, 5, 'FL-034-41'),
  (42, 5, 'FL-034-42'),
  (43, 5, 'FL-034-43'),
  (44, 5, 'FL-034-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-4-retro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-cadence-blanco-gris', 'Air Cadence Blanco/Gris', 'Jordan', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/jordan-air-cadence-blanco-gris/01.webp', '/catalog/jordan-air-cadence-blanco-gris/02.webp', '/catalog/jordan-air-cadence-blanco-gris/03.webp']::text[], false, false, now() - interval '204 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-035-40'),
  (41, 5, 'FL-035-41'),
  (42, 5, 'FL-035-42'),
  (43, 5, 'FL-035-43'),
  (44, 5, 'FL-035-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-cadence-blanco-gris';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-cadence-negro', 'Air Cadence Negro', 'Jordan', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/jordan-air-cadence-negro/01.webp', '/catalog/jordan-air-cadence-negro/02.webp', '/catalog/jordan-air-cadence-negro/03.webp']::text[], false, false, now() - interval '210 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-036-40'),
  (41, 5, 'FL-036-41'),
  (42, 5, 'FL-036-42'),
  (43, 5, 'FL-036-43'),
  (44, 5, 'FL-036-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-cadence-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-1-retro-high-og-bred', 'Air Jordan 1 Retro High OG ''Bred''', 'Jordan', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/jordan-air-jordan-1-retro-high-og-bred/01.webp', '/catalog/jordan-air-jordan-1-retro-high-og-bred/02.webp', '/catalog/jordan-air-jordan-1-retro-high-og-bred/03.webp']::text[], false, false, now() - interval '216 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-037-36'),
  (37, 5, 'FL-037-37'),
  (38, 5, 'FL-037-38'),
  (39, 5, 'FL-037-39'),
  (40, 5, 'FL-037-40'),
  (41, 5, 'FL-037-41'),
  (42, 5, 'FL-037-42'),
  (43, 5, 'FL-037-43'),
  (44, 5, 'FL-037-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-1-retro-high-og-bred';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-1-retro-high-og-chicago', 'Air Jordan 1 Retro High OG ''Chicago''', 'Jordan', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/jordan-air-jordan-1-retro-high-og-chicago/01.webp', '/catalog/jordan-air-jordan-1-retro-high-og-chicago/02.webp', '/catalog/jordan-air-jordan-1-retro-high-og-chicago/03.webp']::text[], false, false, now() - interval '222 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-038-36'),
  (37, 5, 'FL-038-37'),
  (38, 5, 'FL-038-38'),
  (39, 5, 'FL-038-39'),
  (40, 5, 'FL-038-40'),
  (41, 5, 'FL-038-41'),
  (42, 5, 'FL-038-42'),
  (43, 5, 'FL-038-43'),
  (44, 5, 'FL-038-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-1-retro-high-og-chicago';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-11-retro-bred', 'Air Jordan 11 Retro ''Bred''', 'Jordan', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/jordan-air-jordan-11-retro-bred/01.webp', '/catalog/jordan-air-jordan-11-retro-bred/02.webp', '/catalog/jordan-air-jordan-11-retro-bred/03.webp', '/catalog/jordan-air-jordan-11-retro-bred/04.webp']::text[], false, false, now() - interval '228 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-039-36'),
  (37, 5, 'FL-039-37'),
  (38, 5, 'FL-039-38'),
  (39, 5, 'FL-039-39'),
  (40, 5, 'FL-039-40'),
  (41, 5, 'FL-039-41'),
  (42, 5, 'FL-039-42'),
  (43, 5, 'FL-039-43'),
  (44, 5, 'FL-039-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-11-retro-bred';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-11-retro-cool-grey', 'Air Jordan 11 Retro ''Cool Grey''', 'Jordan', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/jordan-air-jordan-11-retro-cool-grey/01.webp', '/catalog/jordan-air-jordan-11-retro-cool-grey/02.webp', '/catalog/jordan-air-jordan-11-retro-cool-grey/03.webp', '/catalog/jordan-air-jordan-11-retro-cool-grey/04.webp']::text[], false, false, now() - interval '234 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-040-36'),
  (37, 5, 'FL-040-37'),
  (38, 5, 'FL-040-38'),
  (39, 5, 'FL-040-39'),
  (40, 5, 'FL-040-40'),
  (41, 5, 'FL-040-41'),
  (42, 5, 'FL-040-42'),
  (43, 5, 'FL-040-43'),
  (44, 5, 'FL-040-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-11-retro-cool-grey';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'jordan-air-jordan-11-retro-low-negro-rojo', 'Air Jordan 11 Retro Low Negro/Rojo', 'Jordan', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/jordan-air-jordan-11-retro-low-negro-rojo/01.webp', '/catalog/jordan-air-jordan-11-retro-low-negro-rojo/02.webp', '/catalog/jordan-air-jordan-11-retro-low-negro-rojo/03.webp', '/catalog/jordan-air-jordan-11-retro-low-negro-rojo/04.webp', '/catalog/jordan-air-jordan-11-retro-low-negro-rojo/05.webp', '/catalog/jordan-air-jordan-11-retro-low-negro-rojo/06.webp']::text[], false, false, now() - interval '240 days'
from public.collections c where c.slug = 'basket';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-041-36'),
  (37, 5, 'FL-041-37'),
  (38, 5, 'FL-041-38'),
  (39, 5, 'FL-041-39'),
  (40, 5, 'FL-041-40'),
  (41, 5, 'FL-041-41'),
  (42, 5, 'FL-041-42'),
  (43, 5, 'FL-041-43'),
  (44, 5, 'FL-041-44')
) as v(size, stock, sku) where p.slug = 'jordan-air-jordan-11-retro-low-negro-rojo';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'new-balance-9060-gris', '9060 Gris', 'New Balance', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/new-balance-9060-gris/01.webp', '/catalog/new-balance-9060-gris/02.webp', '/catalog/new-balance-9060-gris/03.webp', '/catalog/new-balance-9060-gris/04.webp']::text[], false, false, now() - interval '246 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-042-36'),
  (37, 5, 'FL-042-37'),
  (38, 5, 'FL-042-38'),
  (39, 5, 'FL-042-39'),
  (40, 5, 'FL-042-40'),
  (41, 5, 'FL-042-41'),
  (42, 5, 'FL-042-42'),
  (43, 5, 'FL-042-43'),
  (44, 5, 'FL-042-44')
) as v(size, stock, sku) where p.slug = 'new-balance-9060-gris';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'new-balance-9060-negro', '9060 Negro', 'New Balance', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/new-balance-9060-negro/01.webp', '/catalog/new-balance-9060-negro/02.webp', '/catalog/new-balance-9060-negro/03.webp', '/catalog/new-balance-9060-negro/04.webp', '/catalog/new-balance-9060-negro/05.webp', '/catalog/new-balance-9060-negro/06.webp']::text[], false, false, now() - interval '252 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-043-36'),
  (37, 5, 'FL-043-37'),
  (38, 5, 'FL-043-38'),
  (39, 5, 'FL-043-39'),
  (40, 5, 'FL-043-40'),
  (41, 5, 'FL-043-41'),
  (42, 5, 'FL-043-42'),
  (43, 5, 'FL-043-43'),
  (44, 5, 'FL-043-44')
) as v(size, stock, sku) where p.slug = 'new-balance-9060-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'new-balance-9060-cafe', '9060 Café', 'New Balance', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/new-balance-9060-cafe/01.webp', '/catalog/new-balance-9060-cafe/02.webp', '/catalog/new-balance-9060-cafe/03.webp', '/catalog/new-balance-9060-cafe/04.webp', '/catalog/new-balance-9060-cafe/05.webp']::text[], false, false, now() - interval '258 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-044-36'),
  (37, 5, 'FL-044-37'),
  (38, 5, 'FL-044-38'),
  (39, 5, 'FL-044-39'),
  (40, 5, 'FL-044-40'),
  (41, 5, 'FL-044-41'),
  (42, 5, 'FL-044-42'),
  (43, 5, 'FL-044-43'),
  (44, 5, 'FL-044-44')
) as v(size, stock, sku) where p.slug = 'new-balance-9060-cafe';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'new-balance-9060-blanco', '9060 Blanco', 'New Balance', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/new-balance-9060-blanco/01.webp', '/catalog/new-balance-9060-blanco/02.webp', '/catalog/new-balance-9060-blanco/03.webp']::text[], false, false, now() - interval '264 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-045-36'),
  (37, 5, 'FL-045-37'),
  (38, 5, 'FL-045-38'),
  (39, 5, 'FL-045-39'),
  (40, 5, 'FL-045-40'),
  (41, 5, 'FL-045-41'),
  (42, 5, 'FL-045-42'),
  (43, 5, 'FL-045-43'),
  (44, 5, 'FL-045-44')
) as v(size, stock, sku) where p.slug = 'new-balance-9060-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'new-balance-9060-beige-rosa', '9060 Beige/Rosa', 'New Balance', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/new-balance-9060-beige-rosa/01.webp', '/catalog/new-balance-9060-beige-rosa/02.webp', '/catalog/new-balance-9060-beige-rosa/03.webp', '/catalog/new-balance-9060-beige-rosa/04.webp']::text[], false, false, now() - interval '270 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-046-36'),
  (37, 5, 'FL-046-37'),
  (38, 5, 'FL-046-38'),
  (39, 5, 'FL-046-39'),
  (40, 5, 'FL-046-40'),
  (41, 5, 'FL-046-41'),
  (42, 5, 'FL-046-42'),
  (43, 5, 'FL-046-43'),
  (44, 5, 'FL-046-44')
) as v(size, stock, sku) where p.slug = 'new-balance-9060-beige-rosa';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'new-balance-9060-blanco-gris', '9060 Blanco/Gris', 'New Balance', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/new-balance-9060-blanco-gris/01.webp', '/catalog/new-balance-9060-blanco-gris/02.webp', '/catalog/new-balance-9060-blanco-gris/03.webp', '/catalog/new-balance-9060-blanco-gris/04.webp', '/catalog/new-balance-9060-blanco-gris/05.webp', '/catalog/new-balance-9060-blanco-gris/06.webp']::text[], false, false, now() - interval '276 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-047-36'),
  (37, 5, 'FL-047-37'),
  (38, 5, 'FL-047-38'),
  (39, 5, 'FL-047-39'),
  (40, 5, 'FL-047-40'),
  (41, 5, 'FL-047-41'),
  (42, 5, 'FL-047-42'),
  (43, 5, 'FL-047-43'),
  (44, 5, 'FL-047-44')
) as v(size, stock, sku) where p.slug = 'new-balance-9060-blanco-gris';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-air-max-portal', 'Air Max Portal', 'Nike', 'Silueta femenina de líneas suaves en tono crema y beige. Capellada en malla con ondas en relieve, cordones tipo cinta satinada con detalle de perlas y unidad Air visible en el talón para una pisada amortiguada. Suela robusta y esculpida, y tirador en el talón para calzarlos fácilmente.', 175000, 200000, 'mujer',
       c.id, array['/catalog/nike-air-max-portal/01.webp', '/catalog/nike-air-max-portal/02.webp', '/catalog/nike-air-max-portal/03.webp', '/catalog/nike-air-max-portal/04.webp', '/catalog/nike-air-max-portal/05.webp', '/catalog/nike-air-max-portal/06.webp', '/catalog/nike-air-max-portal/07.webp']::text[], false, false, now() - interval '282 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-048-36'),
  (37, 5, 'FL-048-37'),
  (38, 5, 'FL-048-38'),
  (39, 5, 'FL-048-39')
) as v(size, stock, sku) where p.slug = 'nike-air-max-portal';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-cortez-blanco-rojo', 'Cortez Blanco/Rojo', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-cortez-blanco-rojo/01.webp', '/catalog/nike-cortez-blanco-rojo/02.webp', '/catalog/nike-cortez-blanco-rojo/03.webp', '/catalog/nike-cortez-blanco-rojo/04.webp', '/catalog/nike-cortez-blanco-rojo/05.webp', '/catalog/nike-cortez-blanco-rojo/06.webp', '/catalog/nike-cortez-blanco-rojo/07.webp', '/catalog/nike-cortez-blanco-rojo/08.webp']::text[], false, false, now() - interval '288 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-049-36'),
  (37, 5, 'FL-049-37'),
  (38, 5, 'FL-049-38'),
  (39, 5, 'FL-049-39'),
  (40, 5, 'FL-049-40'),
  (41, 5, 'FL-049-41'),
  (42, 5, 'FL-049-42'),
  (43, 5, 'FL-049-43'),
  (44, 5, 'FL-049-44')
) as v(size, stock, sku) where p.slug = 'nike-cortez-blanco-rojo';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-cortez-blanco-negro', 'Cortez Blanco/Negro', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-cortez-blanco-negro/01.webp', '/catalog/nike-cortez-blanco-negro/02.webp', '/catalog/nike-cortez-blanco-negro/03.webp', '/catalog/nike-cortez-blanco-negro/04.webp', '/catalog/nike-cortez-blanco-negro/05.webp', '/catalog/nike-cortez-blanco-negro/06.webp', '/catalog/nike-cortez-blanco-negro/07.webp', '/catalog/nike-cortez-blanco-negro/08.webp']::text[], false, false, now() - interval '294 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-050-36'),
  (37, 5, 'FL-050-37'),
  (38, 5, 'FL-050-38'),
  (39, 5, 'FL-050-39'),
  (40, 5, 'FL-050-40'),
  (41, 5, 'FL-050-41'),
  (42, 5, 'FL-050-42'),
  (43, 5, 'FL-050-43'),
  (44, 5, 'FL-050-44')
) as v(size, stock, sku) where p.slug = 'nike-cortez-blanco-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-initiator', 'Initiator', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-initiator/01.webp', '/catalog/nike-initiator/02.webp', '/catalog/nike-initiator/03.webp', '/catalog/nike-initiator/04.webp']::text[], false, false, now() - interval '300 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-051-36'),
  (37, 5, 'FL-051-37'),
  (38, 5, 'FL-051-38'),
  (39, 5, 'FL-051-39'),
  (40, 5, 'FL-051-40'),
  (41, 5, 'FL-051-41'),
  (42, 5, 'FL-051-42'),
  (43, 5, 'FL-051-43'),
  (44, 5, 'FL-051-44')
) as v(size, stock, sku) where p.slug = 'nike-initiator';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-mind-001-rojo', 'Mind 001 Rojo', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-mind-001-rojo/01.webp', '/catalog/nike-mind-001-rojo/02.webp', '/catalog/nike-mind-001-rojo/03.webp', '/catalog/nike-mind-001-rojo/04.webp', '/catalog/nike-mind-001-rojo/05.webp', '/catalog/nike-mind-001-rojo/06.webp']::text[], false, false, now() - interval '306 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-052-36'),
  (37, 5, 'FL-052-37'),
  (38, 5, 'FL-052-38'),
  (39, 5, 'FL-052-39'),
  (40, 5, 'FL-052-40'),
  (41, 5, 'FL-052-41'),
  (42, 5, 'FL-052-42'),
  (43, 5, 'FL-052-43'),
  (44, 5, 'FL-052-44')
) as v(size, stock, sku) where p.slug = 'nike-mind-001-rojo';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-mind-001-verde', 'Mind 001 Verde', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-mind-001-verde/01.webp', '/catalog/nike-mind-001-verde/02.webp', '/catalog/nike-mind-001-verde/03.webp', '/catalog/nike-mind-001-verde/04.webp']::text[], false, false, now() - interval '312 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-053-36'),
  (37, 5, 'FL-053-37'),
  (38, 5, 'FL-053-38'),
  (39, 5, 'FL-053-39'),
  (40, 5, 'FL-053-40'),
  (41, 5, 'FL-053-41'),
  (42, 5, 'FL-053-42'),
  (43, 5, 'FL-053-43'),
  (44, 5, 'FL-053-44')
) as v(size, stock, sku) where p.slug = 'nike-mind-001-verde';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-mind-001-azul', 'Mind 001 Azul', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-mind-001-azul/01.webp', '/catalog/nike-mind-001-azul/02.webp', '/catalog/nike-mind-001-azul/03.webp']::text[], false, false, now() - interval '318 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-054-36'),
  (37, 5, 'FL-054-37'),
  (38, 5, 'FL-054-38'),
  (39, 5, 'FL-054-39'),
  (40, 5, 'FL-054-40'),
  (41, 5, 'FL-054-41'),
  (42, 5, 'FL-054-42'),
  (43, 5, 'FL-054-43'),
  (44, 5, 'FL-054-44')
) as v(size, stock, sku) where p.slug = 'nike-mind-001-azul';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-mind-001-blanco', 'Mind 001 Blanco', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-mind-001-blanco/01.webp', '/catalog/nike-mind-001-blanco/02.webp', '/catalog/nike-mind-001-blanco/03.webp', '/catalog/nike-mind-001-blanco/04.webp']::text[], false, false, now() - interval '324 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-055-36'),
  (37, 5, 'FL-055-37'),
  (38, 5, 'FL-055-38'),
  (39, 5, 'FL-055-39'),
  (40, 5, 'FL-055-40'),
  (41, 5, 'FL-055-41'),
  (42, 5, 'FL-055-42'),
  (43, 5, 'FL-055-43'),
  (44, 5, 'FL-055-44')
) as v(size, stock, sku) where p.slug = 'nike-mind-001-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-mind-001-crema', 'Mind 001 Crema', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-mind-001-crema/01.webp', '/catalog/nike-mind-001-crema/02.webp', '/catalog/nike-mind-001-crema/03.webp', '/catalog/nike-mind-001-crema/04.webp', '/catalog/nike-mind-001-crema/05.webp', '/catalog/nike-mind-001-crema/06.webp']::text[], false, false, now() - interval '330 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-056-36'),
  (37, 5, 'FL-056-37'),
  (38, 5, 'FL-056-38'),
  (39, 5, 'FL-056-39'),
  (40, 5, 'FL-056-40'),
  (41, 5, 'FL-056-41'),
  (42, 5, 'FL-056-42'),
  (43, 5, 'FL-056-43'),
  (44, 5, 'FL-056-44')
) as v(size, stock, sku) where p.slug = 'nike-mind-001-crema';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-mind-001-negro', 'Mind 001 Negro', 'Nike', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/nike-mind-001-negro/01.webp', '/catalog/nike-mind-001-negro/02.webp', '/catalog/nike-mind-001-negro/03.webp', '/catalog/nike-mind-001-negro/04.webp', '/catalog/nike-mind-001-negro/05.webp']::text[], false, false, now() - interval '336 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-057-36'),
  (37, 5, 'FL-057-37'),
  (38, 5, 'FL-057-38'),
  (39, 5, 'FL-057-39'),
  (40, 5, 'FL-057-40'),
  (41, 5, 'FL-057-41'),
  (42, 5, 'FL-057-42'),
  (43, 5, 'FL-057-43'),
  (44, 5, 'FL-057-44')
) as v(size, stock, sku) where p.slug = 'nike-mind-001-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-nocta-hot-step-2-negro', 'NOCTA Hot Step 2 Negro', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-nocta-hot-step-2-negro/01.webp', '/catalog/nike-nocta-hot-step-2-negro/02.webp', '/catalog/nike-nocta-hot-step-2-negro/03.webp', '/catalog/nike-nocta-hot-step-2-negro/04.webp']::text[], false, false, now() - interval '342 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-058-40'),
  (41, 5, 'FL-058-41'),
  (42, 5, 'FL-058-42'),
  (43, 5, 'FL-058-43'),
  (44, 5, 'FL-058-44')
) as v(size, stock, sku) where p.slug = 'nike-nocta-hot-step-2-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-nocta-hot-step-2-blanco', 'NOCTA Hot Step 2 Blanco', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-nocta-hot-step-2-blanco/01.webp', '/catalog/nike-nocta-hot-step-2-blanco/02.webp', '/catalog/nike-nocta-hot-step-2-blanco/03.webp']::text[], false, false, now() - interval '348 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-059-40'),
  (41, 5, 'FL-059-41'),
  (42, 5, 'FL-059-42'),
  (43, 5, 'FL-059-43'),
  (44, 5, 'FL-059-44')
) as v(size, stock, sku) where p.slug = 'nike-nocta-hot-step-2-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-shox-r4-blanco', 'Shox R4 Blanco', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-shox-r4-blanco/01.webp', '/catalog/nike-shox-r4-blanco/02.webp']::text[], false, false, now() - interval '354 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-060-40'),
  (41, 5, 'FL-060-41'),
  (42, 5, 'FL-060-42'),
  (43, 5, 'FL-060-43'),
  (44, 5, 'FL-060-44')
) as v(size, stock, sku) where p.slug = 'nike-shox-r4-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-shox-r4-dorado', 'Shox R4 Dorado', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-shox-r4-dorado/01.webp', '/catalog/nike-shox-r4-dorado/02.webp']::text[], false, false, now() - interval '360 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-061-40'),
  (41, 5, 'FL-061-41'),
  (42, 5, 'FL-061-42'),
  (43, 5, 'FL-061-43'),
  (44, 5, 'FL-061-44')
) as v(size, stock, sku) where p.slug = 'nike-shox-r4-dorado';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-shox-r4-rojo', 'Shox R4 Rojo', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-shox-r4-rojo/01.webp', '/catalog/nike-shox-r4-rojo/02.webp']::text[], false, false, now() - interval '366 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-062-40'),
  (41, 5, 'FL-062-41'),
  (42, 5, 'FL-062-42'),
  (43, 5, 'FL-062-43'),
  (44, 5, 'FL-062-44')
) as v(size, stock, sku) where p.slug = 'nike-shox-r4-rojo';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-shox-ride-2-negro', 'Shox Ride 2 Negro', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-shox-ride-2-negro/01.webp', '/catalog/nike-shox-ride-2-negro/02.webp', '/catalog/nike-shox-ride-2-negro/03.webp', '/catalog/nike-shox-ride-2-negro/04.webp', '/catalog/nike-shox-ride-2-negro/05.webp', '/catalog/nike-shox-ride-2-negro/06.webp', '/catalog/nike-shox-ride-2-negro/07.webp', '/catalog/nike-shox-ride-2-negro/08.webp']::text[], false, false, now() - interval '372 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-063-40'),
  (41, 5, 'FL-063-41'),
  (42, 5, 'FL-063-42'),
  (43, 5, 'FL-063-43'),
  (44, 5, 'FL-063-44')
) as v(size, stock, sku) where p.slug = 'nike-shox-ride-2-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-shox-ride-2-x-supreme-plata', 'Shox Ride 2 x Supreme Plata', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-shox-ride-2-x-supreme-plata/01.webp', '/catalog/nike-shox-ride-2-x-supreme-plata/02.webp', '/catalog/nike-shox-ride-2-x-supreme-plata/03.webp']::text[], false, false, now() - interval '378 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-064-40'),
  (41, 5, 'FL-064-41'),
  (42, 5, 'FL-064-42'),
  (43, 5, 'FL-064-43'),
  (44, 5, 'FL-064-44')
) as v(size, stock, sku) where p.slug = 'nike-shox-ride-2-x-supreme-plata';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-shox-ride-2-x-supreme-negro', 'Shox Ride 2 x Supreme Negro', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-shox-ride-2-x-supreme-negro/01.webp', '/catalog/nike-shox-ride-2-x-supreme-negro/02.webp', '/catalog/nike-shox-ride-2-x-supreme-negro/03.webp']::text[], false, false, now() - interval '384 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-065-40'),
  (41, 5, 'FL-065-41'),
  (42, 5, 'FL-065-42'),
  (43, 5, 'FL-065-43'),
  (44, 5, 'FL-065-44')
) as v(size, stock, sku) where p.slug = 'nike-shox-ride-2-x-supreme-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-shox-ride-2-gris', 'Shox Ride 2 Gris', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-shox-ride-2-gris/01.webp', '/catalog/nike-shox-ride-2-gris/02.webp', '/catalog/nike-shox-ride-2-gris/03.webp', '/catalog/nike-shox-ride-2-gris/04.webp', '/catalog/nike-shox-ride-2-gris/05.webp']::text[], false, false, now() - interval '390 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-066-40'),
  (41, 5, 'FL-066-41'),
  (42, 5, 'FL-066-42'),
  (43, 5, 'FL-066-43'),
  (44, 5, 'FL-066-44')
) as v(size, stock, sku) where p.slug = 'nike-shox-ride-2-gris';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-shox-ride-2-crema-negro', 'Shox Ride 2 Crema/Negro', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-shox-ride-2-crema-negro/01.webp', '/catalog/nike-shox-ride-2-crema-negro/02.webp', '/catalog/nike-shox-ride-2-crema-negro/03.webp', '/catalog/nike-shox-ride-2-crema-negro/04.webp']::text[], false, false, now() - interval '396 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-067-40'),
  (41, 5, 'FL-067-41'),
  (42, 5, 'FL-067-42'),
  (43, 5, 'FL-067-43'),
  (44, 5, 'FL-067-44')
) as v(size, stock, sku) where p.slug = 'nike-shox-ride-2-crema-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-shox-tl-negro', 'Shox TL Negro', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-shox-tl-negro/01.webp', '/catalog/nike-shox-tl-negro/02.webp', '/catalog/nike-shox-tl-negro/03.webp']::text[], false, false, now() - interval '402 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-068-40'),
  (41, 5, 'FL-068-41'),
  (42, 5, 'FL-068-42'),
  (43, 5, 'FL-068-43'),
  (44, 5, 'FL-068-44')
) as v(size, stock, sku) where p.slug = 'nike-shox-tl-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-shox-tl-blanco', 'Shox TL Blanco', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-shox-tl-blanco/01.webp', '/catalog/nike-shox-tl-blanco/02.webp', '/catalog/nike-shox-tl-blanco/03.webp']::text[], false, false, now() - interval '408 days'
from public.collections c where c.slug = 'retro';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-069-40'),
  (41, 5, 'FL-069-41'),
  (42, 5, 'FL-069-42'),
  (43, 5, 'FL-069-43'),
  (44, 5, 'FL-069-44')
) as v(size, stock, sku) where p.slug = 'nike-shox-tl-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'on-cloud-6-negro', 'Cloud 6 Negro', 'On', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/on-cloud-6-negro/01.webp', '/catalog/on-cloud-6-negro/02.webp', '/catalog/on-cloud-6-negro/03.webp']::text[], false, false, now() - interval '414 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-070-36'),
  (37, 5, 'FL-070-37'),
  (38, 5, 'FL-070-38'),
  (39, 5, 'FL-070-39'),
  (40, 5, 'FL-070-40'),
  (41, 5, 'FL-070-41'),
  (42, 5, 'FL-070-42'),
  (43, 5, 'FL-070-43'),
  (44, 5, 'FL-070-44')
) as v(size, stock, sku) where p.slug = 'on-cloud-6-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'on-cloud-6-morado', 'Cloud 6 Morado', 'On', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/on-cloud-6-morado/01.webp', '/catalog/on-cloud-6-morado/02.webp', '/catalog/on-cloud-6-morado/03.webp', '/catalog/on-cloud-6-morado/04.webp']::text[], false, false, now() - interval '420 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-071-36'),
  (37, 5, 'FL-071-37'),
  (38, 5, 'FL-071-38'),
  (39, 5, 'FL-071-39'),
  (40, 5, 'FL-071-40'),
  (41, 5, 'FL-071-41'),
  (42, 5, 'FL-071-42'),
  (43, 5, 'FL-071-43'),
  (44, 5, 'FL-071-44')
) as v(size, stock, sku) where p.slug = 'on-cloud-6-morado';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'on-cloudboom-volt-negro', 'Cloudboom Volt Negro', 'On', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/on-cloudboom-volt-negro/01.webp', '/catalog/on-cloudboom-volt-negro/02.webp', '/catalog/on-cloudboom-volt-negro/03.webp', '/catalog/on-cloudboom-volt-negro/04.webp']::text[], false, false, now() - interval '426 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-072-36'),
  (37, 5, 'FL-072-37'),
  (38, 5, 'FL-072-38'),
  (39, 5, 'FL-072-39'),
  (40, 5, 'FL-072-40'),
  (41, 5, 'FL-072-41'),
  (42, 5, 'FL-072-42'),
  (43, 5, 'FL-072-43'),
  (44, 5, 'FL-072-44')
) as v(size, stock, sku) where p.slug = 'on-cloudboom-volt-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'on-cloudboom-volt-rosa', 'Cloudboom Volt Rosa', 'On', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/on-cloudboom-volt-rosa/01.webp', '/catalog/on-cloudboom-volt-rosa/02.webp', '/catalog/on-cloudboom-volt-rosa/03.webp', '/catalog/on-cloudboom-volt-rosa/04.webp']::text[], false, false, now() - interval '432 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-073-36'),
  (37, 5, 'FL-073-37'),
  (38, 5, 'FL-073-38'),
  (39, 5, 'FL-073-39'),
  (40, 5, 'FL-073-40'),
  (41, 5, 'FL-073-41'),
  (42, 5, 'FL-073-42'),
  (43, 5, 'FL-073-43'),
  (44, 5, 'FL-073-44')
) as v(size, stock, sku) where p.slug = 'on-cloudboom-volt-rosa';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'on-cloudboom-volt-morado', 'Cloudboom Volt Morado', 'On', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/on-cloudboom-volt-morado/01.webp', '/catalog/on-cloudboom-volt-morado/02.webp', '/catalog/on-cloudboom-volt-morado/03.webp']::text[], false, false, now() - interval '438 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-074-36'),
  (37, 5, 'FL-074-37'),
  (38, 5, 'FL-074-38'),
  (39, 5, 'FL-074-39'),
  (40, 5, 'FL-074-40'),
  (41, 5, 'FL-074-41'),
  (42, 5, 'FL-074-42'),
  (43, 5, 'FL-074-43'),
  (44, 5, 'FL-074-44')
) as v(size, stock, sku) where p.slug = 'on-cloudboom-volt-morado';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'on-cloudsurfer-2', 'Cloudsurfer 2', 'On', '', 175000, 200000, 'mujer',
       c.id, array['/catalog/on-cloudsurfer-2/01.webp', '/catalog/on-cloudsurfer-2/02.webp', '/catalog/on-cloudsurfer-2/03.webp']::text[], false, false, now() - interval '444 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-075-36'),
  (37, 5, 'FL-075-37'),
  (38, 5, 'FL-075-38'),
  (39, 5, 'FL-075-39')
) as v(size, stock, sku) where p.slug = 'on-cloudsurfer-2';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'on-cloudnova', 'Cloudnova', 'On', '', 175000, 200000, 'mujer',
       c.id, array['/catalog/on-cloudnova/01.webp', '/catalog/on-cloudnova/02.webp', '/catalog/on-cloudnova/03.webp', '/catalog/on-cloudnova/04.webp', '/catalog/on-cloudnova/05.webp']::text[], false, false, now() - interval '450 days'
from public.collections c where c.slug = 'running';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-076-36'),
  (37, 5, 'FL-076-37'),
  (38, 5, 'FL-076-38'),
  (39, 5, 'FL-076-39')
) as v(size, stock, sku) where p.slug = 'on-cloudnova';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'puma-indoor-og', 'Indoor OG', 'Puma', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/puma-indoor-og/01.webp', '/catalog/puma-indoor-og/02.webp', '/catalog/puma-indoor-og/03.webp']::text[], false, false, now() - interval '456 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-077-40'),
  (41, 5, 'FL-077-41'),
  (42, 5, 'FL-077-42'),
  (43, 5, 'FL-077-43'),
  (44, 5, 'FL-077-44')
) as v(size, stock, sku) where p.slug = 'puma-indoor-og';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'puma-club-ii-era', 'Club II Era', 'Puma', '', 175000, 200000, 'mujer',
       c.id, array['/catalog/puma-club-ii-era/01.webp', '/catalog/puma-club-ii-era/02.webp', '/catalog/puma-club-ii-era/03.webp']::text[], false, false, now() - interval '462 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-078-36'),
  (37, 5, 'FL-078-37'),
  (38, 5, 'FL-078-38'),
  (39, 5, 'FL-078-39')
) as v(size, stock, sku) where p.slug = 'puma-club-ii-era';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'puma-suede-blanco', 'Suede Blanco', 'Puma', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/puma-suede-blanco/01.webp', '/catalog/puma-suede-blanco/02.webp', '/catalog/puma-suede-blanco/03.webp', '/catalog/puma-suede-blanco/04.webp', '/catalog/puma-suede-blanco/05.webp']::text[], false, false, now() - interval '468 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-079-36'),
  (37, 5, 'FL-079-37'),
  (38, 5, 'FL-079-38'),
  (39, 5, 'FL-079-39'),
  (40, 5, 'FL-079-40'),
  (41, 5, 'FL-079-41'),
  (42, 5, 'FL-079-42'),
  (43, 5, 'FL-079-43'),
  (44, 5, 'FL-079-44')
) as v(size, stock, sku) where p.slug = 'puma-suede-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'puma-suede-negro', 'Suede Negro', 'Puma', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/puma-suede-negro/01.webp', '/catalog/puma-suede-negro/02.webp', '/catalog/puma-suede-negro/03.webp', '/catalog/puma-suede-negro/04.webp', '/catalog/puma-suede-negro/05.webp', '/catalog/puma-suede-negro/06.webp']::text[], false, false, now() - interval '474 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-080-36'),
  (37, 5, 'FL-080-37'),
  (38, 5, 'FL-080-38'),
  (39, 5, 'FL-080-39'),
  (40, 5, 'FL-080-40'),
  (41, 5, 'FL-080-41'),
  (42, 5, 'FL-080-42'),
  (43, 5, 'FL-080-43'),
  (44, 5, 'FL-080-44')
) as v(size, stock, sku) where p.slug = 'puma-suede-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'puma-suede-crema-negro', 'Suede Crema/Negro', 'Puma', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/puma-suede-crema-negro/01.webp', '/catalog/puma-suede-crema-negro/02.webp', '/catalog/puma-suede-crema-negro/03.webp', '/catalog/puma-suede-crema-negro/04.webp', '/catalog/puma-suede-crema-negro/05.webp']::text[], false, false, now() - interval '480 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-081-36'),
  (37, 5, 'FL-081-37'),
  (38, 5, 'FL-081-38'),
  (39, 5, 'FL-081-39'),
  (40, 5, 'FL-081-40'),
  (41, 5, 'FL-081-41'),
  (42, 5, 'FL-081-42'),
  (43, 5, 'FL-081-43'),
  (44, 5, 'FL-081-44')
) as v(size, stock, sku) where p.slug = 'puma-suede-crema-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'puma-suede-xl-negro-blanco', 'Suede XL Negro/Blanco', 'Puma', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/puma-suede-xl-negro-blanco/01.webp', '/catalog/puma-suede-xl-negro-blanco/02.webp', '/catalog/puma-suede-xl-negro-blanco/03.webp', '/catalog/puma-suede-xl-negro-blanco/04.webp', '/catalog/puma-suede-xl-negro-blanco/05.webp']::text[], false, false, now() - interval '486 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-082-36'),
  (37, 5, 'FL-082-37'),
  (38, 5, 'FL-082-38'),
  (39, 5, 'FL-082-39'),
  (40, 5, 'FL-082-40'),
  (41, 5, 'FL-082-41'),
  (42, 5, 'FL-082-42'),
  (43, 5, 'FL-082-43'),
  (44, 5, 'FL-082-44')
) as v(size, stock, sku) where p.slug = 'puma-suede-xl-negro-blanco';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'puma-suede-xl-negro', 'Suede XL Negro', 'Puma', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/puma-suede-xl-negro/01.webp', '/catalog/puma-suede-xl-negro/02.webp', '/catalog/puma-suede-xl-negro/03.webp', '/catalog/puma-suede-xl-negro/04.webp', '/catalog/puma-suede-xl-negro/05.webp']::text[], false, false, now() - interval '492 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-083-36'),
  (37, 5, 'FL-083-37'),
  (38, 5, 'FL-083-38'),
  (39, 5, 'FL-083-39'),
  (40, 5, 'FL-083-40'),
  (41, 5, 'FL-083-41'),
  (42, 5, 'FL-083-42'),
  (43, 5, 'FL-083-43'),
  (44, 5, 'FL-083-44')
) as v(size, stock, sku) where p.slug = 'puma-suede-xl-negro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'adidas-samba-og', 'Samba OG', 'Adidas', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/adidas-samba-og/01.webp', '/catalog/adidas-samba-og/02.webp', '/catalog/adidas-samba-og/03.webp', '/catalog/adidas-samba-og/04.webp', '/catalog/adidas-samba-og/05.webp', '/catalog/adidas-samba-og/06.webp', '/catalog/adidas-samba-og/07.webp', '/catalog/adidas-samba-og/08.webp']::text[], false, false, now() - interval '498 days'
from public.collections c where c.slug = 'clasicos';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-084-36'),
  (37, 5, 'FL-084-37'),
  (38, 5, 'FL-084-38'),
  (39, 5, 'FL-084-39'),
  (40, 5, 'FL-084-40'),
  (41, 5, 'FL-084-41'),
  (42, 5, 'FL-084-42'),
  (43, 5, 'FL-084-43'),
  (44, 5, 'FL-084-44')
) as v(size, stock, sku) where p.slug = 'adidas-samba-og';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'calvin-klein-sandalia', 'Sandalia', 'Calvin Klein', '', 175000, 200000, 'mujer',
       c.id, array['/catalog/calvin-klein-sandalia/01.webp', '/catalog/calvin-klein-sandalia/02.webp']::text[], false, false, now() - interval '504 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-085-36'),
  (37, 5, 'FL-085-37'),
  (38, 5, 'FL-085-38'),
  (39, 5, 'FL-085-39')
) as v(size, stock, sku) where p.slug = 'calvin-klein-sandalia';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'nike-sb-dunk-low-x-otomo-katsuhiro', 'SB Dunk Low x Otomo Katsuhiro', 'Nike', '', 175000, 200000, 'hombre',
       c.id, array['/catalog/nike-sb-dunk-low-x-otomo-katsuhiro/01.webp', '/catalog/nike-sb-dunk-low-x-otomo-katsuhiro/02.webp', '/catalog/nike-sb-dunk-low-x-otomo-katsuhiro/03.webp', '/catalog/nike-sb-dunk-low-x-otomo-katsuhiro/04.webp', '/catalog/nike-sb-dunk-low-x-otomo-katsuhiro/05.webp']::text[], false, false, now() - interval '510 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (40, 5, 'FL-086-40'),
  (41, 5, 'FL-086-41'),
  (42, 5, 'FL-086-42'),
  (43, 5, 'FL-086-43'),
  (44, 5, 'FL-086-44')
) as v(size, stock, sku) where p.slug = 'nike-sb-dunk-low-x-otomo-katsuhiro';

insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)
select 'timberland-bota', 'Bota', 'Timberland', '', 175000, 200000, 'unisex',
       c.id, array['/catalog/timberland-bota/01.webp', '/catalog/timberland-bota/02.webp', '/catalog/timberland-bota/03.webp']::text[], false, false, now() - interval '516 days'
from public.collections c where c.slug = 'street';

insert into public.product_variants (product_id, size, stock, sku)
select p.id, v.size, v.stock, v.sku from public.products p, (values
  (36, 5, 'FL-087-36'),
  (37, 5, 'FL-087-37'),
  (38, 5, 'FL-087-38'),
  (39, 5, 'FL-087-39'),
  (40, 5, 'FL-087-40'),
  (41, 5, 'FL-087-41'),
  (42, 5, 'FL-087-42'),
  (43, 5, 'FL-087-43'),
  (44, 5, 'FL-087-44')
) as v(size, stock, sku) where p.slug = 'timberland-bota';

-- Fotos de ejemplo de la comunidad
delete from public.community_photos;
insert into public.community_photos (image, handle, product_id, sort_order) select 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&h=1500&q=80', null, null, 0;
insert into public.community_photos (image, handle, product_id, sort_order) select 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=1200&h=1500&q=80', null, null, 1;
insert into public.community_photos (image, handle, product_id, sort_order) select 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&h=1500&q=80', null, null, 2;
insert into public.community_photos (image, handle, product_id, sort_order) select 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&h=1500&q=80', null, null, 3;

commit;
