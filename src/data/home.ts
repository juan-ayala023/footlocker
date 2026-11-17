// Contenido editorial de la home.

// Portada: logo completo sobre crema, con el lema y accesos al catálogo.
export const hero = {
  title: "Perfumería By Maria · Perfumes 100% originales",
  eyebrow: "Perfumes 100% originales",
  lead: "Fragancias de las mejores casas, selladas de fábrica.",
  ctas: [
    { label: "Para ella", href: "/catalogo?genero=mujer" },
    { label: "Para él", href: "/catalogo?genero=hombre" },
  ],
};

// Producto de la sección "Fragancia destacada" (slug del catálogo).
// Vacío = se usa el primer producto marcado como destacado en el admin.
export const drop = { slug: "" };

// Accesos por categoría debajo de la portada (filtran el catálogo).
export const categoryTiles = [
  { eyebrow: "Para ella", title: "Florales, dulces y elegantes.", href: "/catalogo?genero=mujer", cta: "Ver perfumes de mujer" },
  { eyebrow: "Para él", title: "Amaderados, frescos e intensos.", href: "/catalogo?genero=hombre", cta: "Ver perfumes de hombre" },
  { eyebrow: "Unisex", title: "Aromas para compartir.", href: "/catalogo?genero=unisex", cta: "Ver perfumes unisex" },
];
