"use client";

import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import { useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "@/components/motion/SmoothScroll";
import { mainNav, site } from "@/config/site";
import { ease } from "@/lib/motion";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: ease.premium }}
          className="fixed inset-0 z-40 flex flex-col bg-ink pt-(--nav-h) md:hidden"
        >
          <nav aria-label="Móvil" className="container-page flex flex-1 flex-col justify-center">
            <ul className="space-y-2">
              {mainNav.map((item, i) => (
                <li key={item.href} className="mask">
                  <m.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.9, ease: ease.premium, delay: 0.25 + i * 0.07 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="font-display text-h1 font-bold uppercase active:text-sand"
                    >
                      {item.label}
                    </Link>
                  </m.div>
                </li>
              ))}
            </ul>
          </nav>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="container-page flex items-center justify-between border-t border-line py-6"
          >
            <span className="eyebrow text-stone">{site.tagline}</span>
            <div className="flex gap-5">
              <a href={site.social.instagram} target="_blank" rel="noreferrer" className="eyebrow">
                IG
              </a>
              <a href={site.social.tiktok} target="_blank" rel="noreferrer" className="eyebrow">
                TT
              </a>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
