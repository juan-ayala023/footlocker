"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { LazyMotion, MotionConfig } from "framer-motion";
import { PageTransitionProvider } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { useCart } from "@/store/cart";

const Cursor = dynamic(() => import("@/components/motion/Cursor").then((m) => m.Cursor), { ssr: false });
const SharedImageLayer = dynamic(() => import("@/components/motion/SharedImageLayer").then((m) => m.SharedImageLayer), { ssr: false });

// Funciones de animación cargadas después de hidratar: núcleo de Framer más liviano en el bundle inicial.
const loadMotionFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

export function Providers({ children }: { children: React.ReactNode }) {
  // El panel admin es una herramienta de trabajo: scroll y cursor nativos.
  const isAdmin = usePathname().startsWith("/admin");

  // El carrito se rehidrata tras montar para no romper la hidratación del SSR.
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <SmoothScroll disabled={isAdmin}>
          <PageTransitionProvider>{children}</PageTransitionProvider>
          <SharedImageLayer />
          {!isAdmin && <Cursor />}
        </SmoothScroll>
      </MotionConfig>
    </LazyMotion>
  );
}
