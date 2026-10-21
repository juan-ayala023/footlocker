import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full eyebrow " +
  "transition-colors duration-500 ease-premium disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  solid: "bg-sand text-ink hover:bg-bone",
  outline: "border border-line text-bone hover:border-bone",
  ghost: "text-bone hover:text-sand",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6",
  lg: "h-14 px-9",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & { href: string } & Omit<
    React.ComponentProps<typeof TransitionLink>,
    "href" | "className" | "children"
  >;
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

/** Etiqueta con efecto "roll": el texto sube y entra una copia desde abajo al hover. */
function RollLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-premium group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-premium group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "solid", size = "md", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = <RollLabel>{children}</RollLabel>;

  if (rest.href !== undefined) {
    return (
      <TransitionLink {...(rest as ButtonAsLink)} className={classes}>
        {content}
      </TransitionLink>
    );
  }
  return (
    <button type="button" {...(rest as ButtonAsButton)} className={classes}>
      {content}
    </button>
  );
}
