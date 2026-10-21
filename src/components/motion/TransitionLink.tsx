"use client";

import Link from "next/link";
import { usePageTransition } from "@/components/motion/PageTransition";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

/** next/link que pasa por la transición de página (y hace scroll suave a anclas). */
export function TransitionLink({ href, onClick, target, ...rest }: Props) {
  const { navigate } = usePageTransition();

  return (
    <Link
      href={href}
      target={target}
      onClick={(e) => {
        onClick?.(e);
        const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
        if (e.defaultPrevented || modified || target === "_blank") return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
}
