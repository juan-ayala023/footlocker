// Fuente única de verdad para datos de marca. Cambia aquí el nombre definitivo.
export const site = {
  name: "footlocker",
  legalName: "footlocker",
  tagline: "Eleva tu paso",
  description:
    "Tenis seleccionados para quienes suben. Streetwear con prestigio, drops limitados y envíos a toda Colombia.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es-CO",
  currency: "COP",
  shipping: {
    /** Tarifa fija nacional en COP */
    flat: 15000,
    /** Envío gratis desde este subtotal */
    freeFrom: 400000,
  },
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
  },
} as const;

export const mainNav = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Colecciones", href: "/#colecciones" },
  { label: "Drop", href: "/#drop" },
  { label: "Historia", href: "/#historia" },
] as const;

export const footerNav = [
  {
    title: "Tienda",
    links: [
      { label: "Catálogo", href: "/catalogo" },
      { label: "Hombre", href: "/catalogo?genero=hombre" },
      { label: "Mujer", href: "/catalogo?genero=mujer" },
      { label: "Próximo drop", href: "/#drop" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Envíos y entregas", href: "/ayuda/envios" },
      { label: "Cambios y devoluciones", href: "/ayuda/cambios" },
      { label: "Guía de tallas", href: "/ayuda/tallas" },
      { label: "Contacto", href: "/ayuda/contacto" },
    ],
  },
] as const;
