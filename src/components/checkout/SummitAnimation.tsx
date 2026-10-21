"use client";

import { m } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { MOUNTAIN_LAYERS, MountainLayer } from "@/components/brand/MountainRange";
import { ease } from "@/lib/motion";

/**
 * "La montaña sube": las capas de la cordillera emergen desde abajo y el logo
 * se revela de la base a la cima. En estado pendiente el logo respira.
 */
export function SummitAnimation({ state }: { state: "pending" | "success" | "failed" }) {
  const success = state === "success";

  return (
    <div>
      {/* Anclada al contenedor de la página (posicionado), detrás del contenido. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55svh] overflow-hidden">
        {MOUNTAIN_LAYERS.map((layer, i) => (
          <m.div
            key={layer.id}
            className="absolute inset-x-0 bottom-0"
            initial={{ y: "100%" }}
            animate={{ y: success ? "0%" : "55%" }}
            transition={{ duration: 1.6, ease: ease.premium, delay: 0.15 * i }}
          >
            <MountainLayer layer={layer} snow={i === 0} className={["h-[55svh]", "h-[40svh]", "h-[28svh]"][i]} />
          </m.div>
        ))}
      </div>

      <m.div
        aria-hidden
        className="mx-auto w-44 md:w-56"
        initial={{ clipPath: "inset(100% 0% 0% 0%)", y: 40 }}
        animate={
          state === "pending"
            ? { clipPath: "inset(0% 0% 0% 0%)", y: 20, opacity: [1, 0.35, 1] }
            : { clipPath: "inset(0% 0% 0% 0%)", y: 0, opacity: state === "failed" ? 0.35 : 1 }
        }
        transition={
          state === "pending"
            ? { clipPath: { duration: 1.2, ease: ease.premium }, y: { duration: 1.2 }, opacity: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }
            : { duration: 1.4, ease: ease.premium, delay: 0.3 }
        }
      >
        <Logo title="" className="w-full" />
      </m.div>
    </div>
  );
}
