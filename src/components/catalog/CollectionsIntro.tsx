/**
 * Tarjeta "Descubre tu esencia" al inicio del catálogo (diseño entregado por la tienda):
 * marco vino con esquinas marcadas sobre crema.
 */
export function CollectionsIntro() {
  return (
    <section aria-labelledby="colecciones-title" className="relative mx-auto mb-12 max-w-3xl bg-[#fbf6f1] px-6 py-16 text-center md:mb-16 md:px-16 md:py-20">
      {/* Marco fino con esquinas más gruesas */}
      <span aria-hidden className="pointer-events-none absolute inset-3 border border-[#6b0213]/70 md:inset-4" />
      <span aria-hidden className="pointer-events-none absolute top-3 left-3 size-6 border-t-2 border-l-2 border-[#6b0213] md:top-4 md:left-4 md:size-8" />
      <span aria-hidden className="pointer-events-none absolute top-3 right-3 size-6 border-t-2 border-r-2 border-[#6b0213] md:top-4 md:right-4 md:size-8" />
      <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 size-6 border-b-2 border-l-2 border-[#6b0213] md:bottom-4 md:left-4 md:size-8" />
      <span aria-hidden className="pointer-events-none absolute right-3 bottom-3 size-6 border-r-2 border-b-2 border-[#6b0213] md:right-4 md:bottom-4 md:size-8" />

      <p className="text-xs font-medium tracking-[0.32em] text-[#6b0213] uppercase md:text-sm">Nuestras colecciones</p>
      <h2 id="colecciones-title" className="mt-8 font-display text-[3rem] leading-[0.95] font-medium text-[#1d1d1b] md:text-[4.5rem]">
        Descubre tu
        <span className="block font-semibold text-[#6b0213] italic">esencia</span>
      </h2>
      <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed font-light text-[#2b2b2b] md:text-xl">
        Perfumes originales cuidadosamente seleccionados, para cada personalidad y cada ocasión.
      </p>
      <span aria-hidden className="mx-auto mt-10 block h-0.5 w-48 bg-[#6b0213] md:w-60" />
      <p className="mt-6 text-sm font-medium tracking-[0.32em] text-[#6b0213] uppercase">100% originales</p>
    </section>
  );
}
