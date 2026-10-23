// Genera supabase/seed.sql a partir de src/data/catalog-seed.ts
// Uso: npm run db:seed:generate
import { readFileSync, writeFileSync } from "node:fs";
import { SEED_DAYS_APART, seedCollections, seedCommunity, seedProducts, type SeedProduct } from "../src/data/catalog-seed.ts";

// Catálogo real importado (npm run catalog:build); si está vacío, se usan los productos de ejemplo.
const imported: SeedProduct[] = JSON.parse(readFileSync(new URL("../src/data/catalog-import.json", import.meta.url), "utf8"));
const products = imported.length > 0 ? imported : seedProducts;
const slugs = new Set(products.map((p) => p.slug));
// Con catálogo importado, la foto de cada colección es la portada de uno de sus modelos.
const cover = (slug: string) =>
  imported.length > 0 ? (products.find((p) => p.collection === slug && p.featured) ?? products.find((p) => p.collection === slug))?.images[0] : undefined;

const q = (v: string | null) => (v === null ? "null" : `'${v.replaceAll("'", "''")}'`);
const arr = (items: string[]) => `array[${items.map(q).join(", ")}]::text[]`;

const lines: string[] = [
  "-- Generado por scripts/generate-seed.ts. No editar a mano.",
  "-- Borra y vuelve a crear el catálogo de ejemplo (no toca pedidos).",
  "",
  "begin;",
  "",
  "delete from public.product_variants where product_id in (select id from public.products);",
  "delete from public.products;",
  "delete from public.collections;",
  "",
  "insert into public.collections (slug, name, description, image, sort_order) values",
  seedCollections
    .map((c) => `  (${q(c.slug)}, ${q(c.name)}, ${q(c.description)}, ${q(cover(c.slug) ?? c.image)}, ${c.sort_order})`)
    .join(",\n") + ";",
  "",
];

products.forEach((p, i) => {
  // created_at escalonado para que "Nuevos" tenga un orden estable.
  lines.push(
    `insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, best_seller, created_at)`,
    `select ${q(p.slug)}, ${q(p.name)}, ${q(p.brand)}, ${q(p.description)}, ${p.price}, ${p.compare_at_price ?? "null"}, '${p.gender}',`,
    `       c.id, ${arr(p.images)}, ${p.featured}, ${p.best_seller}, now() - interval '${i * SEED_DAYS_APART} days'`,
    `from public.collections c where c.slug = ${q(p.collection)};`,
    "",
    "insert into public.product_variants (product_id, size, stock, sku)",
    "select p.id, v.size, v.stock, v.sku from public.products p, (values",
    p.sizes
      .map(([size, stock]) => `  (${size}, ${stock}, ${q(`FL-${String(i + 1).padStart(3, "0")}-${size}`)})`)
      .join(",\n"),
    `) as v(size, stock, sku) where p.slug = ${q(p.slug)};`,
    "",
  );
});

lines.push(
  "-- Fotos de ejemplo de la comunidad",
  "delete from public.community_photos;",
  ...seedCommunity.map(
    (c, i) =>
      `insert into public.community_photos (image, handle, product_id, sort_order) select ${q(c.image)}, ${q(c.handle)}, ${c.product && slugs.has(c.product) ? `(select id from public.products where slug = ${q(c.product)})` : "null"}, ${i};`,
  ),
  "",
);

lines.push("commit;", "");

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), lines.join("\n"));
console.log(`seed.sql: ${seedCollections.length} colecciones, ${products.length} productos${imported.length ? " (catálogo importado)" : " (ejemplo)"}`);
