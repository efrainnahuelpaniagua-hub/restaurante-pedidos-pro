"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { createOrder } from "@/app/actions";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/order-message";
import { getCartTotals, useCartStore } from "@/lib/stores/cart-store";
import type { DeliveryZone, RestaurantSettings } from "@/lib/types";
import { checkoutSchema, type CheckoutValues } from "@/lib/validators/order";
import { Button } from "../ui/button";
import { Input, Label, Select, Textarea } from "../ui/field";
import { CartSummary } from "./cart-summary";

export function CheckoutForm({ settings, zones }: { settings: RestaurantSettings; zones: DeliveryZone[] }) {
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const [sending, setSending] = useState(false);
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema) as Resolver<CheckoutValues>,
    defaultValues: {
      order_type: "Delivery",
      payment_method: "Efectivo",
      order_schedule_type: "Lo antes posible",
    },
  });
  const orderType = useWatch({ control: form.control, name: "order_type" });
  const paymentMethod = useWatch({ control: form.control, name: "payment_method" });
  const scheduleType = useWatch({ control: form.control, name: "order_schedule_type" });
  const selectedZone = useWatch({ control: form.control, name: "zone" });
  const zone = zones.find((item) => item.name === selectedZone);
  const deliveryFee = orderType === "Delivery" ? zone?.fee ?? settings.delivery_fee : 0;
  const totals = useMemo(() => getCartTotals(items, deliveryFee), [items, deliveryFee]);

  async function onSubmit(values: CheckoutValues) {
    if (!items.length) {
      toast.error("Agrega productos antes de enviar el pedido.");
      return;
    }
    setSending(true);
    try {
      if (settings.save_orders_enabled) {
        await createOrder(values, items, deliveryFee);
      }
      const message = buildWhatsAppMessage({ values, items, settings, deliveryFee });
      window.open(buildWhatsAppUrl(settings.whatsapp_number, message), "_blank", "noopener,noreferrer");
      toast.success("Pedido preparado para WhatsApp");
      clear();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo enviar el pedido");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_420px]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 rounded-3xl border border-border bg-white p-5 soft-shadow">
        <div>
          <h1 className="text-3xl font-black">Finalizar pedido</h1>
          <p className="mt-2 text-sm text-muted-foreground">Validamos tus datos y generamos un mensaje ordenado para WhatsApp.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Label>Nombre completo<Input {...form.register("customer_name")} /></Label>
          <Label>Telefono<Input {...form.register("customer_phone")} /></Label>
        </div>
        <Errors errors={form.formState.errors} />

        <div className="grid gap-4 md:grid-cols-2">
          <Label>Tipo de pedido
            <Select {...form.register("order_type")}>
              {settings.delivery_enabled && <option value="Delivery">Delivery</option>}
              {settings.pickup_enabled && <option value="Retiro">Retiro en local</option>}
            </Select>
          </Label>
          <Label>Metodo de pago
            <Select {...form.register("payment_method")}>
              {settings.allow_cash_payment && <option value="Efectivo">Efectivo</option>}
              {settings.allow_transfer_payment && <option value="Transferencia">Transferencia</option>}
              {settings.allow_card_on_delivery && <option value="Tarjeta al recibir">Tarjeta al recibir</option>}
            </Select>
          </Label>
        </div>

        {orderType === "Delivery" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Label>Direccion<Input {...form.register("address")} /></Label>
            <Label>Barrio o zona
              <Select {...form.register("zone")}>
                <option value="">Seleccionar zona</option>
                {zones.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
              </Select>
            </Label>
            <Label>Referencia<Input {...form.register("reference")} /></Label>
            <Label>Link de ubicacion Google Maps<Input {...form.register("map_link")} /></Label>
          </div>
        ) : (
          <div className="rounded-2xl bg-muted p-4 text-sm font-semibold">Te avisaremos cuando tu pedido este listo para retirar.</div>
        )}

        {paymentMethod === "Efectivo" && <Label>Con cuanto va a pagar<Input type="number" {...form.register("cash_amount")} /></Label>}

        <div className="grid gap-4 md:grid-cols-3">
          <Label>Horario
            <Select {...form.register("order_schedule_type")}>
              <option value="Lo antes posible">Lo antes posible</option>
              <option value="Programado">Programar pedido</option>
            </Select>
          </Label>
          {scheduleType === "Programado" && (
            <>
              <Label>Fecha<Input type="date" {...form.register("scheduled_date")} /></Label>
              <Label>Hora<Input type="time" {...form.register("scheduled_time")} /></Label>
            </>
          )}
        </div>

        <Label>Observaciones generales<Textarea {...form.register("general_notes")} /></Label>

        <div className="rounded-2xl bg-background p-4 text-sm">
          <strong>Total del pedido:</strong> {new Intl.NumberFormat("es-PY").format(totals.total)} Gs.
        </div>

        <Button disabled={sending || !settings.accepting_orders}>
          <Send size={18} /> Enviar pedido por WhatsApp
        </Button>
      </form>
      <CartSummary deliveryFee={deliveryFee} compact />
    </section>
  );
}

function Errors({ errors }: { errors: Record<string, { message?: string } | undefined> }) {
  const messages = Object.values(errors).map((error) => error?.message).filter(Boolean);
  if (!messages.length) return null;
  return <div className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-danger">{messages.join(" · ")}</div>;
}
