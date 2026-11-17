import Image from "next/image";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import logoBlack from "../../../public/brand/logo-black.png";
import logoWhite from "../../../public/brand/logo-white.png";
import fullBlack from "../../../public/brand/logo-full-black.png";
import fullWhite from "../../../public/brand/logo-full-white.png";

/**
 * Logo oficial de Perfumería By Maria, generado desde public/brand/logo-original.jpeg
 * con fondo transparente en dos tonos: crema para fondos oscuros y vino para claros.
 * - "mark": solo el frasco con la M (barra de navegación, íconos).
 * - "full": frasco + "PERFUMERÍA By Maria" (portada, footer).
 * El tamaño se controla con className (w-* o h-*); la otra medida es automática.
 */
export function Logo({
  className,
  title = site.name,
  tone = "light",
  variant = "mark",
  priority = false,
}: {
  className?: string;
  /** Texto alternativo; vacío = decorativo. */
  title?: string;
  tone?: "light" | "dark";
  variant?: "mark" | "full";
  priority?: boolean;
}) {
  const src = variant === "full" ? (tone === "light" ? fullWhite : fullBlack) : tone === "light" ? logoWhite : logoBlack;
  return (
    <Image
      src={src}
      alt={title}
      aria-hidden={title ? undefined : true}
      priority={priority}
      sizes={variant === "full" ? "(min-width: 768px) 560px, 80vw" : "(min-width: 768px) 160px, 120px"}
      className={cn("h-auto select-none", className)}
      draggable={false}
    />
  );
}

/** Nombre de la marca en tipografía display. */
export function Wordmark({ className }: { className?: string }) {
  return <span className={cn("font-display font-semibold tracking-[0.32em] uppercase", className)}>{site.name}</span>;
}
