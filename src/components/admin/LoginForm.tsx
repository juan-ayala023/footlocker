"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputClass } from "@/components/checkout/Field";
import { Button } from "@/components/ui/Button";
import { getBrowserClient } from "@/lib/supabase/browser";

// El panel tiene una sola cuenta: se entra solo con la clave. El correo es el del usuario admin en Supabase.
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@footlocker.col";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await getBrowserClient().auth.signInWithPassword({ email: ADMIN_EMAIL, password });
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Clave incorrecta." : error.message);
      setLoading(false);
      return;
    }
    if (data.user?.app_metadata?.role !== "admin") {
      setError("Esta cuenta no tiene permisos de administrador.");
      await getBrowserClient().auth.signOut();
      setLoading(false);
      return;
    }
    router.replace(next);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="mt-10 space-y-2">
      {/* Campo oculto para que el navegador asocie la clave guardada a esta cuenta. */}
      <input type="email" name="username" autoComplete="username" value={ADMIN_EMAIL} readOnly hidden />
      <Field id="login-password" label="Clave" error={error ?? undefined}>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass(error ?? undefined)}
        />
      </Field>
      <Button type="submit" size="lg" className="mt-4 w-full" disabled={loading}>
        {loading ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
