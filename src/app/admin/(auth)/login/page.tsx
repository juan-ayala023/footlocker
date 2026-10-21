import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { signOut } from "@/lib/admin/actions";
import { isAuthConfigured } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ingresar" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  // Solo rutas internas del panel como destino (evita redirecciones abiertas).
  const destination = next?.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

  let signedInWithoutRole: string | null = null;
  if (isAuthConfigured) {
    const supabase = await createSessionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && user.app_metadata?.role !== "admin") signedInWithoutRole = user.email ?? "tu cuenta";
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Logo className="mx-auto mb-10 w-32" />
        <h1 className="text-h3 text-center uppercase">Panel de administración</h1>

        {!isAuthConfigured ? (
          <p className="mt-8 border border-sand/40 bg-sand/10 p-5 text-sm text-sand">
            Supabase no está configurado. Agrega <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en{" "}
            <code>.env.local</code> y reinicia el servidor.
          </p>
        ) : signedInWithoutRole ? (
          <div className="mt-8 space-y-5 text-center">
            <p className="text-sm text-mist">
              {signedInWithoutRole} no tiene permisos de administrador. Pide que te asignen el rol en Supabase.
            </p>
            <form action={signOut}>
              <button type="submit" className="eyebrow text-stone underline-offset-4 hover:text-bone hover:underline">
                Cerrar sesión
              </button>
            </form>
          </div>
        ) : (
          <LoginForm next={destination} />
        )}
      </div>
    </main>
  );
}
