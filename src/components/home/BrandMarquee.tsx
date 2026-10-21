import { Logo } from "@/components/brand/Logo";
import { Marquee } from "@/components/motion/Marquee";

const phrase = "Eleva tu paso";
const perks = ["Drops limitados", "Envíos a toda Colombia", "Pago seguro con Wompi", "Cambios sin costo"];

export function BrandMarquee() {
  return (
    <section aria-label={phrase} className="relative z-10 border-y border-line bg-ink py-8 md:py-12">
      <Marquee speed={2.5} className="font-display text-h1 font-bold uppercase">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="flex items-center" aria-hidden={i > 0}>
            <span className="px-6 md:px-10">{phrase}</span>
            <Logo className="w-16 opacity-70 md:w-28" title="" />
            <span className="px-6 text-transparent [-webkit-text-stroke:1px_var(--bone)] md:px-10">{phrase}</span>
            <Logo className="w-16 opacity-70 md:w-28" title="" />
          </span>
        ))}
      </Marquee>
      <Marquee speed={1.5} reverse className="mt-6 text-stone">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="flex items-center" aria-hidden>
            {perks.map((perk) => (
              <span key={perk} className="eyebrow flex items-center gap-8 px-4">
                {perk}
                <span className="size-1 rounded-full bg-sand" />
              </span>
            ))}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
