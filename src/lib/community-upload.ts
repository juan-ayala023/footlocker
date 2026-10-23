// Reglas de la subida pública de fotos de la comunidad (compartidas por la ruta y el formulario).

export const COMMUNITY_MAX_BYTES = 8 * 1024 * 1024;
export const COMMUNITY_ACCEPT = "image/jpeg,image/png,image/webp";
export const COMMUNITY_PENDING_BUCKET = "community-pending";

/** Usuario de Instagram sin @ (vacío permitido). */
export const normalizeHandle = (v: string) => v.trim().replace(/^@/, "");
export const isValidHandle = (v: string) => /^[\w.]{0,30}$/.test(v);

/**
 * Tipo real del archivo por sus primeros bytes (no por la extensión ni el
 * Content-Type, que los pone el cliente). Solo JPEG, PNG y WebP.
 */
export function sniffImage(bytes: Uint8Array): { ext: "jpg" | "png" | "webp"; type: string } | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { ext: "png", type: "image/png" };
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.subarray(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", type: "image/webp" };
  return null;
}
