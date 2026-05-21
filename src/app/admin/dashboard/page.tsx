import { Package, ReceiptText, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AutoRefresh } from "@/components/admin/auto-refresh";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminData } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";
import { getSalesMetrics } from "@/lib/date-metrics";
import { isClosedOrder, normalizeOrderStatus } from "@/lib/order-status";
import { formatGs } from "@/lib/utils";

export default async function DashboardPage() {
  await requireAdmin();
  const data = await getAdminData();
  const metrics = getSalesMetrics(data.orders);
  const activeOrders = data.orders.filter((order) => !isClosedOrder(order.status));
  const cards: [LucideIcon, string, string | number][] = [
    [Package, "Total de productos", data.products.length],
    [Package, "Productos activos", data.products.filter((product) => product.is_available).length],
    [Sparkles, "Promociones activas", data.promotions.filter((promo) => promo.is_active).length],
    [ReceiptText, "Pedidos recibidos", data.orders.filter((order) => normalizeOrderStatus(order.status) === "Recibido").length],
    [ReceiptText, "Pedidos activos", activeOrders.length],
    [TrendingUp, "Vendido hoy", formatGs(metrics.today.total)],
  ];

  return (
    <AdminShell settings={data.settings} demo={data.isDemo}>
      <AutoRefresh intervalMs={15000} />
      <section className="grid gap-6">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Resumen comercial y operativo del restaurante.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(([Icon, title, value]) => (
            <article key={String(title)} className="min-w-0 rounded-2xl border border-border bg-white p-4 soft-shadow sm:p-5">
              <Icon className="text-primary" size={24} />
              <p className="mt-4 text-sm font-bold text-muted-foreground">{String(title)}</p>
              <p className="mt-1 text-2xl font-black sm:text-3xl">{String(value)}</p>
            </article>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 soft-shadow sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">Detalles</h2>
              <p className="text-sm text-muted-foreground">Ventas calculadas solo con pedidos entregados. Zona horaria: {metrics.timezone}.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:hidden">
            {[metrics.today, metrics.week, metrics.month].map((item) => (
              <article key={item.label} className="rounded-xl bg-background p-4">
                <p className="font-black">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.orders} pedidos entregados</p>
                <p className="mt-2 text-xl font-black text-primary">{formatGs(item.total)}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="rounded-l-xl p-3">Periodo</th>
                  <th>Pedidos entregados</th>
                  <th className="rounded-r-xl">Total vendido</th>
                </tr>
              </thead>
              <tbody>
                {[metrics.today, metrics.week, metrics.month].map((item) => (
                  <tr key={item.label} className="border-b border-border last:border-0">
                    <td className="p-3 font-black">{item.label}</td>
                    <td>{item.orders}</td>
                    <td className="font-black text-primary">{formatGs(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
