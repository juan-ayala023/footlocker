import { TransitionLink } from "@/components/motion/TransitionLink";
import { categoryTiles } from "@/data/home";

/** Accesos por categoría debajo de la portada: tarjetas tipográficas que filtran el catálogo. */
export function CategoryTiles() {
  return (
    <section aria-label="Categorías" className="container-page py-24 md:py-32">
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {categoryTiles.map((t) => (
          <li key={t.href} className="bg-ink">
            <TransitionLink
              href={t.href}
              className="group flex h-full min-h-72 flex-col justify-between gap-12 p-8 transition-colors duration-500 hover:bg-ink-raised md:min-h-96 md:p-10"
            >
              <p className="eyebrow text-sand">{t.eyebrow}</p>
              <div>
                <h2 className="text-h2 max-w-xs">{t.title}</h2>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-mist transition-colors group-hover:text-bone">
                  {t.cta}
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
