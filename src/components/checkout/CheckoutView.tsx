"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { Field, inputClass } from "@/components/checkout/Field";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { customerSchema, DEPARTMENTS, type CheckoutResponse, type CustomerInput } from "@/lib/checkout-schema";
import { ease } from "@/lib/motion";
import { cn, formatCOP } from "@/lib/utils";
import { openWompiCheckout } from "@/lib/wompi-widget";
import { trackInitiateCheckout } from "@/lib/analytics";
import { selectSubtotal, useCart } from "@/store/cart";

type Key = keyof CustomerInput;
const DRAFT_KEY = "fl-checkout-draft";
// Orden visual de los campos (para enfocar el primer error de arriba hacia abajo).
const FIELD_ORDER: Key[] = ["email", "phone", "name", "address", "city", "region"];
const empty: CustomerInput = { name: "", email: "", phone: "", address: "", city: "", region: "" as CustomerInput["region"] };

export function CheckoutView() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const syncStock = useCart((s) => s.syncStock);

  const [form, setForm] = useState<CustomerInput>(empty);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [status, setStatus] = useState<"idle" | "creating" | "paying">("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const shipping = subtotal >= site.shipping.freeFrom ? 0 : site.shipping.flat;
  const total = subtotal + shipping;

  // InitiateCheckout una sola vez, cuando el carrito ya cargó.
  const initiated = useRef(false);
  useEffect(() => {
    if (!hydrated || initiated.current || items.length === 0) return;
    initiated.current = true;
    trackInitiateCheckout(items.map((i) => ({ id: i.productId, name: `${i.brand} ${i.name}`, brand: i.brand, price: i.price, quantity: i.quantity, size: i.size })));
  }, [hydrated, items]);

  // Borrador del formulario en la sesión (útil si el pago falla y vuelve).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) setForm({ ...empty, ...JSON.parse(saved) });
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  const validateField = (key: Key, value: string) => {
    const result = customerSchema.shape[key].safeParse(value);
    setErrors((e) => ({ ...e, [key]: result.success ? undefined : result.error.issues[0]?.message }));
  };

  const bind = (key: Key) => ({
    id: `f-${key}`,
    name: key,
    value: form[key],
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `f-${key}-error` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) validateField(key, e.target.value);
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => form[key] && validateField(key, e.target.value),
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    const parsed = customerSchema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<Key, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as Key;
        next[k] ??= issue.message;
      }
      setErrors(next);
      document.getElementById(`f-${FIELD_ORDER.find((k) => next[k])}`)?.focus();
      return;
    }

    setStatus("creating");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        }),
      });
      const data = (await res.json()) as CheckoutResponse;

      if (!data.ok) {
        if (data.items) data.items.forEach((i) => syncStock(i.variantId, i.available));
        if (data.fields) setErrors(data.fields as Partial<Record<Key, string>>);
        setNotice(
          data.code === "STOCK" || data.code === "UNAVAILABLE"
            ? `${data.message} Ajustamos tu carrito; revisa el resumen y vuelve a intentarlo.`
            : data.message,
        );
        setStatus("idle");
        return;
      }

      setStatus("paying");
      const c = parsed.data;
      const result = await openWompiCheckout({
        currency: data.currency,
        amountInCents: data.amountInCents,
        reference: data.reference,
        publicKey: data.publicKey,
        signature: { integrity: data.signature },
        redirectUrl: data.redirectUrl,
        customerData: { email: c.email, fullName: c.name, phoneNumber: c.phone, phoneNumberPrefix: "+57" },
        shippingAddress: { addressLine1: c.address, city: c.city, phoneNumber: c.phone, region: c.region, country: "CO" },
      });

      if (result.transaction?.id) {
        router.push(`/confirmacion/${data.reference}?id=${result.transaction.id}`);
      } else {
        setStatus("idle");
      }
    } catch {
      setNotice("No pudimos conectar con la pasarela de pago. Revisa tu conexión e intenta de nuevo.");
      setStatus("idle");
    }
  };

  if (!hydrated) return <div className="min-h-svh" />;

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-svh flex-col items-center justify-center text-center">
        <p className="eyebrow mb-6 text-stone">Checkout</p>
        <h1 className="text-h2 uppercase">Tu carrito está vacío</h1>
        <p className="mt-4 text-stone">Agrega un par para continuar con tu compra.</p>
        <Button href="/catalogo" size="lg" className="mt-10">
          Ver catálogo
        </Button>
      </div>
    );
  }

  const busy = status !== "idle";

  return (
    <div className="container-page pt-[calc(var(--nav-h)+2rem)] pb-24 md:pt-[calc(var(--nav-h)+4rem)]">
      <header className="mb-10 md:mb-16">
        <p className="eyebrow mb-5 text-stone">Checkout</p>
        <TextReveal as="h1" text="Finaliza tu compra" play className="text-h1 uppercase" />
      </header>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Resumen (arriba y plegable en móvil, columna derecha en desktop) */}
        <aside className="lg:order-2 lg:col-span-5" aria-label="Resumen del pedido">
          <div className="border border-line lg:sticky lg:top-28">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              aria-expanded={summaryOpen}
              className="flex w-full items-center justify-between px-5 py-4 lg:pointer-events-none"
            >
              <span className="eyebrow">
                Resumen <span className="text-stone">({items.reduce((n, i) => n + i.quantity, 0)})</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-sm tabular-nums">{formatCOP(total)}</span>
                <span aria-hidden className={cn("text-stone transition-transform duration-500 lg:hidden", summaryOpen && "rotate-180")}>
                  ⌄
                </span>
              </span>
            </button>

            <div className={cn("border-t border-line px-5 pb-5", !summaryOpen && "hidden lg:block")}>
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <li key={item.variantId} className="flex gap-4 py-4">
                    <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-ink-raised">
                      {item.image && <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />}
                      <span className="absolute -top-0 -right-0 flex size-5 items-center justify-center bg-sand text-[0.625rem] text-ink tabular-nums">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="eyebrow text-stone">{item.brand}</p>
                      <p className="mt-1 truncate text-sm">{item.name}</p>
                      <p className="mt-0.5 text-xs text-stone">Talla {item.size}</p>
                    </div>
                    <p className="text-sm tabular-nums">{formatCOP(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <dl className="space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-mist">Subtotal</dt>
                  <dd className="tabular-nums">{formatCOP(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-mist">Envío</dt>
                  <dd className="tabular-nums">{shipping ? formatCOP(shipping) : <span className="text-sand">Gratis</span>}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-4">
                  <dt className="eyebrow">Total</dt>
                  <dd className="font-display text-h3 font-bold tabular-nums">{formatCOP(total)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>

        <form onSubmit={submit} noValidate className="lg:order-1 lg:col-span-7">
          <fieldset disabled={busy} className="space-y-12">
            <section>
              <h2 className="eyebrow mb-6 flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full border border-line text-[0.625rem]">1</span>
                Contacto
              </h2>
              <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <Field id="f-email" label="Correo" error={errors.email} hint="Te enviamos la confirmación aquí.">
                  <input type="email" autoComplete="email" inputMode="email" placeholder="tu@correo.com" className={inputClass(errors.email)} {...bind("email")} />
                </Field>
                <Field id="f-phone" label="Celular" error={errors.phone}>
                  <input type="tel" autoComplete="tel-national" inputMode="tel" placeholder="300 123 4567" className={inputClass(errors.phone)} {...bind("phone")} />
                </Field>
              </div>
            </section>

            <section>
              <h2 className="eyebrow mb-6 flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full border border-line text-[0.625rem]">2</span>
                Envío
              </h2>
              <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <Field id="f-name" label="Nombre completo" error={errors.name} className="sm:col-span-2">
                  <input autoComplete="name" placeholder="Nombre y apellido" className={inputClass(errors.name)} {...bind("name")} />
                </Field>
                <Field id="f-address" label="Dirección" error={errors.address} hint="Ej.: Cra 7 # 45-10, apto 302" className="sm:col-span-2">
                  <input autoComplete="street-address" placeholder="Calle, número, apto o casa" className={inputClass(errors.address)} {...bind("address")} />
                </Field>
                <Field id="f-city" label="Ciudad o municipio" error={errors.city}>
                  <input autoComplete="address-level2" placeholder="Medellín" className={inputClass(errors.city)} {...bind("city")} />
                </Field>
                <Field id="f-region" label="Departamento" error={errors.region}>
                  <select autoComplete="address-level1" className={cn(inputClass(errors.region), "cursor-pointer", !form.region && "text-stone/60")} {...bind("region")}>
                    <option value="" disabled>
                      Elige uno
                    </option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d} className="bg-ink text-bone">
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>

            <section>
              <h2 className="eyebrow mb-6 flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full border border-line text-[0.625rem]">3</span>
                Pago
              </h2>
              <div className="flex items-start gap-4 border border-line p-5">
                <LockIcon />
                <div>
                  <p className="text-sm">Pago seguro con Wompi</p>
                  <p className="mt-1 text-sm text-stone">
                    Tarjeta de crédito o débito, PSE, Nequi y más. Al continuar se abrirá la pasarela de Wompi para completar el pago.
                  </p>
                </div>
              </div>
            </section>

            <AnimatePresence>
              {notice && (
                <m.p
                  role="alert"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: ease.premium }}
                  className="border border-sand/40 bg-sand/10 px-5 py-4 text-sm text-sand"
                >
                  {notice}
                </m.p>
              )}
            </AnimatePresence>

            <div>
              <Magnetic strength={0.12} className="w-full">
                <Button type="submit" size="lg" className="w-full" aria-busy={busy}>
                  {status === "creating" ? "Preparando tu pago…" : status === "paying" ? "Completa el pago en Wompi…" : `Pagar ${formatCOP(total)}`}
                </Button>
              </Magnetic>
              <p className="mt-4 text-center text-xs text-stone">
                Al pagar aceptas nuestras condiciones de compra. Garantía legal de 15 días por defectos de fábrica.
              </p>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden className="mt-0.5 size-5 shrink-0 text-sand">
      <rect x="5" y="10" width="14" height="10" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
