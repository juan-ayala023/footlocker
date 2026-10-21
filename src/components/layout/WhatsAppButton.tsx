"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { site } from "@/config/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useUi } from "@/store/ui";

/** Botón flotante con mensaje prellenado según el producto en pantalla. */
export function WhatsAppButton() {
  const pathname = usePathname();
  const viewing = useUi((s) => s.viewing);
  if (!site.whatsapp || pathname.startsWith("/checkout")) return null;

  const onProduct = pathname.startsWith("/producto/") && viewing;
  const message = onProduct
    ? `Hola, me interesan los ${viewing.name}${viewing.size ? ` en talla ${viewing.size}` : ""}. ¿Me ayudas? ${viewing.url}`
    : "Hola, quiero más información sobre sus tenis.";
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <AnimatePresence>
      <m.a
        key="wa"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={onProduct ? `Preguntar por ${viewing.name} en WhatsApp` : "Escríbenos por WhatsApp"}
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: ease.outSoft, delay: 1.5 }}
        className={cn(
          "group fixed right-4 z-40 flex items-center gap-3 rounded-full border border-line bg-ink/80 p-1.5 backdrop-blur-xl transition-[bottom] duration-500 md:right-6 md:bottom-6",
          // En el producto (móvil) se sube para no tapar la barra fija de compra.
          pathname.startsWith("/producto/") ? "bottom-24" : "bottom-4",
        )}
      >
        <span className="eyebrow hidden max-w-0 overflow-hidden whitespace-nowrap pl-0 transition-[max-width,padding] duration-500 ease-premium group-hover:max-w-56 group-hover:pl-3 md:block">
          {onProduct ? "¿Dudas con tu talla?" : "Escríbenos"}
        </span>
        <span className="flex size-11 items-center justify-center rounded-full bg-sand text-ink">
          <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="currentColor">
            <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.24-1.37A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.82.83-3.03-.2-.31a8.23 8.23 0 1 1 6.95 3.85Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43l-.76-1.82c-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.66.31 2.76 2.76 0 0 0-.86 2.05 4.8 4.8 0 0 0 1 2.55 11 11 0 0 0 4.2 3.71c1.57.68 2.18.74 2.96.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
          </svg>
        </span>
      </m.a>
    </AnimatePresence>
  );
}
