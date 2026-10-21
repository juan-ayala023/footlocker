import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Segunda validación (además del middleware), contra Supabase Auth.
  const { user } = await requireAdmin();

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[15rem_1fr]">
      <AdminNav email={user.email ?? ""} />
      <main className="min-w-0 px-4 pt-6 pb-24 sm:px-8 lg:px-12 lg:pt-12">{children}</main>
    </div>
  );
}
