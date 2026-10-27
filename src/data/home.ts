// Contenido editorial de la home.

// Banner de entrada entregado por la tienda (public/brand/banner-make-it-work.webp, 1280×640).
export const hero = {
  title: "footlocker · Make it work",
  image: "/brand/banner-make-it-work.webp",
  imageAlt: "Logo de footlocker, una montaña con las letras FL, y el lema Make it work",
};

// Producto de la sección "Edición limitada" de la home (slug del catálogo).
export const drop = { slug: "nike-air-max-portal" };

// Fotos de deporte después del banner (public/home). `position` = encuadre en pantallas anchas y `mobilePosition` en celular (pantalla vertical).
// `whole`: en pantallas anchas se muestra la foto completa (útil en fotos verticales) sobre un fondo difuminado.
export const sportPanels = [
  {
    eyebrow: "Entrena hoy",
    title: "Equípate para darlo todo.",
    cta: "Comprar ahora",
    href: "/catalogo",
    image: "/home/entrena.webp",
    imageAlt: "Personas entrenando con mancuernas en el gimnasio con tenis On y Nike",
    position: "50% 75%",
    mobilePosition: "44% 50%",
    whole: false,
  },
  {
    eyebrow: "Fútbol",
    title: "Domina la cancha.",
    cta: "Comprar Adidas",
    href: "/catalogo?marca=adidas",
    image: "/home/futbol.webp",
    imageAlt: "Tacos Adidas rojos sobre un balón en una cancha sintética",
    position: "50% 55%",
    mobilePosition: "50% 50%",
    whole: true,
  },
  {
    eyebrow: "Running",
    title: "Cada kilómetro cuenta.",
    cta: "Comprar running",
    href: "/catalogo?coleccion=running",
    image: "/home/running.webp",
    imageAlt: "Corredores en una pista atlética al atardecer",
    position: "50% 50%",
    mobilePosition: "35% 50%",
    whole: true,
  },
];
