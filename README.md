# footlocker

E-commerce de tenis: Next.js 15 (App Router) + TypeScript + Tailwind CSS, con Supabase (datos, Storage y Auth del admin) y pagos con Wompi.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completa las variables
npm run dev                  # http://localhost:3000
```

Sin las variables de Supabase, el catálogo usa los datos de ejemplo de `src/data/catalog-seed.ts`.

## Base de datos y pagos

Las migraciones, el seed y la configuración de Wompi están en [`supabase/README.md`](supabase/README.md).

## Estructura

```
src/app/(shop)      tienda: home, catálogo, producto, checkout, confirmación, ayuda
src/app/admin       panel protegido (Supabase Auth, rol admin)
src/app/api         checkout, webhook de Wompi, estado de pedidos
src/components      UI por sección (home, catalog, product, cart, checkout, admin, motion)
src/lib             catálogo, filtros, pagos, pedidos, analítica, Supabase
supabase/           migraciones SQL y seed
public/brand        logo (versiones blanca, negra y original) e íconos
```

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run db:seed:generate` | Regenera `supabase/seed.sql` desde `src/data/catalog-seed.ts` |

## Variables de entorno

Ver `.env.example`. Las que no empiezan por `NEXT_PUBLIC_` son secretas y solo se usan en el servidor.
