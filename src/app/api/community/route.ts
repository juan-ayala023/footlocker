import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { COMMUNITY_MAX_BYTES, COMMUNITY_PENDING_BUCKET, isValidHandle, normalizeHandle, sniffImage } from "@/lib/community-upload";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export type CommunityUploadResponse = { ok: true } | { ok: false; message: string };

const reply = (body: CommunityUploadResponse, status = 200) => NextResponse.json(body, { status });

// Límite por IP (en memoria, por instancia: frena envíos repetidos, no es una barrera estricta).
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) return true;
  hits.push(now);
  recent.set(ip, hits);
  return false;
}

// Tope de fotos sin revisar: evita que alguien llene el almacenamiento.
const MAX_PENDING = 200;

/**
 * Recibe la foto de un cliente para "El estilo de otras personas".
 * Queda en un bucket privado y pendiente hasta que el admin la acepte en /admin/comunidad.
 */
export async function POST(request: Request) {
  if (!isAdminClientConfigured) {
    return reply({ ok: false, message: "La subida de fotos aún no está disponible. Etiquétanos en Instagram mientras tanto." }, 503);
  }

  const form = await request.formData().catch(() => null);
  if (!form) return reply({ ok: false, message: "No pudimos leer el envío. Intenta de nuevo." }, 400);

  // Campo trampa: las personas no lo ven; si viene lleno es un bot. Se responde "ok" sin guardar nada.
  if (String(form.get("website") ?? "")) return reply({ ok: true });

  if (form.get("consent") !== "on") {
    return reply({ ok: false, message: "Debes autorizar la publicación de tu foto." }, 400);
  }

  const handle = normalizeHandle(String(form.get("handle") ?? ""));
  if (!isValidHandle(handle)) return reply({ ok: false, message: "Revisa tu usuario de Instagram." }, 400);

  const file = form.get("photo");
  if (!(file instanceof File) || file.size === 0) return reply({ ok: false, message: "Elige una foto." }, 400);
  if (file.size > COMMUNITY_MAX_BYTES) return reply({ ok: false, message: "La foto pesa más de 8 MB." }, 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImage(bytes);
  if (!kind) return reply({ ok: false, message: "Sube la foto en formato JPG, PNG o WebP." }, 415);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (tooMany(ip)) return reply({ ok: false, message: "Ya recibimos varias fotos tuyas. Intenta más tarde." }, 429);

  const supabase = createAdminClient();

  const { count } = await supabase.from("community_photos").select("id", { count: "exact", head: true }).eq("status", "pending");
  if ((count ?? 0) >= MAX_PENDING) {
    return reply({ ok: false, message: "Estamos revisando muchas fotos. Intenta de nuevo más tarde." }, 429);
  }

  const path = `${randomUUID()}.${kind.ext}`;
  const upload = await supabase.storage.from(COMMUNITY_PENDING_BUCKET).upload(path, bytes, { contentType: kind.type });
  if (upload.error) return reply({ ok: false, message: "No pudimos subir tu foto. Intenta de nuevo." }, 500);

  // Mientras está pendiente, `image` guarda la ruta dentro del bucket privado (no una URL pública).
  const { error } = await supabase
    .from("community_photos")
    .insert({ image: path, handle: handle || null, status: "pending", active: false });
  if (error) {
    await supabase.storage.from(COMMUNITY_PENDING_BUCKET).remove([path]);
    return reply({ ok: false, message: "No pudimos guardar tu foto. Intenta de nuevo." }, 500);
  }

  return reply({ ok: true });
}
