// Filtros del catálogo: funciones puras compartidas por servidor y cliente.
// La URL es la fuente de verdad: ?marca=nike,adidas&talla=40,41&genero=mujer&coleccion=retro&precio_min=300000&precio_max=700000&orden=precio-asc
import type { Gender, Product } from "@/types/catalog";

export const SORTS = [
  { value: "relevancia", label: "Destacados" },
  { value: "nuevos", label: "Lo más nuevo" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
] as const;

export type Sort = (typeof SORTS)[number]["value"];

export type Filters = {
  marca: string[];
  talla: number[];
  genero: Gender[];
  coleccion: string[];
  min: number | null;
  max: number | null;
  orden: Sort;
};

export const GENDERS: { value: Gender; label: string }[] = [
  { value: "hombre", label: "Hombre" },
  { value: "mujer", label: "Mujer" },
  { value: "unisex", label: "Unisex" },
];

export const emptyFilters: Filters = {
  marca: [],
  talla: [],
  genero: [],
  coleccion: [],
  min: null,
  max: null,
  orden: "relevancia",
};

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function read(sp: ParamSource, key: string): string | undefined {
  if (sp instanceof URLSearchParams) return sp.get(key) ?? undefined;
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

const list = (v?: string) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
const int = (v?: string) => (v && /^\d+$/.test(v) ? Number(v) : null);

export const brandKey = (brand: string) => brand.toLowerCase().replace(/\s+/g, "-");

export function parseFilters(sp: ParamSource): Filters {
  const orden = read(sp, "orden");
  return {
    marca: list(read(sp, "marca")),
    talla: list(read(sp, "talla")).map(Number).filter((n) => !Number.isNaN(n)),
    genero: list(read(sp, "genero")).filter((g): g is Gender => GENDERS.some((x) => x.value === g)),
    coleccion: list(read(sp, "coleccion")),
    min: int(read(sp, "precio_min")),
    max: int(read(sp, "precio_max")),
    orden: SORTS.some((s) => s.value === orden) ? (orden as Sort) : "relevancia",
  };
}

export function serializeFilters(f: Filters): string {
  const sp = new URLSearchParams();
  if (f.coleccion.length) sp.set("coleccion", f.coleccion.join(","));
  if (f.genero.length) sp.set("genero", f.genero.join(","));
  if (f.marca.length) sp.set("marca", f.marca.join(","));
  if (f.talla.length) sp.set("talla", [...f.talla].sort((a, b) => a - b).join(","));
  if (f.min !== null) sp.set("precio_min", String(f.min));
  if (f.max !== null) sp.set("precio_max", String(f.max));
  if (f.orden !== "relevancia") sp.set("orden", f.orden);
  const qs = sp.toString().replaceAll("%2C", ",");
  return qs ? `?${qs}` : "";
}

export const inStock = (p: Product) => p.variants.some((v) => v.stock > 0);
export const totalStock = (p: Product) => p.variants.reduce((n, v) => n + v.stock, 0);

type Key = "marca" | "talla" | "genero" | "coleccion" | "precio";

/** Aplica los filtros; `except` ignora uno (para calcular cuántos resultados daría cada opción). */
export function matches(p: Product, f: Filters, except?: Key) {
  if (except !== "marca" && f.marca.length && !f.marca.includes(brandKey(p.brand))) return false;
  if (except !== "coleccion" && f.coleccion.length && !(p.collection && f.coleccion.includes(p.collection.slug))) return false;
  // "Hombre" y "Mujer" incluyen los unisex.
  if (except !== "genero" && f.genero.length && !f.genero.some((g) => g === p.gender || (p.gender === "unisex" && g !== "unisex"))) return false;
  if (except !== "talla" && f.talla.length && !p.variants.some((v) => v.stock > 0 && f.talla.includes(v.size))) return false;
  if (except !== "precio" && f.min !== null && p.price < f.min) return false;
  if (except !== "precio" && f.max !== null && p.price > f.max) return false;
  return true;
}

export function applyFilters(products: Product[], f: Filters): Product[] {
  const result = products.filter((p) => matches(p, f));
  const byDate = (a: Product, b: Product) => b.created_at.localeCompare(a.created_at);

  switch (f.orden) {
    case "precio-asc":
      return result.sort((a, b) => a.price - b.price);
    case "precio-desc":
      return result.sort((a, b) => b.price - a.price);
    case "nuevos":
      return result.sort(byDate);
    default:
      // Destacados primero, agotados al final.
      return result.sort(
        (a, b) =>
          Number(inStock(b)) - Number(inStock(a)) || Number(b.featured) - Number(a.featured) || byDate(a, b),
      );
  }
}

export type Facets = {
  brands: { key: string; label: string; count: number }[];
  sizes: { size: number; available: boolean }[];
  genders: { value: Gender; label: string; count: number }[];
  collections: Record<string, number>;
  price: { min: number; max: number };
};

/** Opciones de cada filtro con conteos que respetan el resto de filtros activos. */
export function getFacets(products: Product[], f: Filters): Facets {
  const brandMap = new Map<string, { label: string; count: number }>();
  for (const p of products) {
    const key = brandKey(p.brand);
    const entry = brandMap.get(key) ?? { label: p.brand, count: 0 };
    if (matches(p, f, "marca")) entry.count++;
    brandMap.set(key, entry);
  }

  const allSizes = [...new Set(products.flatMap((p) => p.variants.map((v) => v.size)))].sort((a, b) => a - b);
  const sizePool = products.filter((p) => matches(p, f, "talla"));

  const collections: Record<string, number> = {};
  for (const p of products) {
    if (p.collection && matches(p, f, "coleccion")) collections[p.collection.slug] = (collections[p.collection.slug] ?? 0) + 1;
  }

  const prices = products.map((p) => p.price);

  return {
    brands: [...brandMap].map(([key, v]) => ({ key, ...v })).sort((a, b) => a.label.localeCompare(b.label)),
    sizes: allSizes.map((size) => ({
      size,
      available: sizePool.some((p) => p.variants.some((v) => v.size === size && v.stock > 0)),
    })),
    genders: GENDERS.map((g) => ({
      ...g,
      count: products.filter((p) => matches(p, { ...f, genero: [g.value] })).length,
    })),
    collections,
    price: {
      // Redondeado a decenas de mil para que el slider tenga pasos limpios.
      min: prices.length ? Math.floor(Math.min(...prices) / 10_000) * 10_000 : 0,
      max: prices.length ? Math.ceil(Math.max(...prices) / 10_000) * 10_000 : 0,
    },
  };
}

/** Relacionados: misma colección, luego misma marca, luego el resto; con stock primero. */
export function getRelated(products: Product[], product: Product, limit = 4): Product[] {
  const score = (p: Product) =>
    (p.collection?.slug === product.collection?.slug ? 4 : 0) +
    (p.brand === product.brand ? 2 : 0) +
    (inStock(p) ? 1 : 0);
  return products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export function activeFilterCount(f: Filters) {
  return f.marca.length + f.talla.length + f.genero.length + f.coleccion.length + (f.min !== null || f.max !== null ? 1 : 0);
}
