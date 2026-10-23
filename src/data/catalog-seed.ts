// Fuente única del catálogo de ejemplo.
//  · scripts/generate-seed.ts lo convierte en supabase/seed.sql
//  · lib/catalog.ts lo usa como respaldo si Supabase no está configurado
// Sin imports de runtime: debe poder ejecutarse con `node` (type stripping).

import type { Gender } from "../types/catalog";

/** Días entre la fecha de alta de cada producto de ejemplo (los primeros quedan como "Nuevo"). */
export const SEED_DAYS_APART = 6;

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=1500&q=80`;

/** Toma de detalle: zoom sobre un punto focal de la misma foto. */
const detail = (id: string, x: number, y: number) =>
  `${unsplash(id)}&crop=focalpoint&fp-x=${x}&fp-y=${y}&fp-z=2.2`;

export type SeedCollection = {
  slug: string;
  name: string;
  description: string;
  image: string | null;
  sort_order: number;
};

export type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  gender: Gender;
  collection: string;
  images: string[];
  featured: boolean;
  best_seller: boolean;
  /** [talla, stock] */
  sizes: [number, number][];
};

export const seedCollections: SeedCollection[] = [
  { slug: "street", name: "Street", description: "Para la ciudad, todos los días", image: unsplash("1514989940723-e8e51635b782"), sort_order: 1 },
  { slug: "clasicos", name: "Clásicos", description: "Siluetas que no pasan de moda", image: unsplash("1600269452121-4f2416e55c28"), sort_order: 2 },
  { slug: "running", name: "Running", description: "Ligereza para cada kilómetro", image: unsplash("1562183241-b937e95585b6"), sort_order: 3 },
  { slug: "retro", name: "Retro", description: "Iconos de otra década", image: unsplash("1552346154-21d32810aba3"), sort_order: 4 },
  // Deporte (menú → Deporte): se llenan desde el admin asignando productos a estas colecciones.
  { slug: "futbol", name: "Fútbol", description: "Para la cancha y la calle", image: null, sort_order: 5 },
  { slug: "basket", name: "Basket", description: "Siluetas nacidas en la duela", image: unsplash("1597045566677-8cf032ed6634"), sort_order: 6 },
];

// Stock determinístico por talla (0–6) para que seed y respaldo coincidan.
function stockFor(slug: string, size: number) {
  let h = 2166136261;
  for (const ch of `${slug}:${size}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) % 7;
}

const RANGES: Record<Gender, number[]> = {
  // Tallas europeas (EU)
  hombre: [40, 41, 42, 43, 44],
  mujer: [36, 37, 38, 39],
  unisex: [36, 37, 38, 39, 40, 41, 42, 43, 44],
};

function sizes(slug: string, gender: Gender, scarcity = 1): [number, number][] {
  return RANGES[gender].map((s) => [s, Math.floor(stockFor(slug, s) * scarcity)]);
}

type Base = Omit<SeedProduct, "sizes"> & { scarcity?: number };

const base: Base[] = [
  {
    slug: "nike-air-force-1-07-blanco",
    name: "Air Force 1 '07",
    brand: "Nike",
    description: "El clásico de cancha que se volvió uniforme de la calle. Cuero liso, suela Air encapsulada y una silueta que combina con todo.",
    price: 549900,
    compare_at_price: null,
    gender: "unisex",
    collection: "clasicos",
    images: [unsplash("1600269452121-4f2416e55c28"), detail("1600269452121-4f2416e55c28", 0.6, 0.55)],
    featured: true,
    best_seller: true,
  },
  {
    slug: "nike-air-force-1-carhartt-wip",
    name: "Air Force 1 Carhartt WIP",
    brand: "Nike",
    description: "Colaboración con lona de trabajo y detalles en cuero marrón. Pensado para durar, hecho para destacar.",
    price: 749900,
    compare_at_price: null,
    gender: "hombre",
    collection: "street",
    images: [unsplash("1549298916-b41d501d3772"), detail("1549298916-b41d501d3772", 0.5, 0.5)],
    featured: true,
    best_seller: false,
    scarcity: 0.5,
  },
  {
    slug: "jordan-1-retro-high-bred-toe",
    name: "Air Jordan 1 Retro High 'Bred Toe'",
    brand: "Jordan",
    description: "La combinación negro, rojo y blanco que definió una era. Cuero premium y la caña alta que lo empezó todo.",
    price: 1099900,
    compare_at_price: 1249900,
    gender: "hombre",
    collection: "basket",
    images: [unsplash("1552346154-21d32810aba3"), unsplash("1597045566677-8cf032ed6634")],
    featured: true,
    best_seller: true,
    scarcity: 0.4,
  },
  {
    slug: "nike-air-max-90-orange",
    name: "Air Max 90",
    brand: "Nike",
    description: "Cámara de aire visible, overlays en gamuza y un colorway que no pasa desapercibido.",
    price: 699900,
    compare_at_price: null,
    gender: "unisex",
    collection: "retro",
    images: [unsplash("1514989940723-e8e51635b782"), detail("1514989940723-e8e51635b782", 0.55, 0.6)],
    featured: false,
    best_seller: true,
  },
  {
    slug: "nike-air-max-1-sport-red",
    name: "Air Max 1",
    brand: "Nike",
    description: "El primero en mostrar el aire. Malla y gamuza en blanco con acentos rojo deportivo.",
    price: 659900,
    compare_at_price: null,
    gender: "mujer",
    collection: "retro",
    images: [unsplash("1600185365483-26d7a4cc7519"), detail("1600185365483-26d7a4cc7519", 0.5, 0.5)],
    featured: false,
    best_seller: false,
  },
  {
    slug: "nike-air-force-1-shadow-pastel",
    name: "Air Force 1 Shadow",
    brand: "Nike",
    description: "Capas duplicadas, plataforma elevada y una paleta pastel que suaviza el clásico.",
    price: 629900,
    compare_at_price: 699900,
    gender: "mujer",
    collection: "clasicos",
    images: [unsplash("1595950653106-6c9ebd614d3a"), detail("1595950653106-6c9ebd614d3a", 0.45, 0.5)],
    featured: true,
    best_seller: false,
  },
  {
    slug: "adidas-eqt-support-adv",
    name: "EQT Support ADV",
    brand: "Adidas",
    description: "Tejido transpirable, soporte en el talón y la estética técnica de los noventa reinterpretada.",
    price: 499900,
    compare_at_price: null,
    gender: "hombre",
    collection: "running",
    images: [unsplash("1518002171953-a080ee817e1f"), detail("1518002171953-a080ee817e1f", 0.6, 0.65)],
    featured: false,
    best_seller: false,
  },
  {
    slug: "adidas-deerupt-runner",
    name: "Deerupt Runner",
    brand: "Adidas",
    description: "Malla en rejilla sobre una suela ligera. Minimalismo gráfico para el día a día.",
    price: 459900,
    compare_at_price: 529900,
    gender: "unisex",
    collection: "running",
    images: [unsplash("1562183241-b937e95585b6"), detail("1562183241-b937e95585b6", 0.55, 0.45)],
    featured: false,
    best_seller: false,
  },
  {
    slug: "nike-free-rn-flyknit",
    name: "Free RN Flyknit",
    brand: "Nike",
    description: "Flexibilidad natural y un tejido Flyknit que abraza el pie. Para correr o para no parar.",
    price: 489900,
    compare_at_price: null,
    gender: "mujer",
    collection: "running",
    images: [unsplash("1542291026-7eec264c27ff"), detail("1542291026-7eec264c27ff", 0.45, 0.5)],
    featured: false,
    best_seller: false,
  },
  {
    slug: "nike-air-zoom-pegasus-volt",
    name: "Air Zoom Pegasus",
    brand: "Nike",
    description: "Respuesta Zoom Air y amortiguación reactiva en un volt imposible de ignorar.",
    price: 579900,
    compare_at_price: null,
    gender: "unisex",
    collection: "running",
    images: [unsplash("1606107557195-0e29a4b5b4aa"), detail("1606107557195-0e29a4b5b4aa", 0.5, 0.75)],
    featured: false,
    best_seller: false,
  },
  {
    slug: "vans-old-skool-burgundy",
    name: "Old Skool",
    brand: "Vans",
    description: "Lona y gamuza con la franja lateral icónica. Skate, calle y todo lo del medio.",
    price: 329900,
    compare_at_price: null,
    gender: "unisex",
    collection: "street",
    images: [unsplash("1525966222134-fcfa99b8ae77"), detail("1525966222134-fcfa99b8ae77", 0.55, 0.5)],
    featured: false,
    best_seller: true,
  },
  {
    slug: "puma-smash-v2-leather",
    name: "Smash v2 Leather",
    brand: "Puma",
    description: "Cuero perforado, perfil bajo y una limpieza que funciona con cualquier outfit.",
    price: 299900,
    compare_at_price: null,
    gender: "unisex",
    collection: "clasicos",
    images: [unsplash("1608231387042-66d1773070a5"), detail("1608231387042-66d1773070a5", 0.6, 0.5)],
    featured: false,
    best_seller: false,
  },
];

export const seedProducts: SeedProduct[] = base.map(({ scarcity, ...p }) => ({
  ...p,
  sizes: sizes(p.slug, p.gender, scarcity),
}));

export type SeedCommunityPhoto = {
  image: string;
  handle: string | null;
  /** slug del producto que aparece en la foto */
  product: string | null;
};

/** Fotos de ejemplo para "El estilo de otras personas" (reemplazar por fotos reales de clientes). */
export const seedCommunity: SeedCommunityPhoto[] = [
  { image: unsplash("1514989940723-e8e51635b782"), handle: null, product: "nike-air-max-90-orange" },
  { image: unsplash("1597045566677-8cf032ed6634"), handle: null, product: "jordan-1-retro-high-bred-toe" },
  { image: unsplash("1460353581641-37baddab0fa2"), handle: null, product: null },
  { image: unsplash("1556906781-9a412961c28c"), handle: null, product: null },
];
