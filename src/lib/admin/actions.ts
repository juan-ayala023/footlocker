"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import type { OrderStatus } from "@/lib/orders-types";
import { slugify } from "@/lib/slug";
import { createSessionClient } from "@/lib/supabase/server";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

// Todas las acciones validan admin en el servidor y escriben con la sesión del usuario:
// RLS e is_admin() en la base son la última barrera.

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ───────────── Pedidos ─────────────

export async function setOrderStatus(reference: string, status: OrderStatus): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!z.tuple([z.string().max(40), z.enum(["pendiente", "pagado", "enviado", "entregado", "cancelado"])]).safeParse([reference, status]).success) {
    return { ok: false, error: "Datos inválidos" };
  }
  const { error } = await supabase.rpc("admin_set_order_status", { p_reference: reference, p_status: status });
  if (error) {
    return { ok: false, error: error.message.startsWith("TRANSICION_INVALIDA") ? "Ese cambio de estado no está permitido." : error.message };
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

// ───────────── Productos ─────────────

const productSchema = z
  .object({
    id: z.uuid().optional(),
    name: z.string().trim().min(2, "Nombre muy corto").max(120),
    slug: z.string().trim().max(120).optional(),
    brand: z.string().trim().min(1, "Indica la marca").max(60),
    description: z.string().trim().max(2000).optional(),
    price: z.number().int().positive("Precio inválido"),
    compare_at_price: z.number().int().positive().nullable(),
    gender: z.enum(["hombre", "mujer", "unisex"]),
    collection_id: z.uuid().nullable(),
    images: z.array(z.url()).max(12),
    featured: z.boolean(),
    active: z.boolean(),
    variants: z
      .array(
        z.object({
          id: z.uuid().optional(),
          size: z.number().min(15).max(55),
          stock: z.number().int().min(0).max(9999),
          sku: z.string().trim().max(60).optional(),
        }),
      )
      .max(40),
  })
  .refine((p) => p.compare_at_price === null || p.compare_at_price > p.price, {
    message: "El precio antes debe ser mayor que el precio actual",
    path: ["compare_at_price"],
  })
  .refine((p) => new Set(p.variants.map((v) => v.size)).size === p.variants.length, {
    message: "Hay tallas repetidas",
    path: ["variants"],
  });

export type ProductInput = z.input<typeof productSchema>;

export async function saveProduct(input: ProductInput): Promise<ActionResult<{ id: string }>> {
  const { supabase } = await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const p = parsed.data;
  const slug = slugify(p.slug || `${p.brand} ${p.name}`);
  const { data, error } = await supabase.rpc("admin_save_product", { p: { ...p, slug } });
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ya existe un producto con ese slug o SKU." };
    return { ok: false, error: error.message };
  }

  revalidateTag("catalog");
  revalidatePath("/admin/productos");
  return { ok: true, data: { id: data as string } };
}

export async function toggleProduct(id: string, field: "active" | "featured", value: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  // Las server actions se pueden invocar con cualquier argumento: validar en runtime.
  const args = z.tuple([z.uuid(), z.enum(["active", "featured"]), z.boolean()]).safeParse([id, field, value]);
  if (!args.success) return { ok: false, error: "Datos inválidos" };
  const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTag("catalog");
  revalidatePath("/admin/productos");
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Datos inválidos" };
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    // 23503: tiene variantes con pedidos (on delete restrict). Se conserva el historial.
    if (error.code === "23503") return { ok: false, error: "Este producto tiene pedidos. Desactívalo en lugar de borrarlo." };
    return { ok: false, error: error.message };
  }
  revalidateTag("catalog");
  revalidatePath("/admin/productos");
  return { ok: true };
}

// ───────────── Colecciones ─────────────

const collectionSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(2, "Nombre muy corto").max(60),
  slug: z.string().trim().max(60).optional(),
  description: z.string().trim().max(200).optional(),
  image: z.url().nullable(),
  sort_order: z.number().int().min(0).max(999),
});

export type CollectionInput = z.input<typeof collectionSchema>;

export async function saveCollection(input: CollectionInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const { id, ...c } = parsed.data;
  const row = { ...c, slug: slugify(c.slug || c.name), description: c.description || null };
  const { error } = id
    ? await supabase.from("collections").update(row).eq("id", id)
    : await supabase.from("collections").insert(row);
  if (error) return { ok: false, error: error.code === "23505" ? "Ya existe una colección con ese slug." : error.message };

  revalidateTag("catalog");
  revalidatePath("/admin/colecciones");
  return { ok: true };
}

export async function deleteCollection(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Datos inválidos" };
  // Los productos de la colección quedan sin colección (on delete set null).
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTag("catalog");
  revalidatePath("/admin/colecciones");
  return { ok: true };
}
