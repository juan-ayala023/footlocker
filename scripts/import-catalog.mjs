// Importa el catálogo real desde carpetas de fotos (una carpeta por modelo, dentro de "hombre" y "mujer").
//
//   npm run catalog:prepare [-- "C:/ruta/a/Descargas"]
//     · Optimiza las fotos a WebP en public/catalog/<id>/ (portada = la vista más "limpia").
//     · Genera/actualiza catalogo/catalogo.csv para llenar precios y tallas en Excel
//       (conserva lo que ya hayas llenado).
//
//   npm run catalog:build
//     · Lee catalogo/catalogo.csv y publica los modelos CON precio en src/data/catalog-import.json
//       (lo usan el sitio sin Supabase y supabase/seed.sql).
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const CSV_PATH = process.env.CATALOG_CSV ?? path.join(ROOT, "catalogo", "catalogo.csv");
const IMG_DIR = path.join(ROOT, "public", "catalog");
const OUT_JSON = path.join(ROOT, "src", "data", "catalog-import.json");
const MAX_PHOTOS = 10;
// Tallas europeas (EU) que maneja la tienda: mujer 36–39, hombre 40–44.
const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44];
const SIZE_RANGE = { mujer: [36, 37, 38, 39], hombre: [40, 41, 42, 43, 44], unisex: SIZES };
/** Stock inicial por talla al crear la fila (se ajusta en el CSV). */
const DEFAULT_STOCK = 5;
const GENDERS = ["hombre", "mujer"];

/** "1. Air Force 1 ‘07  blancos" → "air force 1 '07 blancos" */
const norm = (s) =>
  s
    .replace(/^\d+\.\s*/, "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/"\s+/g, '"')
    .trim()
    .toLowerCase();

const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Nombre comercial, marca y colección por carpeta (clave normalizada). Editable luego en el CSV.
const MODELS = {
  "adidas adizero evo sl": ["Adizero EVO SL", "Adidas", "running"],
  "adidas grand court base 00s": ["Grand Court Base 00s", "Adidas", "clasicos"],
  "adidas superstar classic": ["Superstar Classic", "Adidas", "clasicos"],
  "air force 1 '07": ["Air Force 1 '07 Blanco/Rosa", "Nike", "clasicos"],
  "air force 1 '07 blancos": ["Air Force 1 '07 Blanco", "Nike", "clasicos"],
  "air force 1 '07 negros": ["Air Force 1 '07 Negro", "Nike", "clasicos"],
  "air force 1 '07 rojos": ["Air Force 1 '07 Rojo", "Nike", "clasicos"],
  "air force 1 mid '07 blancos": ["Air Force 1 Mid '07 Blanco", "Nike", "clasicos"],
  "air force 1 mid '07 negros": ["Air Force 1 Mid '07 Negro", "Nike", "clasicos"],
  'air jordan 3 og "spring is in the air"': ["Air Jordan 3 OG 'Spring Is in the Air'", "Jordan", "basket"],
  'air jordan 3 retro "cobalt bliss"': ["Air Jordan 3 Retro 'Cobalt Bliss'", "Jordan", "basket"],
  "air jordan 3 retro sail and jade aura": ["Air Jordan 3 Retro 'Sail and Jade Aura'", "Jordan", "basket"],
  "air jordan 4 retro tour yellow": ["Air Jordan 4 Retro 'Tour Yellow'", "Jordan", "basket"],
  "air max 90 blancos": ["Air Max 90 Blanco", "Nike", "retro"],
  "air max 90 blancos con rojo": ["Air Max 90 Blanco/Rojo", "Nike", "retro"],
  "air max 90 negros": ["Air Max 90 Negro", "Nike", "retro"],
  'air max 95 "big bubble"con un poco de verde': ["Air Max 95 'Big Bubble' Verde", "Nike", "retro"],
  'air max 95 "big bubble"gris con negro': ["Air Max 95 'Big Bubble' Gris/Negro", "Nike", "retro"],
  "air max dn blanco con negro": ["Air Max Dn Blanco/Negro", "Nike", "street"],
  "air max dn rojos": ["Air Max Dn Rojo", "Nike", "street"],
  "air max plus": ["Air Max Plus Blanco/Naranja", "Nike", "retro"],
  "air max plus blanco con negro": ["Air Max Plus Blanco/Negro", "Nike", "retro"],
  "air max plus negro con naranja": ["Air Max Plus Negro/Naranja", "Nike", "retro"],
  "air max plus un poco de verde": ["Air Max Plus Verde", "Nike", "retro"],
  "air max tn blanco": ["Air Max TN Blanco", "Nike", "retro"],
  "air max tn negro": ["Air Max TN Negro", "Nike", "retro"],
  "boss ttnm evo": ["TTNM EVO", "BOSS", "street"],
  "jordan 1 retro low": ["Air Jordan 1 Retro Low", "Jordan", "basket"],
  "jordan 1 retro low paris": ["Air Jordan 1 Retro Low 'Paris'", "Jordan", "basket"],
  "jordan 1 retro low space jam": ["Air Jordan 1 Retro 'Space Jam'", "Jordan", "basket"],
  "jordan 11 retro low": ["Air Jordan 11 Retro Low Azul", "Jordan", "basket"],
  "jordan 4 retro": ["Air Jordan 4 Retro", "Jordan", "basket"],
  "jordan air cadence": ["Air Cadence", "Jordan", "street"],
  "jordan retro 1 high og": ["Air Jordan 1 Retro High OG", "Jordan", "basket"],
  "jordan retro 11": ["Air Jordan 11 Retro", "Jordan", "basket"],
  "jordan retro 11 low": ["Air Jordan 11 Retro Low Negro/Rojo", "Jordan", "basket"],
  "new balance 9060": ["9060", "New Balance", "street"],
  "nike air max portal": ["Air Max Portal", "Nike", "street"],
  "nike cortez": ["Cortez", "Nike", "clasicos"],
  "nike iniator": ["Initiator", "Nike", "retro"],
  "nike mind 001": ["Mind 001", "Nike", "street"],
  "nike nocta hot step 2": ["NOCTA Hot Step 2", "Nike", "street"],
  "nike shox r4": ["Shox R4", "Nike", "retro"],
  "nike shox r4 grises": ["Shox R4 Gris", "Nike", "retro"],
  "nike shox ride 2": ["Shox Ride 2 Negro", "Nike", "retro"],
  "nike shox ride 2 x supreme blancos y negros": ["Shox Ride 2 x Supreme", "Nike", "street"],
  "nike shox ridee 2": ["Shox Ride 2 Gris", "Nike", "retro"],
  "nike shox tl": ["Shox TL", "Nike", "retro"],
  "on cloud 6": ["Cloud 6", "On", "running"],
  "on cloudboom volt": ["Cloudboom Volt", "On", "running"],
  "on cloudsurfer 2": ["Cloudsurfer 2", "On", "running"],
  "on running cloudnova": ["Cloudnova", "On", "running"],
  "pues indoor og": ["Indoor OG", "Puma", "clasicos"],
  "puma club ll era": ["Club II Era", "Puma", "clasicos"],
  "puma suede": ["Suede", "Puma", "clasicos"],
  "puma suede xl": ["Suede XL", "Puma", "clasicos"],
  "samba og": ["Samba OG", "Adidas", "clasicos"],
  "sandalia calvin klein": ["Sandalia", "Calvin Klein", "street"],
  "sb dunk low x otomo katsuhiro": ["SB Dunk Low x Otomo Katsuhiro", "Nike", "street"],
  timberland: ["Bota", "Timberland", "street"],
};

// Portada elegida a mano (índice de la foto dentro de la carpeta, desde 0) donde la automática no sirve
// (p. ej. eligió la suela).
const COVERS = {
  "jordan retro 1 high og": 0,
  'air jordan 3 og "spring is in the air"': 4,
  "air jordan 3 retro sail and jade aura": 2,
  "jordan 4 retro": 6,
  "air jordan 4 retro tour yellow": 3,
  "air force 1 mid '07 negros": 2,
  "nike air max portal": 1,
  "nike cortez": 2,
  "jordan retro 11": 4,
};

// Carpetas que mezclan colores → un producto por color. `files` son índices de foto dentro de la carpeta
// (desde 0, sin repetidas); el primero es la portada. Clasificado revisando las fotos una por una.
const SPLITS = {
  "adidas adizero evo sl": [
    { name: "Adizero EVO SL Negro", files: [3, 0, 1, 2, 4, 5, 6] },
    { name: "Adizero EVO SL Blanco", files: [12, 7, 8, 9, 10, 11] },
  ],
  "adidas superstar classic": [
    { name: "Superstar Classic Blanco", files: [4, 0, 1, 2, 5, 12] },
    { name: "Superstar Classic Negro", files: [3, 6, 7, 8, 9, 10, 11] },
  ],
  "jordan air cadence": [
    { name: "Air Cadence Blanco/Gris", files: [0, 1, 3] },
    { name: "Air Cadence Negro", files: [2, 4, 5] },
  ],
  "jordan retro 1 high og": [
    { name: "Air Jordan 1 Retro High OG 'Bred'", files: [0, 1, 2] },
    { name: "Air Jordan 1 Retro High OG 'Chicago'", files: [3, 4, 5] },
  ],
  "jordan retro 11": [
    { name: "Air Jordan 11 Retro 'Bred'", files: [4, 0, 5, 6] },
    { name: "Air Jordan 11 Retro 'Cool Grey'", files: [3, 1, 2, 7] },
  ],
  "new balance 9060": [
    { name: "9060 Gris", files: [0, 2, 9, 7] },
    { name: "9060 Negro", files: [1, 3, 8, 4, 5, 6] },
    { name: "9060 Café", files: [12, 11, 13, 16, 20] },
    { name: "9060 Blanco", files: [18, 10, 19] },
    { name: "9060 Beige/Rosa", files: [21, 14, 17, 22] },
    { name: "9060 Blanco/Gris", files: [26, 15, 23, 24, 25, 27] },
  ],
  "nike cortez": [
    { name: "Cortez Blanco/Rojo", files: [2, 0, 1, 3, 4, 5, 6, 15] },
    { name: "Cortez Blanco/Negro", files: [7, 8, 9, 10, 11, 12, 13, 14] },
  ],
  "nike mind 001": [
    { name: "Mind 001 Rojo", files: [1, 0, 2, 4, 5, 9] },
    { name: "Mind 001 Verde", files: [7, 3, 6, 8] },
    { name: "Mind 001 Azul", files: [11, 10, 14] },
    { name: "Mind 001 Blanco", files: [13, 12, 15, 16] },
    { name: "Mind 001 Crema", files: [22, 17, 18, 19, 20, 21] },
    { name: "Mind 001 Negro", files: [23, 24, 25, 26, 27] },
  ],
  "nike nocta hot step 2": [
    { name: "NOCTA Hot Step 2 Negro", files: [0, 3, 4, 5] },
    { name: "NOCTA Hot Step 2 Blanco", files: [6, 1, 2] },
  ],
  "nike shox r4": [
    { name: "Shox R4 Blanco", files: [1, 0] },
    { name: "Shox R4 Dorado", files: [2, 3] },
    { name: "Shox R4 Rojo", files: [5, 4] },
  ],
  "nike shox ride 2 x supreme blancos y negros": [
    { name: "Shox Ride 2 x Supreme Plata", files: [2, 0, 1] },
    { name: "Shox Ride 2 x Supreme Negro", files: [5, 3, 4] },
  ],
  "nike shox ridee 2": [
    { name: "Shox Ride 2 Gris", files: [0, 4, 5, 6, 7] },
    { name: "Shox Ride 2 Crema/Negro", files: [2, 1, 3, 8] },
  ],
  "nike shox tl": [
    { name: "Shox TL Negro", files: [0, 2, 3] },
    { name: "Shox TL Blanco", files: [1, 4, 5] },
  ],
  "on cloud 6": [
    { name: "Cloud 6 Negro", files: [0, 1, 2] },
    { name: "Cloud 6 Morado", files: [3, 4, 5, 6] },
  ],
  "on cloudboom volt": [
    { name: "Cloudboom Volt Negro", files: [1, 0, 2, 3] },
    { name: "Cloudboom Volt Rosa", files: [4, 7, 9, 6] },
    { name: "Cloudboom Volt Morado", files: [5, 8, 10] },
  ],
  "puma suede": [
    { name: "Suede Blanco", files: [0, 11, 12, 14, 15] },
    { name: "Suede Negro", files: [1, 2, 3, 4, 5, 8] },
    { name: "Suede Crema/Negro", files: [6, 7, 9, 10, 13] },
  ],
  "puma suede xl": [
    { name: "Suede XL Negro/Blanco", files: [2, 0, 1, 3, 7] },
    { name: "Suede XL Negro", files: [4, 5, 6, 8, 9] },
  ],
};

// Fotos que son capturas de un carrusel (puntos de navegación a los lados): se recorta este % por lado.
const CROP_SIDES = { "puma suede": 0.095, "puma suede xl": 0.095 };

const COLUMNS = [
  "id",
  "carpeta",
  "nombre",
  "marca",
  "genero",
  "coleccion",
  "precio",
  "precio_antes",
  "mas_vendido",
  "destacado",
  "descripcion",
  "fotos",
  ...SIZES.map((s) => `t${s}`),
];

// ───────────── CSV (separador ";" para Excel en español, UTF-8 con BOM) ─────────────

function parseCsv(text) {
  const rows = [];
  let row = [],
    cell = "",
    quoted = false;
  text = text.replace(/^\uFEFF/, "");
  // Excel guarda con ";" o "," seg\u00FAn la configuraci\u00F3n regional: se detecta por la fila de t\u00EDtulos.
  const firstLine = text.split(/\r?\n/, 1)[0];
  const sep = firstLine.split(";").length >= firstLine.split(",").length ? ";" : ",";
  const endRow = () => {
    row.push(cell);
    rows.push(row);
    row = [];
    cell = "";
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      endRow();
    } else cell += ch;
  }
  if (cell || row.length) endRow();
  const [header, ...body] = rows.filter((r) => r.some((c) => c.trim()));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

const csvCell = (v) => (/[;"\n]/.test(String(v)) ? `"${String(v).replaceAll('"', '""')}"` : String(v));
const toCsv = (rows) =>
  "\uFEFF" + [COLUMNS.join(";"), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c] ?? "")).join(";"))].join("\r\n") + "\r\n";

// ───────────── prepare ─────────────

/** Brillo medio del borde de la foto: las vistas completas sobre fondo claro puntúan alto, los acercamientos bajo. */
async function borderScore(file) {
  const { data, info } = await sharp(file).rotate().resize(48, 48, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  let sum = 0,
    n = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (x < 4 || y < 4 || x >= info.width - 4 || y >= info.height - 4) {
        sum += data[y * info.width + x];
        n++;
      }
    }
  }
  return sum / n;
}

async function prepare(source) {
  console.log(`Leyendo fotos de: ${source}`);
  const models = new Map();
  for (const gender of GENDERS) {
    const dir = path.join(source, gender);
    if (!existsSync(dir)) throw new Error(`No existe la carpeta ${dir}`);
    for (const folder of readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)) {
      const key = norm(folder);
      const m = models.get(key) ?? { key, folder, genders: new Set(), files: new Map() };
      m.genders.add(gender);
      for (const f of readdirSync(path.join(dir, folder))
        .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
        .sort()) {
        const full = path.join(dir, folder, f);
        const hash = createHash("sha1").update(readFileSync(full)).digest("hex");
        if (!m.files.has(hash)) m.files.set(hash, full); // misma foto en hombre y mujer → una sola vez
      }
      models.set(key, m);
    }
  }

  const previous = existsSync(CSV_PATH) ? new Map(parseCsv(readFileSync(CSV_PATH, "utf8")).map((r) => [r.id, r])) : new Map();
  const rows = [];
  const warnings = [];

  // Se regeneran todas las fotos (evita carpetas huérfanas de productos que ya se dividieron).
  rmSync(IMG_DIR, { recursive: true, force: true });

  for (const m of [...models.values()].sort((a, b) => a.key.localeCompare(b.key))) {
    const [name, brand, collection] = MODELS[m.key] ?? [m.folder.replace(/^\d+\.\s*/, ""), "Otra", "street"];
    if (!MODELS[m.key]) warnings.push(`Sin mapeo (revisa nombre/marca en el CSV): ${m.folder}`);
    const parentId = slugify(`${brand} ${name}`);
    const files = [...m.files.values()];
    if (files.length === 0) {
      warnings.push(`Carpeta vacía, se omite: ${m.folder}`);
      continue;
    }

    // Un producto por color si la carpeta mezcla colores; si no, uno solo con portada automática.
    let variants;
    if (SPLITS[m.key]) {
      const used = new Set(SPLITS[m.key].flatMap((s) => s.files));
      const missing = files.map((_, i) => i).filter((i) => !used.has(i));
      if (missing.length) warnings.push(`${m.folder}: fotos sin color asignado (se omiten): ${missing.join(", ")}`);
      variants = SPLITS[m.key].map((s) => ({ name: s.name, files: s.files.map((i) => files[i]).filter(Boolean) }));
    } else {
      // Portada: la foto con el borde más claro (vista completa del tenis); el resto en su orden original.
      const scores = await Promise.all(files.map(borderScore));
      const coverIdx = COVERS[m.key] ?? scores.indexOf(Math.max(...scores));
      variants = [{ name, files: [files[coverIdx], ...files.filter((_, i) => i !== coverIdx)] }];
    }

    for (const variant of variants) {
      const id = slugify(`${brand} ${variant.name}`);
      const ordered = variant.files.slice(0, MAX_PHOTOS);
      const crop = CROP_SIDES[m.key] ?? 0;

      const outDir = path.join(IMG_DIR, id);
      mkdirSync(outDir, { recursive: true });
      await Promise.all(
        ordered.map(async (file, i) => {
          let img = sharp(file).rotate();
          if (crop) {
            const { width = 0, height = 0 } = await sharp(file).rotate().metadata();
            const dx = Math.round(width * crop);
            img = sharp(await img.extract({ left: dx, top: 0, width: width - dx * 2, height }).toBuffer());
          }
          return img
            .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 78 })
            .toFile(path.join(outDir, `${String(i + 1).padStart(2, "0")}.webp`));
        }),
      );

      const gender = m.genders.size === 2 ? "unisex" : [...m.genders][0];
      // Al dividir por color, cada producto hereda lo que ya se había llenado para la carpeta completa.
      const prev = previous.get(id) ?? previous.get(parentId) ?? {};
      rows.push({
        id,
        carpeta: m.folder,
        // Si el nombre guardado era el de la carpeta completa, usar el del color.
        nombre: prev.nombre && previous.has(id) ? prev.nombre : variant.name,
        marca: prev.marca || brand,
        genero: prev.genero || gender,
        coleccion: prev.coleccion || collection,
        precio: prev.precio ?? "",
        precio_antes: prev.precio_antes ?? "",
        mas_vendido: prev.mas_vendido ?? "",
        destacado: prev.destacado ?? "",
        descripcion: prev.descripcion ?? "",
        fotos: ordered.length,
        // Tallas: lo ya llenado se respeta; en filas nuevas se prellena el rango del género con DEFAULT_STOCK.
        ...Object.fromEntries(
          SIZES.map((s) => {
            const hasSizes = SIZES.some((x) => (prev[`t${x}`] ?? "") !== "");
            if (hasSizes) return [`t${s}`, prev[`t${s}`] ?? ""];
            return [`t${s}`, SIZE_RANGE[prev.genero || gender]?.includes(s) ? DEFAULT_STOCK : ""];
          }),
        ),
      });
      process.stdout.write(".");
    }
  }

  mkdirSync(path.dirname(CSV_PATH), { recursive: true });
  writeFileSync(CSV_PATH, toCsv(rows));
  console.log(`\n${rows.length} modelos · ${rows.reduce((n, r) => n + r.fotos, 0)} fotos → public/catalog/`);
  console.log(`Hoja para llenar: ${path.relative(ROOT, CSV_PATH)}`);
  warnings.forEach((w) => console.warn("⚠ " + w));
}

// ───────────── build ─────────────

const money = (v) => {
  const digits = String(v ?? "").replace(/\D/g, "");
  return digits ? Number(digits) : null;
};
const yes = (v) => /^(si|sí|x|1|true)$/i.test(String(v ?? "").trim());

function build() {
  if (!existsSync(CSV_PATH)) throw new Error("No existe catalogo/catalogo.csv. Corre primero: npm run catalog:prepare");
  const rows = parseCsv(readFileSync(CSV_PATH, "utf8"));
  const products = [];
  const skipped = [];
  const errors = [];

  for (const r of rows) {
    const price = money(r.precio);
    if (!price) {
      skipped.push(r.nombre || r.id);
      continue;
    }
    const compare = money(r.precio_antes);
    const gender = r.genero?.toLowerCase();
    if (!["hombre", "mujer", "unisex"].includes(gender)) errors.push(`${r.id}: género inválido "${r.genero}" (usa hombre, mujer o unisex)`);
    if (compare && compare <= price) errors.push(`${r.id}: precio_antes debe ser mayor que precio`);
    const sizes = SIZES.filter((s) => r[`t${s}`] !== "" && r[`t${s}`] !== undefined).map((s) => [
      s,
      Math.max(0, Number(String(r[`t${s}`]).replace(/\D/g, "")) || 0),
    ]);
    if (sizes.length === 0) errors.push(`${r.id}: sin tallas (llena al menos una columna t36…t44 con el stock)`);
    const dir = path.join(IMG_DIR, r.id);
    const images = existsSync(dir)
      ? readdirSync(dir)
          .filter((f) => f.endsWith(".webp"))
          .sort()
          .map((f) => `/catalog/${r.id}/${f}`)
      : [];
    if (images.length === 0) errors.push(`${r.id}: no hay fotos en public/catalog/${r.id}`);

    products.push({
      slug: r.id,
      name: r.nombre,
      brand: r.marca,
      description: r.descripcion || "",
      price,
      compare_at_price: compare && compare > price ? compare : null,
      gender,
      collection: r.coleccion || "street",
      images,
      featured: yes(r.destacado),
      best_seller: yes(r.mas_vendido),
      sizes,
    });
  }

  if (errors.length) {
    errors.forEach((e) => console.error("✗ " + e));
    throw new Error(`${errors.length} errores en el CSV; corrígelos y vuelve a correr catalog:build`);
  }

  // Archivo generado: no editarlo a mano (edita el CSV y vuelve a correr catalog:build).
  writeFileSync(OUT_JSON, JSON.stringify(products, null, 2) + "\n");
  console.log(`Publicados ${products.length} modelos en src/data/catalog-import.json`);
  if (skipped.length) console.log(`Sin precio (no se publican todavía): ${skipped.length}\n  - ${skipped.join("\n  - ")}`);
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === "prepare") await prepare(arg ?? path.join(homedir(), "Downloads"));
else if (cmd === "build") build();
else console.log("Uso: node scripts/import-catalog.mjs prepare [carpeta] | build");
