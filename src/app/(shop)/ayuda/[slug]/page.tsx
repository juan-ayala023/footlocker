import { redirect } from "next/navigation";

// Direcciones antiguas (/ayuda/envios, /ayuda/originalidad…) → centro de ayuda con la sección abierta.
const MAP: Record<string, string> = {
  envios: "/ayuda?seccion=envios",
  pedidos: "/ayuda?seccion=pedidos",
  cambios: "/ayuda?seccion=devoluciones",
  devoluciones: "/ayuda?seccion=devoluciones",
  originalidad: "/ayuda?seccion=originalidad",
  producto: "/ayuda?seccion=originalidad",
  pagos: "/ayuda?seccion=pagos",
  contacto: "/ayuda#contacto",
};

export default async function LegacyHelp({ params }: { params: Promise<{ slug: string }> }) {
  redirect(MAP[(await params).slug] ?? "/ayuda");
}
