import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Cliente anónimo sin cookies para lecturas públicas cacheables (catálogo).
 * RLS limita lo visible a productos activos.
 */
export function createPublicClient() {
  if (!url || !anonKey) throw new Error("Supabase no está configurado");
  return createClient(url, anonKey, { auth: { persistSession: false } });
}
