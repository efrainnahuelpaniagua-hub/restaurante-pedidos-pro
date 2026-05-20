import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, CookingPot, PackageCheck, Truck, XCircle } from "lucide-react";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { getPublicData, getPublicOrderDetails } from "@/lib/data";
import type { Json, OrderItem } from "@/lib/types";
import { formatGs } from "@/lib/utils";

type PageProps = {
  params: Promise<{ trackingCode: string }>;
};

export const metadata: Metadata = {
  title: "Detalle del pedido",
  description: "Consulta el estado y detalle de tu pedido.",
};

const statusSteps = [
  { status: "Nuevo", label: "Recibido", icon: Clock },
  { status: "Preparando", label: "Preparando", icon: CookingPot },
  { status: "En camino", label: "En camino", icon: Truck },
  { status: "Entregado", label: "Entregado", icon: PackageCheck },
];

export default async function PedidoDetallePage({ params }: PageProps) {
  const { trackingCode } = await params;
  const [{ settings }, order] = await Promise.all([
    getPublicData(),
    getPublicOrderDetails(trackingCode),
  ]);

  if (!order) notFound();

  const currentIndex = statusSteps.findIndex((step) => step.status === order.status);
  const isCancelled = order.status === "Cancelado";

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="container-page grid gap-8 py-10">
        <section className="rounded-3xl border border-border bg-white p-5 soft-shadow md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-primary">Detalle del pedido</p>
              <h1 className="mt-2 text-3xl font-black">Pedido #{order.tracking_code}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Cliente: {order.customer_name} · {new Date(order.created_at || "").toLocaleString("es-PY")}
              </p>
            </div>
            <Badge className={isCancelled ? "bg-danger text-white" : "bg-primary text-white"}>{order.status}</Badge>
          </div>

          {isCancelled ? (
            <div className="mt-8 rounded-2xl bg-red-50 p-5 text-danger">
              <XCircle />
              <p className="mt-2 font-black">Este pedido fue cancelado.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-3 md:grid-cols-4">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const active = currentIndex >= index;
                return (
                  <div
                    key={step.status}
                    className={`rounded-2xl border p-4 ${
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

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-border bg-white p-5 soft-shadow">
            <h2 className="text-2xl font-black">Productos</h2>
            <div className="mt-5 grid gap-3">
              {order.items.map((item) => (
                <OrderItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          <aside className="grid gap-4 rounded-3xl border border-border bg-white p-5 soft-shadow">
            <h2 className="text-2xl font-black">Resumen</h2>
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
              <div className="flex justify-between text-xl">
                <span className="font-black">Total</span>
                <strong className="text-primary">{formatGs(order.total)}</strong>
              </div>
            </div>
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
      <div className="flex justify-between gap-3">
        <div>
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
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-black" : "font-semibold"}>{value}</span>
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
