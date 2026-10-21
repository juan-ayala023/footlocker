// Easing y duraciones compartidas entre Framer Motion, GSAP y CSS (ver globals.css).
export const ease = {
  premium: [0.76, 0, 0.24, 1] as const,
  outSoft: [0.16, 1, 0.3, 1] as const,
};

export const gsapEase = {
  premium: "cubic-bezier(0.76, 0, 0.24, 1)",
  outSoft: "expo.out",
};

export const duration = {
  sm: 0.6,
  md: 0.9,
  lg: 1.2,
};
