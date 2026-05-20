import { updateOrderStatus } from "@/app/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/data";
import type { OrderStatus } from "@/lib/types";
import { formatGs } from "@/lib/utils";

const statuses: OrderStatus[] = ["Nuevo", "Preparando", "En camino", "Entregado", "Cancelado"];

export default async function PedidosPage() {
  await requireAdmin();
  const data = await getAdminData();
  return (
    <AdminShell settings={data.settings} demo={data.isDemo}>
      <section className="grid gap-6">
        <h1 className="text-3xl font-black">Pedidos</h1>
        <div className="grid gap-4">
          {data.orders.length ? data.orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-border bg-white p-4 soft-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-black">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_phone} · {order.order_type} · {order.status}</p>
                  <p className="mt-2 font-black text-primary">{formatGs(order.total)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <form key={status} action={updateOrderStatus.bind(null, order.id, status)}>
                      <Button variant={order.status === status ? "primary" : "outline"}>{status}</Button>
                    </form>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-2 rounded-xl bg-background p-3 text-sm">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span>{item.quantity}x {item.product_name_snapshot} {item.selected_variant ? `· ${item.selected_variant}` : ""}</span>
                    <strong>{formatGs(item.line_total)}</strong>
                  </div>
                ))}
                {order.general_notes && <p className="text-muted-foreground">Obs.: {order.general_notes}</p>}
              </div>
            </article>
          )) : (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
              <p className="text-xl font-black">Todavia no hay pedidos guardados</p>
              <p className="mt-2 text-sm text-muted-foreground">Cuando el checkout guarde pedidos en Supabase apareceran aca.</p>
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
