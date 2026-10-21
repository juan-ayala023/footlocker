import Image from "next/image";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import logoBlack from "../../../public/brand/logo-black.png";
import logoWhite from "../../../public/brand/logo-white.png";

/**
 * Logo oficial: montaña con la F y la L. Generado desde public/brand/logo-original.png
 * en dos versiones con fondo transparente (blanca para fondos oscuros, negra para claros).
 * El ancho se controla con className (w-*); la altura es automática.
 */
export function Logo({
  className,
  title = site.name,
  tone = "light",
  priority = false,
}: {
  className?: string;
  /** Texto alternativo; vacío = decorativo. */
  title?: string;
  tone?: "light" | "dark";
  priority?: boolean;
}) {
  return (
    <Image
      src={tone === "light" ? logoWhite : logoBlack}
      alt={title}
      aria-hidden={title ? undefined : true}
      priority={priority}
      sizes="(min-width: 768px) 240px, 160px"
      className={cn("h-auto select-none", className)}
      draggable={false}
    />
  );
}

/** Nombre de la marca en tipografía display. */
export function Wordmark({ className }: { className?: string }) {
  return <span className={cn("font-display font-bold tracking-[0.32em] uppercase", className)}>{site.name}</span>;
}
