import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.legalName} · ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen para compartir en redes: logo completo y lema en crema sobre vino. */
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-full-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at center, #6b0213 0%, #1c0408 75%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={500} height={439} alt="" />
        <div style={{ marginTop: 28, fontSize: 24, letterSpacing: 10, color: "#E9D6BD", textTransform: "uppercase" }}>{site.tagline}</div>
      </div>
    ),
    size,
  );
}
