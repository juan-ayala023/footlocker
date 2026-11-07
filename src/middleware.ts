import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Tienda cerrada al público en producción (Vercel) mientras se define la marca.
 * Para reabrir: variable de entorno STORE_OPEN=1 en Vercel y Redeploy.
 * Siguen disponibles el panel (/admin) y los eventos de Wompi de pedidos anteriores.
 */
const storeClosed = process.env.VERCEL_ENV === "production" && process.env.STORE_OPEN !== "1";
const OPEN_WHILE_CLOSED = ["/admin", "/api/webhooks", "/api/orders"];

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const MAINTENANCE_HTML = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Volvemos pronto</title>
<style>body{margin:0;min-height:100svh;display:grid;place-items:center;background:#000;color:#fff;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center;padding:24px}
h1{font-size:clamp(28px,6vw,48px);margin:0 0 12px;letter-spacing:-.02em}p{color:#bbb;margin:0 auto;max-width:28rem}a{color:#fff}</style></head>
<body><main><h1>Volvemos pronto</h1><p>Estamos renovando nuestra tienda. Muy pronto estaremos de vuelta.</p>${
  whatsapp ? `<p style="margin-top:20px"><a href="https://wa.me/${whatsapp}">Escríbenos por WhatsApp</a></p>` : ""
}</main></body></html>`;

/**
 * Protege /admin: refresca la sesión de Supabase y exige app_metadata.role = 'admin'.
 * (El layout del panel vuelve a validar, y RLS protege los datos en la base.)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (storeClosed && !OPEN_WHILE_CLOSED.some((p) => pathname.startsWith(p))) {
    const headers = { "Retry-After": "86400", "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ ok: false, message: "La tienda está cerrada temporalmente." }, { status: 503, headers });
    }
    return new NextResponse(MAINTENANCE_HTML, { status: 503, headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } });
  }
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const isLogin = pathname.startsWith("/admin/login");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return isLogin ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() valida el token contra Supabase Auth (no confía solo en la cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = user?.app_metadata?.role === "admin";

  if (isLogin) {
    return isAdmin ? NextResponse.redirect(new URL("/admin", request.url)) : response;
  }
  if (!isAdmin) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  // Todo menos los archivos internos de Next (el cierre de la tienda aplica a todas las páginas).
  matcher: ["/((?!_next/static|_next/image).*)"],
};
