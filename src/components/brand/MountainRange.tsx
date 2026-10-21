import { cn } from "@/lib/utils";

/** Capas de la cordillera, de atrás hacia adelante. Se reutilizan en el footer y el parallax del hero. */
export const MOUNTAIN_LAYERS = [
  {
    id: "back",
    fill: "#1c1c1c",
    d: "M0 210 L120 150 L230 190 L380 90 L520 170 L640 120 L760 180 L900 70 L1040 160 L1180 110 L1300 170 L1440 130 V320 H0 Z",
  },
  {
    id: "mid",
    fill: "#151515",
    d: "M0 250 L160 190 L300 240 L460 160 L600 230 L720 140 L860 230 L1000 170 L1140 240 L1290 180 L1440 230 V320 H0 Z",
  },
  {
    id: "front",
    fill: "#0e0e0e",
    d: "M0 290 L200 240 L360 280 L540 220 L720 280 L880 230 L1060 285 L1240 240 L1440 280 V320 H0 Z",
  },
] as const;

export function MountainLayer({
  layer,
  className,
  snow = false,
}: {
  layer: (typeof MOUNTAIN_LAYERS)[number];
  className?: string;
  snow?: boolean;
}) {
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden className={cn("block w-full", className)}>
      {snow && (
        <defs>
          <linearGradient id={`snow-${layer.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2a2a" />
            <stop offset="0.35" stopColor={layer.fill} />
          </linearGradient>
        </defs>
      )}
      <path fill={snow ? `url(#snow-${layer.id})` : layer.fill} d={layer.d} />
    </svg>
  );
}

export function MountainRange({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className={cn("block w-full", className)}
    >
      {MOUNTAIN_LAYERS.map((layer) => (
        <path key={layer.id} fill={layer.fill} d={layer.d} />
      ))}
    </svg>
  );
}
