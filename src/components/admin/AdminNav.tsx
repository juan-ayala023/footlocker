"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { signOut } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/colecciones", label: "Colecciones" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const active = (l: (typeof links)[number]) => (l.exact ? pathname === l.href : pathname.startsWith(l.href));

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur-xl lg:h-svh lg:self-start lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-4 sm:px-8 lg:px-6 lg:py-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo className="w-14" title="" />
            <span className="eyebrow">Admin</span>
          </Link>
          <Link href="/" target="_blank" className="eyebrow text-stone hover:text-bone lg:hidden">
            Ver tienda ↗
          </Link>
        </div>

        <nav aria-label="Admin" className="overflow-x-auto [scrollbar-width:none] lg:flex-1">
          <ul className="flex gap-1 px-3 pb-3 sm:px-7 lg:flex-col lg:px-3 lg:pb-0">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active(l) ? "page" : undefined}
                  className={cn(
                    "block rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors lg:rounded-none lg:border-l lg:px-4 lg:py-2.5",
                    active(l) ? "bg-bone text-ink lg:border-sand lg:bg-transparent lg:text-bone" : "text-mist hover:text-bone lg:border-transparent",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden space-y-4 border-t border-line px-6 py-6 lg:block">
          <Link href="/" target="_blank" className="eyebrow block text-stone hover:text-bone">
            Ver tienda ↗
          </Link>
          <p className="truncate text-xs text-stone" title={email}>
            {email}
          </p>
          <form action={signOut}>
            <button type="submit" className="eyebrow text-stone hover:text-sand">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
