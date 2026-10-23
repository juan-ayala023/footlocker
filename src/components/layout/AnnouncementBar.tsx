import { TransitionLink } from "@/components/motion/TransitionLink";
import { announcements } from "@/config/site";

// Copias del bloque de promociones: con 2 mitades idénticas el loop (-50%) no tiene saltos.
const COPIES = 4;

/**
 * Cinta superior de promociones en movimiento continuo (CSS puro, sin JS).
 * Se pausa al pasar el mouse o enfocar un enlace; con "reducir movimiento" queda quieta.
 */
export function AnnouncementBar() {
  return (
    <div role="region" aria-label="Promociones" className="announce group relative flex h-(--bar-h) items-center overflow-hidden bg-black text-white">
      <div className="announce-track flex w-max shrink-0 items-center">
        {Array.from({ length: COPIES * 2 }, (_, copy) => (
          <ul key={copy} aria-hidden={copy > 0} className="flex shrink-0 items-center">
            {announcements.map((item) => (
              <li key={item.text} className="flex items-center whitespace-nowrap">
                <Spark />
                <span className="text-[0.75rem] font-semibold tracking-[0.14em] uppercase">{item.text}</span>
                <TransitionLink
                  href={item.href}
                  tabIndex={copy > 0 ? -1 : undefined}
                  className="ml-3 text-[0.75rem] font-semibold tracking-[0.14em] text-[#ff6a2b] uppercase underline-offset-4 hover:underline"
                >
                  {item.cta} →
                </TransitionLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
      {/* Desvanecido en los bordes */}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-black md:w-24" />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-black md:w-24" />
    </div>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="mx-6 size-3 shrink-0 fill-[#ff6a2b] md:mx-8">
      <path d="M8 0c.4 3.9 2.1 6.6 8 8-5.9 1.4-7.6 4.1-8 8-.4-3.9-2.1-6.6-8-8 5.9-1.4 7.6-4.1 8-8Z" />
    </svg>
  );
}
