# RestaurantePedidosPro

Aplicacion comercial para restaurantes y negocios gastronomicos: menu digital, carrito persistente, checkout validado, envio automatico a WhatsApp, guardado de pedidos en Supabase y panel administrativo.

Demo incluida: **Sabor Express**, Ciudad del Este, Paraguay.

## Funcionalidades

- Sitio publico responsive con inicio, menu, nosotros y contacto.
- Menu digital con busqueda, categorias, ordenamiento y productos destacados.
- Detalle de producto con extras, variantes, cantidad y observaciones.
- Carrito persistente con Zustand.
- Checkout con React Hook Form + Zod.
- Mensaje de WhatsApp codificado con cliente, direccion, productos, extras, totales, pago y horario.
- Panel admin protegido con Supabase Auth.
- Dashboard, productos, categorias, extras, promociones, pedidos, configuracion, zonas de delivery y QR.
- SQL completo con tablas, indices, RLS, Storage policies y seed demo.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL, Auth y Storage
- Zustand
- React Hook Form
- Zod
- Lucide Icons
- Sonner
- qrcode.react

## Instalacion

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Variables de entorno

Crear `.env.local` basado en `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

La app funciona con datos demo si Supabase no esta configurado. Para produccion, completar las variables publicas de Supabase. `SUPABASE_SERVICE_ROLE_KEY` queda reservado para tareas servidor futuras y no se usa en el cliente.

## Configuracion Supabase

1. Crear un proyecto en Supabase.
2. Ir a SQL Editor.
3. Ejecutar `supabase/schema.sql`.
4. Verificar que existan los buckets:
   - `product-images`
   - `restaurant-assets`
   - `promotion-images`
5. Copiar `Project URL` y `anon public key` a `.env.local`.

## Crear usuario admin

1. En Supabase, ir a Authentication > Users.
2. Crear un usuario con email y contrasena.
3. Copiar el `User UID`.
4. Ejecutar:

```sql
insert into public.admin_profiles (user_id, full_name, role)
values ('USER_UID_AQUI', 'Administrador', 'admin');
```

5. Entrar en `/admin/login`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Estructura

```text
src/app               Rutas App Router publicas y admin
src/components/public Componentes del sitio publico
src/components/admin  Componentes del panel administrativo
src/components/ui     Botones, campos y badges reutilizables
src/lib               Datos, tipos, utilidades, Supabase, validators y store
supabase/schema.sql   Migracion, RLS, Storage policies y seed demo
```

## Despliegue en Vercel

1. Subir el repositorio a GitHub.
2. Importarlo en Vercel.
3. Configurar variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Ejecutar el SQL en Supabase antes de abrir el admin.
5. Desplegar.

## Personalizacion comercial

Desde `/admin/configuracion` se puede cambiar nombre, slogan, WhatsApp, telefono, direccion, mapa, redes, horarios, delivery, retiro, metodos de pago, colores, logo y portada. Los productos, categorias, extras, promociones y zonas se gestionan desde sus secciones admin.
