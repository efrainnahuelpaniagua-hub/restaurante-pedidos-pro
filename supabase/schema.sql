create extension if not exists pgcrypto;

create schema if not exists app_private;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.restaurant_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  slogan text not null,
  logo_url text,
  hero_image_url text,
  phone text not null,
  whatsapp_number text not null,
  address text not null,
  map_url text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  opening_hours text not null,
  delivery_enabled boolean not null default true,
  pickup_enabled boolean not null default true,
  delivery_fee integer not null default 0,
  minimum_order_for_delivery integer not null default 0,
  primary_color text not null default '#e84c1f',
  secondary_color text not null default '#ffc247',
  save_orders_enabled boolean not null default true,
  allow_cash_payment boolean not null default true,
  allow_transfer_payment boolean not null default true,
  allow_card_on_delivery boolean not null default true,
  currency text not null default 'PYG',
  timezone text not null default 'America/Asuncion',
  is_open boolean not null default true,
  accepting_orders boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  icon text,
  display_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text not null,
  long_description text not null,
  base_price integer not null check (base_price >= 0),
  offer_price integer check (offer_price is null or offer_price >= 0),
  image_url text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_new boolean not null default false,
  is_promotion boolean not null default false,
  display_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price_modifier integer not null default 0,
  is_required boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.extras (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price integer not null check (price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.product_extras (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  extra_id uuid not null references public.extras(id) on delete cascade,
  unique (product_id, extra_id)
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text,
  promo_price integer not null check (promo_price >= 0),
  original_price integer check (original_price is null or original_price >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  linked_product_id uuid references public.products(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  fee integer not null default 0,
  minimum_order integer not null default 0,
  is_active boolean not null default true,
  display_order integer not null default 1
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  order_type text not null check (order_type in ('Delivery', 'Retiro')),
  address text,
  zone text,
  reference text,
  map_link text,
  payment_method text not null,
  cash_amount integer,
  order_schedule_type text not null,
  scheduled_for timestamptz,
  general_notes text,
  subtotal integer not null,
  delivery_fee integer not null default 0,
  total integer not null,
  status text not null default 'Nuevo' check (status in ('Nuevo', 'Preparando', 'En camino', 'Entregado', 'Cancelado')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null,
  selected_variant text,
  extras_snapshot jsonb not null default '[]'::jsonb,
  notes text,
  line_total integer not null
);

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.business_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null,
  image_url text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_categories_active_order on public.categories(is_active, display_order);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_public on public.products(is_available, is_featured, is_promotion, display_order);
create index if not exists idx_promotions_active on public.promotions(is_active, starts_at, ends_at);
create index if not exists idx_orders_status_created on public.orders(status, created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);

drop trigger if exists restaurant_settings_updated_at on public.restaurant_settings;
create trigger restaurant_settings_updated_at before update on public.restaurant_settings
for each row execute function public.set_updated_at();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

create or replace function app_private.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid()
    and role in ('admin', 'owner')
  );
$$;

grant usage on schema app_private to anon, authenticated;
grant execute on function app_private.is_admin() to anon, authenticated;

alter table public.restaurant_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.extras enable row level security;
alter table public.product_extras enable row level security;
alter table public.promotions enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.business_pages enable row level security;

create policy "public read settings" on public.restaurant_settings for select using (true);
create policy "admin manage settings" on public.restaurant_settings for all using (app_private.is_admin()) with check (app_private.is_admin());

create policy "public read active categories" on public.categories for select using (is_active = true or app_private.is_admin());
create policy "admin manage categories" on public.categories for all using (app_private.is_admin()) with check (app_private.is_admin());

create policy "public read available products" on public.products for select using (is_available = true or app_private.is_admin());
create policy "admin manage products" on public.products for all using (app_private.is_admin()) with check (app_private.is_admin());

create policy "public read variants" on public.product_variants for select using (
  exists (select 1 from public.products p where p.id = product_id and p.is_available = true) or app_private.is_admin()
);
create policy "admin manage variants" on public.product_variants for all using (app_private.is_admin()) with check (app_private.is_admin());

create policy "public read active extras" on public.extras for select using (is_active = true or app_private.is_admin());
create policy "admin manage extras" on public.extras for all using (app_private.is_admin()) with check (app_private.is_admin());

create policy "public read product extras" on public.product_extras for select using (true);
create policy "admin manage product extras" on public.product_extras for all using (app_private.is_admin()) with check (app_private.is_admin());

create policy "public read active promotions" on public.promotions for select using (is_active = true or app_private.is_admin());
create policy "admin manage promotions" on public.promotions for all using (app_private.is_admin()) with check (app_private.is_admin());

create policy "public read active zones" on public.delivery_zones for select using (is_active = true or app_private.is_admin());
create policy "admin manage zones" on public.delivery_zones for all using (app_private.is_admin()) with check (app_private.is_admin());

create policy "public insert valid orders" on public.orders for insert with check (
  customer_name is not null
  and length(customer_name) >= 3
  and customer_phone is not null
  and length(customer_phone) >= 6
  and order_type in ('Delivery', 'Retiro')
  and subtotal >= 0
  and delivery_fee >= 0
  and total >= subtotal
);
create policy "admin read orders" on public.orders for select using (app_private.is_admin());
create policy "admin update orders" on public.orders for update using (app_private.is_admin()) with check (app_private.is_admin());

create policy "public insert valid order items" on public.order_items for insert with check (
  order_id is not null
  and product_name_snapshot is not null
  and quantity > 0
  and unit_price >= 0
  and line_total >= 0
  and exists (select 1 from public.orders o where o.id = order_id)
);
create policy "admin read order items" on public.order_items for select using (app_private.is_admin());

create policy "admin read profiles" on public.admin_profiles for select using (app_private.is_admin() or user_id = auth.uid());
create policy "admin manage profiles" on public.admin_profiles for all using (app_private.is_admin()) with check (app_private.is_admin());

create policy "public read pages" on public.business_pages for select using (true);
create policy "admin manage pages" on public.business_pages for all using (app_private.is_admin()) with check (app_private.is_admin());

insert into public.restaurant_settings (
  id, business_name, slogan, hero_image_url, phone, whatsapp_number, address, map_url,
  instagram_url, facebook_url, tiktok_url, opening_hours, delivery_fee, minimum_order_for_delivery,
  primary_color, secondary_color
) values (
  '00000000-0000-4000-8000-000000000001', 'Sabor Express', 'Tu antojo, en camino',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=85',
  '+595 61 500 000', '595981123456', 'Av. San Blas, Ciudad del Este, Paraguay',
  'https://maps.google.com/?q=Ciudad+del+Este+Paraguay', 'https://instagram.com/', 'https://facebook.com/',
  'https://tiktok.com/', 'Lunes a domingo de 10:30 a 23:30', 10000, 30000, '#e84c1f', '#ffc247'
) on conflict (id) do nothing;

insert into public.categories (id, name, slug, description, icon, display_order) values
('10000000-0000-4000-8000-000000000001','Hamburguesas','hamburguesas','Carnes jugosas, panes suaves y salsas de la casa.','Burger',1),
('10000000-0000-4000-8000-000000000002','Pizzas','pizzas','Pizzas artesanales con bordes dorados.','Pizza',2),
('10000000-0000-4000-8000-000000000003','Lomitos','lomitos','Clasicos paraguayos bien cargados.','Sandwich',3),
('10000000-0000-4000-8000-000000000004','Combos','combos','Opciones para compartir y ahorrar.','BadgePercent',4),
('10000000-0000-4000-8000-000000000005','Bebidas','bebidas','Gaseosas, aguas y bebidas frias.','CupSoda',5),
('10000000-0000-4000-8000-000000000006','Postres','postres','Dulces finales para completar el pedido.','IceCream',6),
('10000000-0000-4000-8000-000000000007','Promociones','promociones','Ofertas activas por tiempo limitado.','Sparkles',7)
on conflict (id) do nothing;

insert into public.extras (id, name, price) values
('20000000-0000-4000-8000-000000000001','Queso extra',5000),
('20000000-0000-4000-8000-000000000002','Huevo',4000),
('20000000-0000-4000-8000-000000000003','Bacon',7000),
('20000000-0000-4000-8000-000000000004','Salsa extra',3000),
('20000000-0000-4000-8000-000000000005','Papas adicionales',10000)
on conflict (id) do nothing;

insert into public.products (id, category_id, name, slug, short_description, long_description, base_price, offer_price, image_url, is_featured, is_best_seller, is_new, is_promotion, display_order) values
('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Hamburguesa Clasica','hamburguesa-clasica','Carne smash, queso, lechuga, tomate y salsa express.','Carne grillada, pan brioche, vegetales frescos y salsa especial.',35000,null,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',true,true,false,false,1),
('30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','Hamburguesa Doble Bacon','hamburguesa-doble-bacon','Doble carne, cheddar, bacon crocante y salsa ahumada.','Doble medallon con cheddar, bacon crocante, cebolla caramelizada y salsa ahumada.',52000,47000,'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=85',true,true,false,true,2),
('30000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002','Pizza Muzarella','pizza-muzarella','Masa artesanal, salsa de tomate y mucha muzarella.','Pizza clasica con masa fermentada, salsa casera, oregano y muzarella.',65000,null,'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=85',true,false,false,false,3),
('30000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000002','Pizza Pepperoni','pizza-pepperoni','Pepperoni, queso fundido y borde dorado.','Pizza intensa con pepperoni, salsa especiada y queso fundido.',78000,null,'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=85',false,true,true,false,4),
('30000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000003','Lomito Arabe','lomito-arabe','Pan arabe, carne, vegetales, queso y salsa de ajo.','Lomito envuelto en pan arabe con carne tierna, vegetales, queso y salsa de ajo.',42000,null,'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85',false,true,false,false,5),
('30000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000003','Lomito Completo','lomito-completo','Carne, jamon, queso, huevo, ensalada y papas.','Clasico completo con carne grillada, jamon, queso, huevo, vegetales y papas.',48000,null,'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85',false,false,false,false,6),
('30000000-0000-4000-8000-000000000007','10000000-0000-4000-8000-000000000004','Combo Familiar','combo-familiar','2 hamburguesas, pizza muzza, papas grandes y bebida.','Combo para compartir con dos hamburguesas, pizza, papas y bebida.',155000,139000,'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=85',true,false,false,true,7),
('30000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000004','Combo Pareja','combo-pareja','2 lomitos completos, papas medianas y 2 bebidas.','Ideal para dos con lomitos completos, papas medianas y bebidas.',98000,89000,'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=85',false,false,false,true,8),
('30000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000005','Coca-Cola 500 ml','coca-cola-500-ml','Bien fria.','Coca-Cola 500 ml servida fria.',8000,null,'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=85',false,false,false,false,9),
('30000000-0000-4000-8000-000000000010','10000000-0000-4000-8000-000000000005','Agua mineral','agua-mineral','Botella 500 ml.','Agua mineral sin gas en botella de 500 ml.',6000,null,'https://images.unsplash.com/photo-1616118132534-381148898bb4?auto=format&fit=crop&w=900&q=85',false,false,false,false,10),
('30000000-0000-4000-8000-000000000011','10000000-0000-4000-8000-000000000006','Brownie con helado','brownie-con-helado','Brownie tibio con bocha de helado.','Brownie humedo de chocolate servido tibio con helado.',28000,null,'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85',true,false,true,false,11),
('30000000-0000-4000-8000-000000000012','10000000-0000-4000-8000-000000000006','Cheesecake','cheesecake','Porcion cremosa con salsa de frutos rojos.','Cheesecake suave con base crocante y salsa de frutos rojos.',26000,null,'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85',false,false,false,false,12)
on conflict (id) do nothing;

insert into public.product_variants (product_id, name, price_modifier, is_required)
select id, 'Mediano', 0, false from public.products
on conflict do nothing;

insert into public.product_variants (product_id, name, price_modifier, is_required)
select id, 'Grande', 12000, false from public.products
on conflict do nothing;

insert into public.product_extras (product_id, extra_id)
select p.id, e.id from public.products p cross join public.extras e
on conflict do nothing;

insert into public.promotions (title, description, image_url, promo_price, original_price, linked_product_id) values
('Combo Familiar Express','Ahorra con una seleccion completa para compartir en casa.','https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=85',139000,155000,'30000000-0000-4000-8000-000000000007'),
('Doble Bacon en oferta','La favorita de la casa con precio especial por tiempo limitado.','https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=85',47000,52000,'30000000-0000-4000-8000-000000000002')
on conflict do nothing;

insert into public.delivery_zones (name, fee, minimum_order, display_order) values
('Centro',8000,25000,1),
('Area 1',10000,30000,2),
('Km 4',12000,35000,3),
('Presidente Franco',18000,50000,4)
on conflict do nothing;

insert into storage.buckets (id, name, public) values
('product-images', 'product-images', true),
('restaurant-assets', 'restaurant-assets', true),
('promotion-images', 'promotion-images', true)
on conflict (id) do nothing;

create policy "public read restaurant images" on storage.objects for select using (
  bucket_id in ('product-images', 'restaurant-assets', 'promotion-images')
);

create policy "admin insert restaurant images" on storage.objects for insert with check (
  bucket_id in ('product-images', 'restaurant-assets', 'promotion-images') and app_private.is_admin()
);

create policy "admin update restaurant images" on storage.objects for update using (
  bucket_id in ('product-images', 'restaurant-assets', 'promotion-images') and app_private.is_admin()
) with check (
  bucket_id in ('product-images', 'restaurant-assets', 'promotion-images') and app_private.is_admin()
);

create policy "admin delete restaurant images" on storage.objects for delete using (
  bucket_id in ('product-images', 'restaurant-assets', 'promotion-images') and app_private.is_admin()
);
