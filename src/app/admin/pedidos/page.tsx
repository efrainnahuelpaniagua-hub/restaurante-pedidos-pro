import { updateOrderStatus } from "@/app/actions";
import { AutoRefresh } from "@/components/admin/auto-refresh";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/data";
import { getOrderFlow, isClosedOrder, normalizeOrderStatus } from "@/lib/order-status";
import { formatGs } from "@/lib/utils";

type AdminOrder = Awaited<ReturnType<typeof getAdminData>>["orders"][number];

export default async function PedidosPage() {
  await requireAdmin();
  const data = await getAdminData();
  const activeOrders = data.orders.filter((order) => !isClosedOrder(order.status));
  const closedOrders = data.orders.filter((order) => isClosedOrder(order.status));

  return (
    <AdminShell settings={data.settings} demo={data.isDemo}>
      <AutoRefresh intervalMs={10000} />
      <section className="grid gap-6">
        <div>
          <h1 className="text-3xl font-black">Pedidos</h1>
          <p className="mt-1 text-sm text-muted-foreground">La lista se actualiza automaticamente cada 10 segundos.</p>
        </div>

        <div className="grid gap-4">
          {activeOrders.length ? (
            activeOrders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-center sm:p-10">
              <p className="text-xl font-black">No hay pedidos activos</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Los pedidos nuevos apareceran aca sin reiniciar la pagina.</p>
            </div>
          )}
        </div>

        <details className="rounded-2xl border border-border bg-white p-3 sm:p-4">
          <summary className="cursor-pointer text-lg font-black sm:text-xl">Historial cerrado ({closedOrders.length})</summary>
          <div className="mt-4 grid gap-4">
            {closedOrders.map((order) => (
              <OrderCard key={order.id} order={order} compact />
            ))}
          </div>
        </details>
      </section>
    </AdminShell>
  );
}

function OrderCard({ order, compact = false }: { order: AdminOrder; compact?: boolean }) {
  const currentStatus = normalizeOrderStatus(order.status);
  const statuses = getOrderFlow(order.order_type);

  return (
    <article className="rounded-2xl border border-border bg-white p-3 soft-shadow sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="break-words text-lg font-black">{order.customer_name}</p>
          <p className="break-words text-sm text-muted-foreground">
            {order.customer_phone} · {order.order_type} · {currentStatus} {order.tracking_code ? `· #${order.tracking_code}` : ""}
          </p>
          <p className="mt-2 font-black text-primary">{formatGs(order.total)}</p>
        </div>
        {!compact ? (
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            {statuses.map((status) => (
              <form key={status} action={updateOrderStatus.bind(null, order.id, status)}>
                <Button className="w-full sm:w-auto" variant={currentStatus === status ? "primary" : "outline"}>{status}</Button>
              </form>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2 rounded-xl bg-background p-3 text-sm">
        {order.order_items?.map((item) => (
          <div key={item.id} className="grid gap-1 sm:flex sm:justify-between sm:gap-3">
            <span className="min-w-0 break-words">
              {item.quantity}x {item.product_name_snapshot} {item.selected_variant ? `· ${item.selected_variant}` : ""}
            </span>
            <strong className="whitespace-nowrap">{formatGs(item.line_total)}</strong>
          </div>
        ))}
        {order.general_notes ? <p className="break-words text-muted-foreground">Obs.: {order.general_notes}</p> : null}
      </div>
    </article>
  );
}
