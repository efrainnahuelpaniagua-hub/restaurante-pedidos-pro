import type { CartItem, RestaurantSettings } from "./types";
import type { CheckoutValues } from "./validators/order";
import { formatGs } from "./utils";

export function buildWhatsAppMessage({
  values,
  items,
  settings,
  deliveryFee,
  trackingCode,
  trackingUrl,
}: {
  values: CheckoutValues;
  items: CartItem[];
  settings: RestaurantSettings;
  deliveryFee: number;
  trackingCode?: string | null;
  trackingUrl?: string | null;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal + deliveryFee;
  const scheduled =
    values.order_schedule_type === "Programado"
      ? `${values.scheduled_date || ""} ${values.scheduled_time || ""}`.trim()
      : "Lo antes posible";

  const lines = items.map((item, index) => {
    const extras = item.extras.length ? `\n   Extras: ${item.extras.map((extra) => extra.name).join(", ")}` : "";
    const variant = item.variant ? `\n   Variante: ${item.variant.name}` : "";
    const notes = item.notes ? `\n   Obs.: ${item.notes}` : "";
    return `${index + 1}. ${item.quantity}x ${item.name} - ${formatGs(item.unitPrice * item.quantity)}${variant}${extras}${notes}`;
  });

  return [
    "Hola, quiero realizar un pedido:",
    trackingCode ? `Codigo: ${trackingCode}` : "",
    trackingUrl ? `Detalle: ${trackingUrl}` : "",
    "",
    `Cliente: ${values.customer_name}`,
    `Telefono: ${values.customer_phone}`,
    `Tipo de pedido: ${values.order_type}`,
    values.order_type === "Delivery" ? `Direccion: ${values.address}` : "",
    values.order_type === "Delivery" ? `Zona/Barrio: ${values.zone}` : "",
    values.order_type === "Delivery" && values.reference ? `Referencia: ${values.reference}` : "",
    values.order_type === "Delivery" && values.map_link ? `Ubicacion: ${values.map_link}` : "",
    "",
    "Pedido:",
    ...lines,
    "",
    `Subtotal: ${formatGs(subtotal)}`,
    `Delivery: ${formatGs(deliveryFee)}`,
    `Total: ${formatGs(total)}`,
    "",
    `Metodo de pago: ${values.payment_method}`,
    values.payment_method === "Efectivo" ? `Pago con: ${formatGs(values.cash_amount || 0)}` : "",
    "",
    `Horario: ${scheduled}`,
    "",
    "Observacion general:",
    values.general_notes || "Sin observaciones",
    "",
    `Gracias. ${settings.business_name}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function buildWhatsAppUrl(number: string, message: string) {
  const cleanNumber = number.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
