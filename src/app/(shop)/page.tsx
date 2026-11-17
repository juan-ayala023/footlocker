import { CommunityGallery } from "@/components/community/CommunityGallery";
import { Drop } from "@/components/home/Drop";
import { Hero } from "@/components/home/Hero";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { drop } from "@/data/home";
import { getCatalog } from "@/lib/catalog";
import { getCommunityPhotos } from "@/lib/community";
import { baseOpenGraph } from "@/lib/seo";

export const revalidate = 60;

export const metadata = { alternates: { canonical: "/" }, openGraph: { ...baseOpenGraph, url: "/" } };

export default async function HomePage() {
  const [{ products }, community] = await Promise.all([getCatalog(), getCommunityPhotos()]);

  return (
    <>
      <Hero />
      <CategoryTiles />
      <Drop product={products.find((p) => p.slug === drop.slug) ?? products.find((p) => p.featured)} />
      <CommunityGallery photos={community} />
    </>
  );
}
