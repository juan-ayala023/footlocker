import Image from "next/image";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/utils";
import type { Collection } from "@/types/catalog";

// Grid editorial asimétrico: cada tarjeta tiene su propio tamaño y desfase.
const layout = [
  { card: "md:col-span-7", media: "aspect-[4/5] md:aspect-[5/6]", sizes: "(min-width: 768px) 58vw, 100vw" },
  { card: "w-4/5 ml-auto md:w-auto md:ml-0 md:col-span-4 md:col-start-9 md:mt-48", media: "aspect-[3/4]", sizes: "(min-width: 768px) 33vw, 80vw" },
  { card: "w-4/5 md:w-auto md:col-span-4 md:col-start-2 md:mt-40", media: "aspect-[3/4]", sizes: "(min-width: 768px) 33vw, 80vw" },
  { card: "md:col-span-6 md:col-start-7 md:mt-12", media: "aspect-[4/5] md:aspect-[6/5]", sizes: "(min-width: 768px) 50vw, 100vw" },
];

export function Collections({ collections }: { collections: (Collection & { count: number })[] }) {
  return (
    <section id="colecciones" aria-labelledby="colecciones-title" className="container-page py-28 md:py-40">
      <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-6 text-stone">Colecciones</p>
          <h2 id="colecciones-title" className="text-h1 max-w-3xl uppercase">
            <TextReveal text={["Encuentra", "tu ruta"]} />
          </h2>
        </div>
        <TransitionLink href="/catalogo" className="eyebrow group flex items-center gap-3 self-start md:self-auto">
          Ver todo el catálogo
          <span className="block h-px w-10 bg-bone transition-all duration-500 ease-premium group-hover:w-16 group-hover:bg-sand" />
        </TransitionLink>
      </div>

      <ul className="grid gap-14 md:grid-cols-12 md:gap-x-8 md:gap-y-0">
        {collections.slice(0, layout.length).map((c, i) => (
          <li key={c.slug} className={cn(layout[i].card)}>
            <TransitionLink href={`/catalogo?coleccion=${c.slug}`} data-cursor-label="Ver" className="group block">
              <ImageReveal className={cn("bg-ink-raised", layout[i].media)} delay={0.05 * (i % 2)}>
                {c.image && (
                  <Image
                    src={c.image}
                    alt={`Colección ${c.name}`}
                    fill
                    sizes={layout[i].sizes}
                    className="object-cover grayscale-[65%] transition-[filter,scale] duration-1000 ease-premium group-hover:scale-105 group-hover:grayscale-0"
                  />
                )}
              </ImageReveal>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-line pb-5">
                <div className="flex items-baseline gap-4">
                  <span className="eyebrow text-stone">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-h3 uppercase transition-colors duration-500 group-hover:text-sand">{c.name}</h3>
                </div>
                <span className="eyebrow text-stone">
                  {c.count} {c.count === 1 ? "par" : "pares"}
                </span>
              </div>
              {c.description && <p className="mt-3 text-sm text-stone">{c.description}</p>}
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
