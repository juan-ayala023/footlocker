// Contenido de prueba de la Home. En la fase 3 colecciones y destacados vendrán de Supabase.
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1600`;

export const hero = {
  eyebrow: "Temporada 01 · Drop limitado",
  title: ["Eleva", "tu paso"],
  lead: "Tenis seleccionados para quienes suben. Streetwear relajado, con el silencio del buen gusto.",
  image: unsplash("1518002171953-a080ee817e1f"),
  imageAlt: "Par de tenis grises sobre fondo negro iluminado",
};

export const drop = {
  name: "Summit Low",
  colorway: "Bone / Ink",
  description:
    "Cuero premium, suela de goma natural y una silueta limpia pensada para durar. Solo 120 pares numerados.",
  releaseAt: "2026-11-07T19:00:00-05:00",
  image: unsplash("1608231387042-66d1773070a5"),
  imageAlt: "Tenis blanco de cuero sobre fondo negro",
};

export const story = {
  eyebrow: "Nuestra historia",
  text:
    "Cada par que elegimos es un paso hacia arriba. Creemos en el ascenso silencioso: en la constancia que no necesita gritar y en el estilo que se nota sin explicarse. La montaña nos recuerda que la cima se construye paso a paso. Este es el tuyo.",
  summit: 4800,
};
