import { site } from "@/config/site";

/** "Contáctanos": el número abre WhatsApp directamente (sin correo). */
export function ContactBlock() {
  const pretty = `+${site.whatsapp.slice(0, 2)} ${site.whatsapp.slice(2, 5)} ${site.whatsapp.slice(5, 8)} ${site.whatsapp.slice(8)}`;
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hola, necesito ayuda con un producto o pedido.")}`;

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="scroll-mt-[calc(var(--nav-h)+1rem)] pt-16">
      <h2 id="contacto-title" className="font-sans text-3xl font-normal tracking-wide uppercase md:text-4xl">
        Contáctanos
      </h2>
      <div className="mt-6 border-t border-line pt-10">
        <div className="grid grid-cols-[3.5rem_1fr] items-start gap-x-6 sm:grid-cols-[4rem_1fr]">
          <svg viewBox="0 0 48 48" aria-hidden className="mt-10 size-12 text-bone">
            <path fill="currentColor" d="M6 7h36a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H18l-9 8v-8H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
            <circle cx="15" cy="20" r="2.6" className="fill-ink" />
            <circle cx="24" cy="20" r="2.6" className="fill-ink" />
            <circle cx="33" cy="20" r="2.6" className="fill-ink" />
          </svg>
          <div className="text-center text-lg leading-relaxed text-mist">
            <p className="tracking-wide text-bone uppercase">Productos y pedidos</p>
            <a href={href} target="_blank" rel="noreferrer" className="mt-5 inline-block text-xl text-bone underline underline-offset-4">
              {pretty}
            </a>
            <p className="mt-1 text-sm text-stone">Escríbenos por WhatsApp</p>
            <div className="mt-6 space-y-0.5">
              {site.hours.map((h) => (
                <p key={h}>{h}</p>
              ))}
              <p>Te responderemos en hasta cinco (5) días hábiles.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
