/**
 * Tarjeta "Descubre tu esencia" al inicio del catálogo (diseño entregado por la tienda):
 * marco vino con esquinas marcadas sobre blanco.
 */
export function CollectionsIntro() {
  return (
    <section aria-labelledby="colecciones-title" className="relative mx-auto mb-10 max-w-xl bg-white px-6 py-10 text-center md:mb-12 md:px-12 md:py-12">
      {/* Marco fino con esquinas más gruesas */}
      <span aria-hidden className="pointer-events-none absolute inset-2.5 border border-[#6b0213]/70" />
      <span aria-hidden className="pointer-events-none absolute top-2.5 left-2.5 size-5 border-t-2 border-l-2 border-[#6b0213]" />
      <span aria-hidden className="pointer-events-none absolute top-2.5 right-2.5 size-5 border-t-2 border-r-2 border-[#6b0213]" />
      <span aria-hidden className="pointer-events-none absolute bottom-2.5 left-2.5 size-5 border-b-2 border-l-2 border-[#6b0213]" />
      <span aria-hidden className="pointer-events-none absolute right-2.5 bottom-2.5 size-5 border-r-2 border-b-2 border-[#6b0213]" />

      <p className="text-[0.6875rem] font-medium tracking-[0.32em] text-[#6b0213] uppercase">Nuestras colecciones</p>
      <h2 id="colecciones-title" className="mt-5 font-display text-[2.25rem] leading-[0.95] font-medium text-[#1d1d1b] md:text-[3rem]">
        Descubre tu
        <span className="block font-semibold text-[#6b0213] italic">esencia</span>
      </h2>
      <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed font-light text-[#2b2b2b]">
        Perfumes originales cuidadosamente seleccionados, para cada personalidad y cada ocasión.
      </p>
      <span aria-hidden className="mx-auto mt-7 block h-px w-36 bg-[#6b0213]" />
      <p className="mt-4 text-xs font-medium tracking-[0.32em] text-[#6b0213] uppercase">100% originales</p>
    </section>
  );
}
