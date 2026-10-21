"use client";

import { useRef } from "react";
import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { cn } from "@/lib/utils";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Marquee infinito que acelera y cambia de dirección con la velocidad del scroll.
 * El contenido se duplica en dos mitades idénticas y se desplaza entre -50% y 0%.
 */
export function Marquee({
  children,
  speed = 3,
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  /** % del ancho por segundo */
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(reverse ? 1 : -1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const f = factor.get();
    if (f < 0) direction.current = reverse ? -1 : 1;
    else if (f > 0) direction.current = reverse ? 1 : -1;
    let move = direction.current * speed * (delta / 1000);
    move += move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  return (
    <div className={cn("flex overflow-hidden whitespace-nowrap", className)}>
      <m.div className="flex shrink-0 will-change-transform" style={{ x }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </m.div>
    </div>
  );
}
