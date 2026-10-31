import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Metadata siempre en <head> (no por streaming): la leen todos los crawlers y previews sociales.
  htmlLimitedBots: /.*/,
  experimental: {
    // CSS incrustado en el HTML: elimina la petición que bloquea el primer render (~11 KB).
    inlineCss: true,
  },
  images: {
    // Sin el optimizador de Vercel: el cupo del plan se agotó y las fotos nuevas salían rotas (402).
    // Las imágenes ya se sirven livianas: el catálogo en webp y el admin comprime antes de subir.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Imágenes de prueba hasta conectar Supabase Storage (fase 3)
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
