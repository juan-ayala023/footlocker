export type Gender = "hombre" | "mujer" | "unisex";

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  sort_order: number;
};

export type Variant = {
  id: string;
  size: number;
  stock: number;
  sku: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  gender: Gender;
  collection: Pick<Collection, "slug" | "name"> | null;
  images: string[];
  featured: boolean;
  created_at: string;
  variants: Variant[];
};
