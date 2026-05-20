import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  icon: z.string().optional(),
  display_order: z.coerce.number().default(1),
  is_active: z.coerce.boolean().default(true),
});

export const extraSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  is_active: z.coerce.boolean().default(true),
});

export const productSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2),
  short_description: z.string().min(4),
  long_description: z.string().min(4),
  base_price: z.coerce.number().min(0),
  offer_price: z.coerce.number().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  is_available: z.coerce.boolean().default(true),
  is_featured: z.coerce.boolean().default(false),
  is_best_seller: z.coerce.boolean().default(false),
  is_new: z.coerce.boolean().default(false),
  is_promotion: z.coerce.boolean().default(false),
  display_order: z.coerce.number().default(1),
});

export const promotionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  description: z.string().min(4),
  image_url: z.string().url().optional().or(z.literal("")),
  promo_price: z.coerce.number().min(0),
  original_price: z.coerce.number().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  is_active: z.coerce.boolean().default(true),
  linked_product_id: z.string().optional(),
});

export const zoneSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  fee: z.coerce.number().min(0),
  minimum_order: z.coerce.number().min(0),
  is_active: z.coerce.boolean().default(true),
  display_order: z.coerce.number().default(1),
});

export const settingsSchema = z.object({
  id: z.string(),
  business_name: z.string().min(2),
  slogan: z.string().min(2),
  logo_url: z.string().url().optional().or(z.literal("")),
  hero_image_url: z.string().url().optional().or(z.literal("")),
  phone: z.string().min(3),
  whatsapp_number: z.string().min(6),
  address: z.string().min(3),
  map_url: z.string().url().optional().or(z.literal("")),
  instagram_url: z.string().url().optional().or(z.literal("")),
  facebook_url: z.string().url().optional().or(z.literal("")),
  tiktok_url: z.string().url().optional().or(z.literal("")),
  opening_hours: z.string().min(3),
  delivery_enabled: z.coerce.boolean().default(true),
  pickup_enabled: z.coerce.boolean().default(true),
  delivery_fee: z.coerce.number().min(0),
  minimum_order_for_delivery: z.coerce.number().min(0),
  primary_color: z.string().min(4),
  secondary_color: z.string().min(4),
  save_orders_enabled: z.coerce.boolean().default(true),
  allow_cash_payment: z.coerce.boolean().default(true),
  allow_transfer_payment: z.coerce.boolean().default(true),
  allow_card_on_delivery: z.coerce.boolean().default(true),
  is_open: z.coerce.boolean().default(true),
  accepting_orders: z.coerce.boolean().default(true),
});
