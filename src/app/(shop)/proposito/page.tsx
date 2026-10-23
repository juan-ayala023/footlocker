import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Propósito y quiénes somos",
  description:
    "Toda gran historia comienza con un primer paso. Y queremos acompañarte en cada uno de ellos. No se trata de dónde estás hoy, sino hasta dónde quieres llegar. Believe in yourself.",
  alternates: { canonical: "/proposito" },
};

// Texto "Quiénes somos" entregado por la tienda.
const ABOUT = [
  "Sabemos que cada par tiene una historia por contar y que cada persona tiene un camino por recorrer.",
  "Nuestra pasión por los sneakers va más allá del producto. Creemos en lo que representan: identidad, confianza, autenticidad y la libertad de expresar quién eres.",
  "Sabemos que detrás de cada paso hay una decisión, un sueño y una historia que merece ser vivida. Por eso, queremos acompañarte en tu camino, desde la forma en que expresas tu personalidad hasta los desafíos que te impulsan a ser mejor cada día.",
  "No buscamos simplemente ser parte de lo que llevas puesto, sino de lo que te mueve, de lo que te inspira y de aquello en lo que quieres convertirte.",
  "Porque cada par tiene una historia, y queremos ser parte de la tuya.",
];

export default function PurposePage() {
  return (
    <div className="theme-light bg-ink text-bone">
      <div className="container-page max-w-4xl pt-[calc(var(--nav-h)+3rem)] pb-28 md:pt-[calc(var(--nav-h)+6rem)]">
        <Logo tone="dark" title={site.name} className="w-28 md:w-36" />

        <p className="eyebrow mt-14 text-stone">Propósito</p>
        <TextReveal
          as="h1"
          text={["Toda gran historia comienza con un primer paso.", "Y queremos acompañarte en cada uno de ellos."]}
          play
          className="mt-5 font-display text-h2 leading-[1.15] font-bold"
        />
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-mist">No se trata de dónde estás hoy, sino hasta dónde quieres llegar.</p>
        <p className="mt-8 font-display text-2xl font-bold tracking-wide md:text-3xl">Believe in yourself.</p>

        <div className="mt-20 border-t border-line pt-10">
          <h2 className="eyebrow text-stone">Quiénes somos</h2>
          <div className="mt-5 max-w-2xl space-y-5 text-lg leading-relaxed text-mist">
            {ABOUT.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-8 font-display text-2xl font-bold">{site.name}. Believe in yourself.</p>
        </div>

        <Button href="/catalogo" size="lg" className="mt-12">
          Ver catálogo
        </Button>
      </div>
    </div>
  );
}
