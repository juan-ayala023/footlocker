"use client";

import { m, type Variants } from "framer-motion";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  /** Un string, o un array donde cada elemento es una línea. */
  text: string | readonly string[];
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Si se pasa, controla el reveal (p. ej. al terminar el preloader); si no, se dispara al entrar en viewport. */
  play?: boolean;
};

const word: Variants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 1, ease: ease.premium, delay: i },
  }),
};

/** Reveal por palabras con máscara (overflow hidden + translateY). */
export function TextReveal({
  text,
  as: Tag = "span",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.06,
  play,
}: Props) {
  const lines = typeof text === "string" ? [text] : text;
  const label = lines.join(" ");
  let index = 0;

  const trigger =
    play === undefined
      ? { whileInView: "visible", viewport: { once: true, margin: "0px 0px -10% 0px" } }
      : { animate: play ? "visible" : "hidden" };

  return (
    <Tag className={className}>
      {/* Texto real para lectores de pantalla; las palabras animadas son decorativas. */}
      <span className="sr-only">{label}</span>
      <m.span aria-hidden initial="hidden" {...trigger} className="block">
        {lines.map((line, li) => (
          <span key={li} className={cn("block", lineClassName)}>
            {line.split(" ").map((w, wi) => {
              const custom = delay + index++ * stagger;
              return (
                <span key={wi} className="mask inline-block align-top">
                  <m.span variants={word} custom={custom} className="inline-block will-change-transform">
                    {w}
                  </m.span>
                  {wi < line.split(" ").length - 1 && " "}
                </span>
              );
            })}
          </span>
        ))}
      </m.span>
    </Tag>
  );
}
