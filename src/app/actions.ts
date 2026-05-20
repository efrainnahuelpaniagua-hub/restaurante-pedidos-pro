"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CartItem, OrderItem, OrderStatus } from "@/lib/types";
import { checkoutSchema, type CheckoutValues } from "@/lib/validators/order";
import { categorySchema, extraSchema, productSchema, promotionSchema, settingsSchema, zoneSchema } from "@/lib/validators/admin";
import { absoluteUrl } from "@/lib/utils";

async function requireSupabase() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase no esta configurado. Completa las variables de entorno.");
  return supabase;
}

export async function signInAdmin(formData: FormData) {
  const supabase = await requireSupabase();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error("Credenciales invalidas o usuario sin acceso.");
  redirect("/admin/dashboard");
}

export async function signOutAdmin() {
  const supabase = await requireSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createOrder(values: CheckoutValues, items: CartItem[], deliveryFee: number) {
  const parsed = checkoutSchema.parse(values);
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: true, orderId: null };

  const scheduledFor =
    parsed.order_schedule_type === "Programado" && parsed.scheduled_date && parsed.scheduled_time
      ? new Date(`${parsed.scheduled_date}T${parsed.scheduled_time}`).toISOString()
      : null;
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal + deliveryFee;
  const orderId = crypto.randomUUID();
  const trackingCode = crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();

  const { error } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      tracking_code: trackingCode,
      customer_name: parsed.customer_name,
      customer_phone: parsed.customer_phone,
      order_type: parsed.order_type,
      address: parsed.address || null,
      zone: parsed.zone || null,
      reference: parsed.reference || null,
      map_link: parsed.map_link || null,
      payment_method: parsed.payment_method,
      cash_amount: parsed.cash_amount || null,
      order_schedule_type: parsed.order_schedule_type,
      scheduled_for: scheduledFor,
      general_notes: parsed.general_notes || null,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      status: "Recibido",
    });

  if (error) throw new Error(error.message || "No se pudo guardar el pedido.");

  const orderItems: OrderItem[] = items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    product_name_snapshot: item.name,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    selected_variant: item.variant?.name ?? null,
    extras_snapshot: item.extras,
    notes: item.notes || null,
    line_total: item.unitPrice * item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw new Error(itemsError.message);
  revalidatePath("/admin/pedidos");
  return { ok: true, orderId, trackingCode, trackingUrl: absoluteUrl(`/pedido/${trackingCode}`) };
}

function cleanEmpty<T extends Record<string, unknown>>(input: T) {
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, value === "" ? null : value]));
}

export async function saveCategory(formData: FormData) {
  const supabase = await requireSupabase();
  const parsed = categorySchema.parse(Object.fromEntries(formData));
  const id = parsed.id;
  const payload = cleanEmpty({ ...parsed });
  delete payload.id;
  const query = id ? supabase.from("categories").update(payload).eq("id", id) : supabase.from("categories").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/admin/categorias");
  revalidatePath("/menu");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const supabase = await requireSupabase();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categorias");
}

export async function saveExtra(formData: FormData) {
  const supabase = await requireSupabase();
  const parsed = extraSchema.parse(Object.fromEntries(formData));
  const id = parsed.id;
  const payload = cleanEmpty({ ...parsed });
  delete payload.id;
  const query = id ? supabase.from("extras").update(payload).eq("id", id) : supabase.from("extras").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/admin/extras");
  return { ok: true };
}

export async function deleteExtra(id: string) {
  const supabase = await requireSupabase();
  const { error } = await supabase.from("extras").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/extras");
}

export async function saveProduct(formData: FormData) {
  const supabase = await requireSupabase();
  const parsed = productSchema.parse(Object.fromEntries(formData));
  const id = parsed.id;
  const payload = cleanEmpty({ ...parsed, offer_price: parsed.offer_price || null });
  delete payload.id;
  const query = id ? supabase.from("products").update(payload).eq("id", id) : supabase.from("products").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/admin/productos");
  revalidatePath("/menu");
  return { ok: true };
}

export async function deleteProduct(id: string) {
  const supabase = await requireSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/productos");
  revalidatePath("/menu");
}

export async function savePromotion(formData: FormData) {
  const supabase = await requireSupabase();
  const parsed = promotionSchema.parse(Object.fromEntries(formData));
  const id = parsed.id;
  const payload = cleanEmpty({ ...parsed, original_price: parsed.original_price || null, linked_product_id: parsed.linked_product_id || null });
  delete payload.id;
  const query = id ? supabase.from("promotions").update(payload).eq("id", id) : supabase.from("promotions").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/admin/promociones");
  return { ok: true };
}

export async function deletePromotion(id: string) {
  const supabase = await requireSupabase();
  const { error } = await supabase.from("promotions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/promociones");
}

export async function saveZone(formData: FormData) {
  const supabase = await requireSupabase();
  const parsed = zoneSchema.parse(Object.fromEntries(formData));
  const id = parsed.id;
  const payload = cleanEmpty({ ...parsed });
  delete payload.id;
  const query = id ? supabase.from("delivery_zones").update(payload).eq("id", id) : supabase.from("delivery_zones").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/admin/zonas-delivery");
  return { ok: true };
}

export async function saveSettings(formData: FormData) {
  const supabase = await requireSupabase();
  const parsed = settingsSchema.parse(Object.fromEntries(formData));
  const payload = cleanEmpty({ ...parsed, currency: "PYG", timezone: "America/Asuncion" });
  const { error } = await supabase.from("restaurant_settings").upsert(payload);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/configuracion");
  return { ok: true };
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await requireSupabase();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin/dashboard");
}

export async function cancelPublicOrder(trackingCode: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase no esta configurado.", status: null };

  const { data, error } = await supabase.rpc("cancel_public_order", {
    p_tracking_code: trackingCode,
  });

  if (error) return { ok: false, message: error.message, status: null };
  const result = Array.isArray(data) ? data[0] : data;
  revalidatePath(`/pedido/${trackingCode}`);
  revalidatePath("/admin/pedidos");
  return {
    ok: Boolean(result?.ok),
    message: String(result?.message || "No se pudo cancelar el pedido."),
    status: result?.status ? String(result.status) : null,
  };
}
