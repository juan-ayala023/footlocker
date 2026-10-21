// Validación del checkout compartida por el formulario (cliente) y la API (servidor).
import { z } from "zod";

export const DEPARTMENTS = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá D.C.", "Bolívar", "Boyacá", "Caldas",
  "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía",
  "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander",
  "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre",
  "Tolima", "Valle del Cauca", "Vaupés", "Vichada",
] as const;

export const customerSchema = z.object({
  name: z.string().trim().min(3, "Escribe tu nombre completo").max(120),
  email: z.email("Revisa tu correo").trim().toLowerCase().max(160),
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, "").replace(/^57(?=3\d{9}$)/, ""))
    .pipe(z.string().regex(/^3\d{9}$/, "Celular de 10 dígitos que empiece por 3")),
  address: z.string().trim().min(6, "Incluye calle, número y detalles").max(200),
  city: z.string().trim().min(2, "¿En qué ciudad recibes?").max(80),
  region: z.enum(DEPARTMENTS, { error: "Elige un departamento" }),
});

export const checkoutSchema = z.object({
  customer: customerSchema,
  items: z
    .array(z.object({ variantId: z.uuid(), quantity: z.number().int().min(1).max(10) }))
    .min(1, "Tu carrito está vacío")
    .max(30),
});

export type CustomerInput = z.input<typeof customerSchema>;
export type Customer = z.output<typeof customerSchema>;
export type CheckoutInput = z.input<typeof checkoutSchema>;

/** Respuesta de POST /api/checkout */
export type CheckoutResponse =
  | {
      ok: true;
      reference: string;
      amountInCents: number;
      currency: "COP";
      signature: string;
      publicKey: string;
      redirectUrl: string;
      subtotal: number;
      shipping: number;
      total: number;
    }
  | {
      ok: false;
      code: "INVALID" | "STOCK" | "UNAVAILABLE" | "NOT_CONFIGURED" | "SERVER";
      message: string;
      /** Para STOCK/UNAVAILABLE: variantes afectadas y stock disponible actual */
      items?: { variantId: string; available: number }[];
      fields?: Record<string, string>;
    };
