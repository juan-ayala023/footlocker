import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(value: number) {
  return copFormatter.format(value);
}

/** "Jordan" + "Air Jordan 1" → "Air Jordan 1"; "Nike" + "Air Max 90" → "Nike Air Max 90". */
export function productTitle(brand: string, name: string) {
  return name.toLowerCase().includes(brand.toLowerCase()) ? name : `${brand} ${name}`;
}
