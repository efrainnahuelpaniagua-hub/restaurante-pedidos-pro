import { Package, ReceiptText, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminData } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";
import { formatGs } from "@/lib/utils";

export default async function DashboardPage() {
  await requireAdmin();
  const data = await getAdminData();
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = data.orders.filter((order) => order.created_at?.startsWith(today));
  const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const cards: [LucideIcon, string, string | number][] = [
    [Package, "Total de productos", data.products.length],
    [Package, "Productos activos", data.products.filter((product) => product.is_available).length],
    [Sparkles, "Promociones activas", data.promotions.filter((promo) => promo.is_active).length],
    [ReceiptText, "Pedidos nuevos", data.orders.filter((order) => order.status === "Nuevo").length],
    [ReceiptText, "Pedidos del dia", todayOrders.length],
    [TrendingUp, "Ventas estimadas", formatGs(todaySales)],
  ];

  return (
    <AdminShell settings={data.settings} demo={data.isDemo}>
      <section className="grid gap-6">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Resumen comercial y operativo del restaurante.</p>
        </div>
        <div className="grid grid-auto-fit gap-4">
          {cards.map(([Icon, title, value]) => (
            <article key={String(title)} className="rounded-2xl border border-border bg-white p-5 soft-shadow">
              <Icon className="text-primary" size={24} />
              <p className="mt-4 text-sm font-bold text-muted-foreground">{String(title)}</p>
              <p className="mt-1 text-3xl font-black">{String(value)}</p>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
