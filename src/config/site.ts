// Fuente única de verdad para datos de marca. Cambia aquí el nombre definitivo.
export const site = {
  name: "footlocker",
  legalName: "footlocker",
  tagline: "Make it work",
  description:
    "Sneakers y calzado urbano. Envío gratis a toda Colombia.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es-CO",
  currency: "COP",
  shipping: {
    /** Tarifa fija nacional en COP */
    flat: 15000,
    /** Envío gratis para compras desde este subtotal (0 = envío incluido en todos los pedidos) */
    freeFrom: 0,
    /** Tiempo estimado de entrega tras confirmar el pago y preparar el pedido */
    eta: "1 a 5 días hábiles",
  },
  /** WhatsApp de servicio al cliente (formato internacional sin +). */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573113337845",
  /** Horario de atención */
  hours: ["Lunes a viernes: 9:00 - 20:00", "Sábado: 9:00 - 18:00"],
  /** Usuario de Instagram de la tienda (sin @). Se usa en "El estilo de otras personas". */
  instagramHandle: "footlockercol_",
  social: {
    instagram: "https://www.instagram.com/footlockercol_",
    tiktok: "https://tiktok.com/",
  },
} as const;

/**
 * Franja de anuncios (arriba de la barra). Rota cada pocos segundos.
 * Edita aquí los mensajes; usa solo promociones reales.
 */
export const announcements = [
  { text: "Envío gratis a toda Colombia", href: "/ayuda?seccion=envios", cta: "Ver detalles" },
  { text: "13% de descuento en referencias seleccionadas", href: "/catalogo?oferta=1", cta: "Comprar ofertas" },
] as const;

/**
 * Foto de campaña por marca para la fila de marcas del catálogo (clave = marca en minúsculas).
 * Si una marca no tiene, se usa la foto de su producto más destacado.
 * Ej.: nike: "https://<proyecto>.supabase.co/storage/v1/object/public/products/marcas/nike.jpg"
 */
export const brandImages: Record<string, string> = {
  nike: "/brands/nike.webp",
  jordan: "/brands/jordan.webp",
  adidas: "/brands/adidas.webp",
  "new-balance": "/brands/new-balance.webp",
  on: "/brands/on.webp",
  puma: "/brands/puma.webp",
};

/**
 * Tarjeta "Multimarca" de la fila de marcas: agrupa estas marcas (sin tarjeta propia)
 * y al tocarla filtra todas a la vez. Sus productos siguen en el catálogo y en el filtro.
 */
export const multiBrand = {
  key: "multimarca",
  label: "Multimarca",
  image: "/brands/multimarca.webp",
  brands: ["calvin-klein", "boss", "timberland"],
};

export type MenuItem = {
  label: string;
  href: string;
  /** Submenú (p. ej. Deporte → Fútbol, Basket). */
  children?: { label: string; href: string }[];
  /** Resaltado en rojo (Descuentos). */
  highlight?: boolean;
  emoji?: string;
};

/** Menú principal: mismo contenido en móvil (panel) y escritorio (barra). */
export const menu: MenuItem[] = [
  { label: "Novedades", href: "/catalogo?orden=nuevos" },
  { label: "Hombre", href: "/catalogo?genero=hombre" },
  { label: "Mujer", href: "/catalogo?genero=mujer" },
  {
    label: "Deporte",
    href: "/catalogo?coleccion=futbol,basket",
    children: [
      { label: "Fútbol", href: "/catalogo?coleccion=futbol" },
      { label: "Basket", href: "/catalogo?coleccion=basket" },
    ],
  },
  { label: "Descuentos", href: "/catalogo?oferta=1", highlight: true, emoji: "🔥" },
];

/** Footer (estilo Nike): secciones desplegables en móvil, columnas en escritorio. */
export const footerNav = [
  {
    title: "Ayuda",
    links: [
      { label: "Obtener ayuda", href: "/ayuda" },
      { label: "Preguntas frecuentes", href: "/ayuda#preguntas" },
      { label: "Estado de pedido", href: "/ayuda?seccion=pedidos" },
      { label: "Envío y entrega", href: "/ayuda?seccion=envios" },
      { label: "Devoluciones", href: "/ayuda?seccion=devoluciones" },
      { label: "Opciones de pago", href: "/ayuda?seccion=pagos" },
      { label: "Comunícate con nosotros", href: "/ayuda#contacto" },
    ],
  },
  {
    title: `Acerca de ${site.name}`,
    links: [
      { label: "Propósito y quiénes somos", href: "/proposito" },
      { label: "Términos y condiciones", href: "/terminos" },
    ],
  },
  {
    title: "Tienda",
    links: [
      { label: "Novedades", href: "/catalogo?orden=nuevos" },
      { label: "Hombre", href: "/catalogo?genero=hombre" },
      { label: "Mujer", href: "/catalogo?genero=mujer" },
      { label: "Descuentos", href: "/catalogo?oferta=1" },
    ],
  },
];
