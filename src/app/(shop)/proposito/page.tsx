import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Propósito y quiénes somos",
  description:
    "Un perfume es la firma que dejas sin decir una palabra. En Perfumería By Maria te ayudamos a encontrar la tuya, con perfumes 100% originales.",
  alternates: { canonical: "/proposito" },
};

// Texto "Quiénes somos" provisional: reemplazar por el que entregue la tienda.
const ABOUT = [
  "Creemos que un perfume dice mucho de quien lo lleva: cómo te sientes, cómo quieres que te recuerden y los momentos que vives.",
  "Por eso en Perfumería By Maria seleccionamos fragancias 100% originales de las casas que más quieres, nuevas y selladas de fábrica.",
  "Te acompañamos a elegir: si no sabes cuál comprar, escríbenos y te asesoramos según tus gustos, la ocasión o la persona a la que quieres regalar.",
  "Porque cada aroma cuenta una historia, y queremos ser parte de la tuya.",
];

export default function PurposePage() {
  return (
    <div className="theme-light bg-ink text-bone">
      <div className="container-page max-w-4xl pt-[calc(var(--nav-h)+3rem)] pb-28 md:pt-[calc(var(--nav-h)+6rem)]">
        <Logo tone="dark" title={site.name} className="w-24 md:w-28" />

        <p className="eyebrow mt-14 text-stone">Propósito</p>
        <TextReveal
          as="h1"
          text={["Un perfume es la firma que dejas", "sin decir una palabra."]}
          play
          className="mt-5 font-display text-h2 leading-[1.15] font-bold"
        />
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-mist">Te ayudamos a encontrar la tuya, con perfumes 100% originales.</p>
        <p className="mt-8 font-display text-2xl font-bold tracking-wide md:text-3xl">{site.tagline}.</p>

        <div className="mt-20 border-t border-line pt-10">
          <h2 className="eyebrow text-stone">Quiénes somos</h2>
          <div className="mt-5 max-w-2xl space-y-5 text-lg leading-relaxed text-mist">
            {ABOUT.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-8 font-display text-2xl font-bold">{site.name}.</p>
        </div>

        <Button href="/catalogo" size="lg" className="mt-12">
          Ver catálogo
        </Button>
      </div>
    </div>
  );
}
