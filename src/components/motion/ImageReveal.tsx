"use client";

import { m } from "framer-motion";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Reveal tipo clip-path de abajo hacia arriba, con la imagen des-escalando dentro. */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      className={cn("relative overflow-hidden", className)}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.2, ease: ease.premium, delay }}
    >
      <m.div
        className="absolute inset-0"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1.6, ease: ease.outSoft, delay }}
      >
        {children}
      </m.div>
    </m.div>
  );
}
