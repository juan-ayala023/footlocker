"use client";

import { useState } from "react";

// TODO(fase 7): conectar a n8n / proveedor de email.
export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return <p className="mt-8 text-sm text-sand">Listo. Te avisaremos antes que a nadie.</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="group mt-8 flex max-w-md items-center border-b border-line transition-colors duration-500 focus-within:border-bone"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Correo electrónico
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        placeholder="tu@correo.com"
        className="h-12 flex-1 bg-transparent text-base text-bone placeholder:text-stone focus:outline-none"
      />
      <button type="submit" className="eyebrow h-12 pl-4 transition-colors duration-500 hover:text-sand">
        Suscribirme
      </button>
    </form>
  );
}
