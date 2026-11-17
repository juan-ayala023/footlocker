import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Logo className="mb-12 w-28" />
      <p className="eyebrow mb-6 text-sand">Error 404</p>
      <h1 className="text-h1 max-w-3xl">Esta página no existe</h1>
      <p className="text-lead mt-6 max-w-md text-mist">
        La página que buscas se movió o ya no está disponible.
      </p>
      <Button href="/" size="lg" className="mt-12">
        Volver al inicio
      </Button>
    </main>
  );
}
