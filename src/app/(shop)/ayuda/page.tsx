import type { Metadata } from "next";
import { ContactBlock } from "@/components/help/ContactBlock";
import { HelpCenter } from "@/components/help/HelpCenter";
import { helpSections } from "@/data/help";

export const metadata: Metadata = {
  title: "Ayuda",
  description: "Preguntas frecuentes sobre envíos, pedidos, tallas, garantías y pagos. Contáctanos por WhatsApp.",
  alternates: { canonical: "/ayuda" },
};

export default async function HelpPage({ searchParams }: { searchParams: Promise<{ seccion?: string }> }) {
  const { seccion } = await searchParams;
  const initialOpen = helpSections.some((s) => s.slug === seccion) ? seccion : undefined;

  return (
    // Zona clara, como catálogo y producto.
    <div className="theme-light bg-ink text-bone">
      <div className="container-page max-w-3xl pt-[calc(var(--nav-h)+2.5rem)] pb-24 md:pt-[calc(var(--nav-h)+4rem)]">
        <h1 className="font-sans text-[2rem] leading-tight font-normal tracking-wide uppercase md:text-5xl">Servicio de asistencia rápida</h1>
        <p className="mt-4 mb-8 text-lg text-mist">Accede a nuestras preguntas más frecuentes con un solo clic.</p>
        <HelpCenter sections={helpSections} initialOpen={initialOpen} />
        <ContactBlock />
      </div>
    </div>
  );
}
