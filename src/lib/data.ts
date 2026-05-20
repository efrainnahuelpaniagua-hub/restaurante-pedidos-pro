import { demoExtras, demoPublicData } from "./demo-data";
import type { Category, DeliveryZone, Extra, Order, Product, Promotion, PublicData, RestaurantSettings } from "./types";
import { createSupabaseServerClient } from "./supabase/server";

export async function getPublicData(): Promise<PublicData> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoPublicData;

  const [settingsResult, categoriesResult, productsResult, promotionsResult, zonesResult] = await Promise.all([
    supabase.from("restaurant_settings").select("*").limit(1).maybeSingle(),
    supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
    supabase
      .from("products")
      .select("*, categories(*), product_variants(*), product_extras(extras(*))")
      .eq("is_available", true)
      .order("display_order"),
    supabase.from("promotions").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("delivery_zones").select("*").eq("is_active", true).order("display_order"),
  ]);

  return {
    settings: (settingsResult.data as RestaurantSettings | null) ?? demoPublicData.settings,
    categories: (categoriesResult.data as Category[] | null) ?? demoPublicData.categories,
    products: (productsResult.data as Product[] | null) ?? demoPublicData.products,
    promotions: (promotionsResult.data as Promotion[] | null) ?? demoPublicData.promotions,
    zones: (zonesResult.data as DeliveryZone[] | null) ?? demoPublicData.zones,
  };
}

export async function getSettings() {
  const { settings } = await getPublicData();
  return settings;
}

export async function getAdminData() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ...demoPublicData,
      extras: demoExtras,
      orders: [] as Order[],
      isDemo: true,
    };
  }

  const [settings, categories, products, extras, promotions, zones, orders] = await Promise.all([
    supabase.from("restaurant_settings").select("*").limit(1).maybeSingle(),
    supabase.from("categories").select("*").order("display_order"),
    supabase.from("products").select("*, categories(*), product_variants(*), product_extras(extras(*))").order("display_order"),
    supabase.from("extras").select("*").order("created_at", { ascending: false }),
    supabase.from("promotions").select("*").order("created_at", { ascending: false }),
    supabase.from("delivery_zones").select("*").order("display_order"),
    supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
  ]);

  return {
    settings: (settings.data as RestaurantSettings | null) ?? demoPublicData.settings,
    categories: (categories.data as Category[] | null) ?? demoPublicData.categories,
    products: (products.data as Product[] | null) ?? demoPublicData.products,
    extras: (extras.data as Extra[] | null) ?? demoExtras,
    promotions: (promotions.data as Promotion[] | null) ?? demoPublicData.promotions,
    zones: (zones.data as DeliveryZone[] | null) ?? demoPublicData.zones,
    orders: (orders.data as Order[] | null) ?? [],
    isDemo: false,
  };
}
