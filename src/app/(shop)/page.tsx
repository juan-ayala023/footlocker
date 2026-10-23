import { CommunityGallery } from "@/components/community/CommunityGallery";
import { Drop } from "@/components/home/Drop";
import { Hero } from "@/components/home/Hero";
import { SportStack } from "@/components/home/SportStack";
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
      <SportStack />
      <Drop product={products.find((p) => p.slug === drop.slug)} />
      <CommunityGallery photos={community} />
    </>
  );
}
