"use client";

import { useId, useState } from "react";
import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/utils";

/** Grupo de enlaces del footer: desplegable en móvil (estilo Nike), siempre abierto en escritorio. */
export function FooterGroup({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-b border-line md:border-0">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-6 text-left font-sans text-xl font-medium md:pointer-events-none md:py-0 md:pb-6 md:text-base"
        >
          {title}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={cn("size-6 transition-transform duration-300 md:hidden", open && "rotate-180")}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h2>
      <ul id={id} className={cn("space-y-4 pb-7 md:block md:space-y-3 md:pb-0", !open && "hidden")}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-lg text-stone transition-colors duration-300 hover:text-bone md:text-sm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
