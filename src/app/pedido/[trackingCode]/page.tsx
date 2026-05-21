import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, CookingPot, PackageCheck, Store, Truck, XCircle } from "lucide-react";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { OrderActions } from "@/components/public/order-actions";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { getPublicData, getPublicOrderDetails } from "@/lib/data";
import { getVisibleOrderFlow, normalizeOrderStatus } from "@/lib/order-status";
import type { Json, OrderItem } from "@/lib/types";
import { formatGs } from "@/lib/utils";

type PageProps = {
  params: Promise<{ trackingCode: string }>;
};

export const metadata: Metadata = {
  title: "Detalle del pedido",
  description: "Consulta el estado y detalle de tu pedido.",
};

export default async function PedidoDetallePage({ params }: PageProps) {
  const { trackingCode } = await params;
  const [{ settings }, order] = await Promise.all([
    getPublicData(),
    getPublicOrderDetails(trackingCode),
  ]);

  if (!order) notFound();

  const normalizedStatus = normalizeOrderStatus(order.status);
  const statusSteps = getVisibleOrderFlow(order.order_type).map((status) => ({
    status,
    label: status,
    icon: status === "Recibido" ? Clock : status === "Preparando" ? CookingPot : status === "En camino" ? Truck : status === "Listo" ? Store : PackageCheck,
  }));
  const currentIndex = statusSteps.findIndex((step) => step.status === normalizedStatus);
  const isCancelled = order.status === "Cancelado";

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="container-page grid gap-6 py-6 sm:gap-8 sm:py-10">
        <section className="rounded-3xl border border-border bg-white p-4 soft-shadow sm:p-5 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-black uppercase text-primary">Detalle del pedido</p>
              <h1 className="mt-2 break-all text-2xl font-black sm:text-3xl">Pedido #{order.tracking_code}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Cliente: {order.customer_name} · {new Date(order.created_at || "").toLocaleString("es-PY")}
              </p>
            </div>
            <Badge className={isCancelled ? "bg-danger text-white" : "bg-primary text-white"}>{normalizedStatus}</Badge>
          </div>

          {isCancelled ? (
            <div className="mt-8 rounded-2xl bg-red-50 p-5 text-danger">
              <XCircle />
              <p className="mt-2 font-black">Este pedido fue cancelado.</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const active = currentIndex >= index;
                return (
                  <div
                    key={step.status}
                    className={`rounded-2xl border p-3 sm:p-4 ${
                      active ? "border-primary bg-orange-50 text-primary" : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {active ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                    <p className="mt-3 font-black">{step.label}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 rounded-3xl border border-border bg-white p-4 soft-shadow sm:p-5">
            <h2 className="text-xl font-black sm:text-2xl">Productos</h2>
            <div className="mt-5 grid gap-3">
              {order.items.map((item) => (
                <OrderItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          <aside className="grid gap-4 rounded-3xl border border-border bg-white p-4 soft-shadow sm:p-5">
            <h2 className="text-xl font-black sm:text-2xl">Resumen</h2>
            <div className="grid gap-2 text-sm">
              <Row label="Tipo" value={order.order_type} />
              <Row label="Telefono" value={order.customer_phone} />
              {order.order_type === "Delivery" ? (
                <>
                  <Row label="Direccion" value={order.address || "-"} />
                  <Row label="Zona" value={order.zone || "-"} />
                  <Row label="Referencia" value={order.reference || "-"} />
                </>
              ) : (
                <p className="rounded-xl bg-muted p-3 font-semibold">Retiro en local. Te avisaremos cuando este listo.</p>
              )}
              <Row label="Pago" value={order.payment_method} />
              {order.cash_amount ? <Row label="Paga con" value={formatGs(order.cash_amount)} /> : null}
              <Row label="Horario" value={order.scheduled_for ? new Date(order.scheduled_for).toLocaleString("es-PY") : order.order_schedule_type} />
            </div>
            <div className="grid gap-2 border-t border-border pt-4 text-sm">
              <Row label="Subtotal" value={formatGs(order.subtotal)} strong />
              <Row label="Delivery" value={formatGs(order.delivery_fee)} strong />
              <div className="flex justify-between gap-3 text-xl">
                <span className="font-black">Total</span>
                <strong className="whitespace-nowrap text-primary">{formatGs(order.total)}</strong>
              </div>
            </div>
            <OrderActions order={{ ...order, status: normalizedStatus }} settings={settings} />
            <LinkButton href="/menu" variant="outline">Hacer otro pedido</LinkButton>
          </aside>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}

function OrderItemRow({ item }: { item: OrderItem }) {
  const extras = extrasText(item.extras_snapshot);
  return (
    <article className="rounded-2xl bg-background p-4">
      <div className="grid gap-2 sm:flex sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="font-black">{item.quantity}x {item.product_name_snapshot}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {[item.selected_variant, extras].filter(Boolean).join(" · ") || "Sin extras"}
          </p>
          {item.notes ? <p className="mt-1 text-sm text-muted-foreground">Obs.: {item.notes}</p> : null}
        </div>
        <strong className="whitespace-nowrap text-primary">{formatGs(item.line_total)}</strong>
      </div>
    </article>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="grid gap-1 sm:flex sm:justify-between sm:gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${strong ? "font-black" : "font-semibold"} break-words sm:text-right`}>{value}</span>
    </div>
  );
}

function extrasText(value: Json) {
  if (!Array.isArray(value)) return "";
  return value
    .map((extra) => {
      if (extra && typeof extra === "object" && !Array.isArray(extra) && "name" in extra) {
        return String(extra.name);
      }
      return "";
    })
    .filter(Boolean)
    .join(", ");
}
