import { Logo } from "@/components/brand/Logo";
import { MountainRange } from "@/components/brand/MountainRange";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Logo className="mb-12 w-40" />
      <p className="eyebrow mb-6 text-sand">Error 404</p>
      <h1 className="text-h1 max-w-3xl uppercase">Este sendero aún no existe</h1>
      <p className="text-lead mt-6 max-w-md text-mist">
        La página que buscas se movió o todavía está en construcción.
      </p>
      <Button href="/" size="lg" className="mt-12">
        Volver al inicio
      </Button>
      <MountainRange className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[35svh]" />
    </main>
  );
}
