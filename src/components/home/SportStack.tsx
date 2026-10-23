import Image from "next/image";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { sportPanels } from "@/data/home";
import { cn } from "@/lib/utils";

/** Fotos de deporte a pantalla completa, una debajo de otra (scroll normal, sin efectos). */
export function SportStack() {
  return (
    <section aria-label="Deporte" className="relative bg-black">
      {sportPanels.map((p) => (
        <article key={p.title} className="relative h-svh overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={p.image}
              alt={p.imageAlt}
              fill
              sizes="100vw"
              className={cn(
                "object-cover [object-position:var(--pos-m)] md:[object-position:var(--pos)]",
                // Foto completa en pantallas anchas: esta capa queda de fondo, difuminada y oscura.
                p.whole && "md:scale-110 md:blur-2xl md:brightness-50",
              )}
              style={
                {
                  "--pos": p.position,
                  "--pos-m": p.mobilePosition,
                } as React.CSSProperties
              }
            />
            {p.whole && (
              <div className="absolute inset-y-[10%] right-[6vw] left-[46%] hidden md:block">
                <Image src={p.image} alt="" fill sizes="50vw" className="object-contain object-right" />
              </div>
            )}
          </div>
          {/* En celular el texto va arriba (los tenis suelen estar abajo); en pantallas anchas, abajo. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-transparent md:bg-linear-to-t md:from-black/75 md:via-black/15"
          />

          <div className="container-page absolute inset-x-0 top-[calc(var(--nav-h)+1.25rem)] text-white md:top-auto md:bottom-0 md:pb-20">
            <p className="text-sm font-medium md:text-base">{p.eyebrow}</p>
            <h2 className="mt-2 max-w-xl font-display text-2xl leading-tight font-bold uppercase md:text-6xl">{p.title}</h2>
            <TransitionLink
              href={p.href}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-black transition-opacity hover:opacity-80 md:h-12 md:px-7 md:text-base"
            >
              {p.cta}
            </TransitionLink>
          </div>
        </article>
      ))}
    </section>
  );
}
