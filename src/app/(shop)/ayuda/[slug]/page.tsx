import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TextReveal } from "@/components/motion/TextReveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { site } from "@/config/site";
import { formatCOP } from "@/lib/utils";

// Contenido base de ayuda. Ajusta tiempos, políticas y contacto a la operación real.
const SIZES = [
  { co: 35, us: 5, eu: 36, cm: 22.5 },
  { co: 36, us: 6, eu: 37, cm: 23 },
  { co: 37, us: 6.5, eu: 38, cm: 24 },
  { co: 38, us: 7, eu: 39, cm: 24.5 },
  { co: 39, us: 8, eu: 40, cm: 25.5 },
  { co: 40, us: 8.5, eu: 41, cm: 26 },
  { co: 41, us: 9.5, eu: 42, cm: 27 },
  { co: 42, us: 10, eu: 43, cm: 27.5 },
  { co: 43, us: 11, eu: 44, cm: 28.5 },
  { co: 44, us: 12, eu: 45, cm: 29.5 },
];

const PAGES: Record<string, { title: string; description: string; body: React.ReactNode }> = {
  envios: {
    title: "Envíos y entregas",
    description: "Tiempos y costos de envío a toda Colombia.",
    body: (
      <>
        <p>Despachamos a toda Colombia con transportadoras aliadas. Al confirmarse tu pago recibes la guía de seguimiento por correo y WhatsApp.</p>
        <ul>
          <li>Bogotá, Medellín, Cali y Barranquilla: 2 a 3 días hábiles.</li>
          <li>Resto del país: 3 a 5 días hábiles.</li>
          <li>
            Costo: {formatCOP(site.shipping.flat)}. Gratis en pedidos desde {formatCOP(site.shipping.freeFrom)}.
          </li>
        </ul>
        <p>Los pedidos pagados antes de las 2:00 p. m. (hora Colombia) en días hábiles salen el mismo día.</p>
      </>
    ),
  },
  cambios: {
    title: "Cambios y devoluciones",
    description: "Cambios de talla sin costo durante 30 días.",
    body: (
      <>
        <p>Tienes 30 días desde que recibes tu pedido para cambiar de talla sin costo.</p>
        <ul>
          <li>El par debe estar sin uso, con etiquetas y en su caja original.</li>
          <li>Escríbenos por WhatsApp con tu número de pedido y coordinamos la recogida.</li>
          <li>Si la talla que necesitas está agotada, te devolvemos el dinero por el mismo medio de pago.</li>
        </ul>
        <p>Por higiene no aceptamos devoluciones de pares usados, salvo defectos de fábrica.</p>
      </>
    ),
  },
  tallas: {
    title: "Guía de tallas",
    description: "Equivalencias de tallas Colombia, US y EU, y cómo medir tu pie.",
    body: (
      <>
        <p>Mide tu pie de pie, del talón a la punta del dedo más largo, y compáralo con la columna en centímetros. Si estás entre dos tallas, elige la mayor.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[22rem] text-left text-sm tabular-nums">
            <caption className="sr-only">Equivalencias de tallas</caption>
            <thead>
              <tr className="border-b border-line text-stone">
                <th scope="col" className="py-3 font-normal">
                  Colombia
                </th>
                <th scope="col" className="py-3 font-normal">
                  US (hombre)
                </th>
                <th scope="col" className="py-3 font-normal">
                  EU
                </th>
                <th scope="col" className="py-3 font-normal">
                  Pie (cm)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SIZES.map((s) => (
                <tr key={s.co}>
                  <th scope="row" className="py-3 font-medium">
                    {s.co}
                  </th>
                  <td className="py-3 text-mist">{s.us}</td>
                  <td className="py-3 text-mist">{s.eu}</td>
                  <td className="py-3 text-mist">{s.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Las hormas varían entre marcas y modelos. ¿Dudas con un par en particular? Escríbenos y te ayudamos a elegir.</p>
      </>
    ),
  },
  contacto: {
    title: "Contacto",
    description: "Escríbenos por WhatsApp, Instagram o TikTok.",
    body: (
      <>
        <p>Respondemos de lunes a sábado, de 9:00 a. m. a 7:00 p. m.</p>
        <ul>
          {site.whatsapp && (
            <li>
              WhatsApp:{" "}
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">
                +{site.whatsapp}
              </a>
            </li>
          )}
          <li>
            Instagram:{" "}
            <a href={site.social.instagram} target="_blank" rel="noreferrer">
              {site.social.instagram.replace("https://", "")}
            </a>
          </li>
          <li>
            TikTok:{" "}
            <a href={site.social.tiktok} target="_blank" rel="noreferrer">
              {site.social.tiktok.replace("https://", "")}
            </a>
          </li>
        </ul>
      </>
    ),
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = PAGES[(await params).slug];
  return page ? { title: page.title, description: page.description, alternates: { canonical: `/ayuda/${(await params).slug}` } } : {};
}

export default async function HelpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  return (
    <div className="container-page grid gap-12 pt-[calc(var(--nav-h)+3rem)] pb-16 md:pt-[calc(var(--nav-h)+5rem)] lg:grid-cols-12">
      <nav aria-label="Ayuda" className="lg:col-span-3">
        <p className="eyebrow mb-5 text-stone">Ayuda</p>
        <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {Object.entries(PAGES).map(([s, p]) => (
            <li key={s}>
              <TransitionLink
                href={`/ayuda/${s}`}
                aria-current={s === slug ? "page" : undefined}
                className={
                  s === slug
                    ? "block rounded-full bg-bone px-4 py-2 text-sm text-ink lg:rounded-none lg:border-l lg:border-sand lg:bg-transparent lg:text-bone"
                    : "block rounded-full border border-line px-4 py-2 text-sm text-mist hover:text-bone lg:rounded-none lg:border-0 lg:border-l lg:border-transparent"
                }
              >
                {p.title}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </nav>

      <article className="lg:col-span-7 lg:col-start-5">
        <TextReveal as="h1" text={page.title} play className="text-h1 uppercase" />
        <div className="mt-10 space-y-6 text-lead text-mist [&_a]:text-sand [&_a]:underline [&_a]:underline-offset-4 [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:top-[0.7em] [&_li]:before:left-0 [&_li]:before:size-1 [&_li]:before:rounded-full [&_li]:before:bg-sand [&_ul]:space-y-3">
          {page.body}
        </div>
      </article>
    </div>
  );
}
