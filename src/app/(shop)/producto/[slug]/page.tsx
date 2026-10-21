import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { TextReveal } from "@/components/motion/TextReveal";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { site } from "@/config/site";
import { getCatalog } from "@/lib/catalog";
import { getRelated, inStock } from "@/lib/catalog-filters";
import { baseOpenGraph } from "@/lib/seo";
import { productTitle } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const { products } = await getCatalog();
  return products.map((p) => ({ slug: p.slug }));
}

async function findProduct(slug: string) {
  const { products } = await getCatalog();
  const product = products.find((p) => p.slug === slug);
  return { product, products };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await findProduct(slug);
  if (!product) return {};
  const title = productTitle(product.brand, product.name);
  return {
    title,
    description: product.description ?? undefined,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: { ...baseOpenGraph, title, description: product.description ?? undefined, url: `/producto/${product.slug}`, images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const { product, products } = await findProduct(slug);
  if (!product) notFound();

  const related = getRelated(products, product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productTitle(product.brand, product.name),
    image: product.images,
    description: product.description,
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: `${site.url}/producto/${product.slug}`,
      priceCurrency: site.currency,
      price: product.price,
      availability: inStock(product) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="container-page grid gap-10 pt-[calc(var(--nav-h)+1rem)] pb-24 lg:grid-cols-12 lg:gap-16 lg:pt-[calc(var(--nav-h)+3rem)]">
        <div className="-mx-(--gutter) lg:col-span-7 lg:mx-0">
          <ProductGallery slug={product.slug} images={product.images} alt={productTitle(product.brand, product.name)} />
        </div>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados-title" className="container-page border-t border-line pt-20 pb-8 md:pt-28">
          <p className="eyebrow mb-5 text-stone">Sigue explorando</p>
          <h2 id="relacionados-title" className="text-h2 mb-12 uppercase md:mb-16">
            <TextReveal text="También te puede gustar" />
          </h2>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
