import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MOUNTAIN_LAYERS } from "@/components/brand/MountainRange";
import { site } from "@/config/site";

export const alt = `${site.legalName} · ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen para compartir en redes: logo, nombre y cordillera sobre negro. */
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#000000", position: "relative" }}>
        <svg width="1200" height="267" viewBox="0 0 1440 320" style={{ position: "absolute", bottom: 0, left: 0 }}>
          {MOUNTAIN_LAYERS.map((l) => (
            <path key={l.id} d={l.d} fill={l.fill} />
          ))}
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={480} height={198} alt="" />
        <div style={{ marginTop: 40, fontSize: 44, fontWeight: 700, letterSpacing: 18, color: "#FFFFFF", textTransform: "uppercase" }}>{site.name}</div>
        <div style={{ marginTop: 14, fontSize: 22, letterSpacing: 10, color: "#E0E0DC", textTransform: "uppercase" }}>{site.tagline}</div>
      </div>
    ),
    size,
  );
}
