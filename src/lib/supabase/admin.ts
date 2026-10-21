import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isAdminClientConfigured = Boolean(url && serviceKey);

/** Cliente con service role: omite RLS. Solo para rutas de servidor (checkout, webhook, admin). */
export function createAdminClient() {
  if (!url || !serviceKey) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL");
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
