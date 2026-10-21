import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "";
const integritySecret = process.env.WOMPI_INTEGRITY_SECRET ?? "";
const eventsSecret = process.env.WOMPI_EVENTS_SECRET ?? "";

export const isWompiConfigured = Boolean(publicKey && integritySecret);
export const wompiPublicKey = publicKey;

/** Sandbox si la llave es de pruebas (pub_test_…), producción si no. */
export const wompiApiBase = publicKey.startsWith("pub_prod_")
  ? "https://production.wompi.co/v1"
  : "https://sandbox.wompi.co/v1";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Referencia única y no adivinable: FL-AAAAMMDD-XXXXXXXX */
export function createReference(date = new Date()) {
  const ymd = date.toISOString().slice(0, 10).replaceAll("-", "");
  return `FL-${ymd}-${randomBytes(5).toString("hex").toUpperCase()}`;
}

/**
 * Firma de integridad del widget: SHA256(reference + amountInCents + currency + secreto).
 * https://docs.wompi.co/docs/colombia/widget-checkout-web/#paso-3-genera-una-firma-de-integridad
 */
export function integritySignature(reference: string, amountInCents: number, currency = "COP", secret = integritySecret) {
  return sha256(`${reference}${amountInCents}${currency}${secret}`);
}

export type WompiTransaction = {
  id: string;
  status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING";
  reference: string;
  amount_in_cents: number;
  currency: string;
  payment_method_type?: string;
};

export type WompiEvent = {
  event: string;
  data: { transaction: WompiTransaction };
  environment: "test" | "prod";
  signature: { properties: string[]; checksum: string };
  timestamp: number;
  sent_at: string;
};

function readPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), obj);
}

/**
 * Verifica la firma de un evento de Wompi:
 * SHA256(valores de signature.properties tomados de `data`, concatenados + timestamp + secreto de eventos).
 * https://docs.wompi.co/docs/colombia/eventos/#seguridad
 */
export function verifyEventSignature(event: WompiEvent, secret = eventsSecret): boolean {
  if (!secret || !event?.signature?.checksum || !Array.isArray(event.signature.properties)) return false;
  const values = event.signature.properties.map((p) => String(readPath(event.data, p) ?? ""));
  const expected = sha256(`${values.join("")}${event.timestamp}${secret}`);
  const given = String(event.signature.checksum).toLowerCase();
  if (given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

/** Consulta una transacción directamente a Wompi (fuente confiable, no requiere llave privada). */
export async function fetchTransaction(id: string): Promise<WompiTransaction | null> {
  if (!/^[\w-]+$/.test(id)) return null;
  const res = await fetch(`${wompiApiBase}/transactions/${id}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: WompiTransaction };
  return json.data ?? null;
}
