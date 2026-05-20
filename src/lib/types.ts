export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type RestaurantSettings = {
  id: string;
  business_name: string;
  slogan: string;
  logo_url: string | null;
  hero_image_url: string | null;
  phone: string;
  whatsapp_number: string;
  address: string;
  map_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  opening_hours: string;
  delivery_enabled: boolean;
  pickup_enabled: boolean;
  delivery_fee: number;
  minimum_order_for_delivery: number;
  primary_color: string;
  secondary_color: string;
  save_orders_enabled: boolean;
  allow_cash_payment: boolean;
  allow_transfer_payment: boolean;
  allow_card_on_delivery: boolean;
  currency: string;
  timezone: string;
  is_open: boolean;
  accepting_orders: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
};

export type Extra = {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
  created_at?: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  price_modifier: number;
  is_required: boolean;
  created_at?: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  base_price: number;
  offer_price: number | null;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  is_promotion: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  categories?: Category | null;
  product_variants?: ProductVariant[];
  product_extras?: { extras: Extra | null }[];
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  promo_price: number;
  original_price: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  linked_product_id: string | null;
  created_at?: string;
};

export type DeliveryZone = {
  id: string;
  name: string;
  fee: number;
  minimum_order: number;
  is_active: boolean;
  display_order: number;
};

export type OrderStatus = "Nuevo" | "Preparando" | "En camino" | "Entregado" | "Cancelado";

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: "Delivery" | "Retiro";
  address: string | null;
  zone: string | null;
  reference: string | null;
  map_link: string | null;
  payment_method: string;
  cash_amount: number | null;
  order_schedule_type: "Lo antes posible" | "Programado";
  scheduled_for: string | null;
  general_notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at?: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id?: string;
  order_id?: string;
  product_id: string | null;
  product_name_snapshot: string;
  quantity: number;
  unit_price: number;
  selected_variant: string | null;
  extras_snapshot: Json;
  notes: string | null;
  line_total: number;
};

export type CartExtra = Pick<Extra, "id" | "name" | "price">;

export type CartItem = {
  cartId: string;
  productId: string;
  name: string;
  imageUrl: string | null;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  variant: { id: string; name: string; price_modifier: number } | null;
  extras: CartExtra[];
  notes: string;
};

export type PublicData = {
  settings: RestaurantSettings;
  categories: Category[];
  products: Product[];
  promotions: Promotion[];
  zones: DeliveryZone[];
};
