// Opciones fijas de los filtros de perfumes. El `value` es lo que se guarda en la base
// (products.notes / products.occasions) y va en la URL; el `label` es lo que se muestra.

export const NOTES = [
  { value: "amaderado", label: "Amaderadas" },
  { value: "floral", label: "Florales" },
  { value: "frutal", label: "Frutales" },
  { value: "citrico", label: "Cítricas" },
  { value: "dulce", label: "Dulces" },
  { value: "oriental", label: "Orientales / ámbar" },
  { value: "especiado", label: "Especiadas" },
  { value: "fresco", label: "Frescas / acuáticas" },
  { value: "aromatico", label: "Aromáticas" },
  { value: "almizclado", label: "Almizcladas" },
] as const;

export const OCCASIONS = [
  { value: "dia", label: "Día" },
  { value: "noche", label: "Noche" },
  { value: "oficina", label: "Oficina" },
  { value: "cita", label: "Cita" },
  { value: "evento", label: "Eventos y fiestas" },
  { value: "diario", label: "Uso diario" },
] as const;

export const AVAILABILITY = [
  { value: "disponible", label: "Disponible" },
  { value: "agotado", label: "Agotado" },
] as const;

export type Note = (typeof NOTES)[number]["value"];
export type Occasion = (typeof OCCASIONS)[number]["value"];
export type Availability = (typeof AVAILABILITY)[number]["value"];

export const NOTE_VALUES = NOTES.map((n) => n.value) as [Note, ...Note[]];
export const OCCASION_VALUES = OCCASIONS.map((o) => o.value) as [Occasion, ...Occasion[]];
