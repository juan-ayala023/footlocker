// Genera supabase/seed.sql a partir de src/data/catalog-seed.ts
// Uso: npm run db:seed:generate
import { writeFileSync } from "node:fs";
import { seedCollections, seedProducts } from "../src/data/catalog-seed.ts";

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
    .map((c) => `  (${q(c.slug)}, ${q(c.name)}, ${q(c.description)}, ${q(c.image)}, ${c.sort_order})`)
    .join(",\n") + ";",
  "",
];

seedProducts.forEach((p, i) => {
  // created_at escalonado para que "Nuevos" tenga un orden estable.
  lines.push(
    `insert into public.products (slug, name, brand, description, price, compare_at_price, gender, collection_id, images, featured, created_at)`,
    `select ${q(p.slug)}, ${q(p.name)}, ${q(p.brand)}, ${q(p.description)}, ${p.price}, ${p.compare_at_price ?? "null"}, '${p.gender}',`,
    `       c.id, ${arr(p.images)}, ${p.featured}, now() - interval '${i} days'`,
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

lines.push("commit;", "");

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), lines.join("\n"));
console.log(`seed.sql: ${seedCollections.length} colecciones, ${seedProducts.length} productos`);
