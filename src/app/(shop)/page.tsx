import { BrandMarquee } from "@/components/home/BrandMarquee";
import { Collections } from "@/components/home/Collections";
import { Drop } from "@/components/home/Drop";
import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { getCatalog } from "@/lib/catalog";
import { baseOpenGraph } from "@/lib/seo";

export const revalidate = 60;

export const metadata = { alternates: { canonical: "/" }, openGraph: { ...baseOpenGraph, url: "/" } };

export default async function HomePage() {
  const { products, collections } = await getCatalog();
  const withCount = collections.map((c) => ({
    ...c,
    count: products.filter((p) => p.collection?.slug === c.slug).length,
  }));

  return (
    <>
      <Hero />
      <BrandMarquee />
      <Collections collections={withCount} />
      <Drop />
      <Story />
    </>
  );
}
