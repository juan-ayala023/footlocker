import { STATUS_LABEL, STATUS_TONE } from "@/lib/admin/status";
import type { OrderStatus } from "@/lib/orders-types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("eyebrow inline-flex h-6 items-center rounded-full border px-2.5 text-[0.625rem] whitespace-nowrap", STATUS_TONE[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PageHeader({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
      <div>
        {eyebrow && <p className="eyebrow mb-3 text-stone">{eyebrow}</p>}
        <h1 className="text-h2 uppercase">{title}</h1>
      </div>
      {children}
    </header>
  );
}

export function Panel({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("border border-line", className)}>
      {title && <h2 className="eyebrow border-b border-line px-5 py-4">{title}</h2>}
      {children}
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-stone">{children}</p>;
}

const dateFmt = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Bogota",
});

/** Solo en Server Components (Intl difiere entre Node y navegador). */
export const formatDate = (iso: string | null) => (iso ? dateFmt.format(new Date(iso)) : "—");
