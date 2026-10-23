# Supabase

## Montar la base de datos

1. Crea un proyecto en [supabase.com](https://supabase.com) (región recomendada: `us-east-1` o `sa-east-1`).
2. En **SQL Editor**, ejecuta en orden:
   1. `migrations/0001_schema.sql`: tablas, RLS y bucket `products`.
   2. `migrations/0002_checkout.sql`: funciones de pedido y pago (`create_order`, `confirm_order_payment`, `mark_order_failed`).
   3. `migrations/0003_admin.sql`: guardado atómico de productos y cambios de estado del panel (`admin_save_product`, `admin_set_order_status`).
   4. `migrations/0004_best_seller.sql`: etiqueta "Más vendido" en productos.
   5. `migrations/0005_community.sql`: fotos de clientes ("El estilo de otras personas").
   6. `migrations/0006_community_submissions.sql`: los clientes suben su foto desde la web y queda pendiente (bucket privado `community-pending`) hasta que el admin la acepta o rechaza en **Comunidad**.
   7. `seed.sql`: 6 colecciones, 87 productos con tallas y stock y 4 fotos de comunidad de ejemplo (va al final porque usa las tablas de las migraciones).
3. Copia las credenciales (**Project Settings → API**) a `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # solo servidor, nunca con NEXT_PUBLIC_
   ```

4. Reinicia `npm run dev`. Sin estas variables, el catálogo usa los mismos datos del seed en local.

## Pagos con Wompi

1. En el [panel de Wompi](https://comercios.wompi.co), modo **Sandbox**, sección **Desarrolladores**, copia:

   ```env
   NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_...
   WOMPI_INTEGRITY_SECRET=test_integrity_...
   WOMPI_EVENTS_SECRET=test_events_...
   N8N_ORDER_WEBHOOK_URL=https://...   # opcional: se llama al confirmarse cada pago
   ```

2. En **URL de eventos** pon `https://<tu-dominio>/api/webhooks/wompi`. En local, expón el puerto con un túnel (ngrok o cloudflared).
3. Aunque el webhook no llegue, la página de confirmación consulta la transacción a Wompi y concilia el pedido.
4. Tarjeta de prueba aprobada: `4242 4242 4242 4242`; rechazada: `4111 1111 1111 1111`, con cualquier CVC y fecha futura.

Flujo: `/checkout` → `POST /api/checkout` (crea el pedido `pendiente` y firma) → widget de Wompi → `/confirmacion/<referencia>`. El evento `transaction.updated` marca el pedido `pagado` y descuenta el stock en una sola transacción.

## Crear un admin

Un usuario es admin si `app_metadata.role = 'admin'`. Después de crearlo en **Authentication → Users**:

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
where email = 'tu@correo.com';
```

## Regenerar el seed

Los productos de ejemplo viven en `src/data/catalog-seed.ts`. Después de editarlos:

```bash
npm run db:seed:generate
```
