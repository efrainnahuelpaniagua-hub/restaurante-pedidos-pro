"use client";

import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import { getSavedClientOrders, type SavedClientOrder } from "@/lib/client-orders";
import { formatGs } from "@/lib/utils";
import { LinkButton } from "../ui/button";

export function MyOrdersList() {
  const [orders, setOrders] = useState<SavedClientOrder[]>([]);

  useEffect(() => {
    const id = window.setTimeout(() => setOrders(getSavedClientOrders()), 0);
    return () => window.clearTimeout(id);
  }, []);

  if (!orders.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-white p-10 text-center">
        <ReceiptText className="mx-auto text-primary" size={44} />
        <h1 className="mt-4 text-3xl font-black">Todavia no tenes pedidos guardados</h1>
        <p className="mt-2 text-sm text-muted-foreground">Cuando hagas un pedido desde este dispositivo, va a quedar guardado aca.</p>
        <LinkButton href="/menu" className="mt-5">Ver menu</LinkButton>
      </div>
    );
  }

  return (
    <section className="grid gap-4">
      <div>
        <h1 className="text-3xl font-black">Mis pedidos</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pedidos hechos desde este dispositivo.</p>
      </div>
      <div className="grid gap-3">
        {orders.map((order) => (
          <Link
            key={order.trackingCode}
            href={`/pedido/${order.trackingCode}`}
            className="grid gap-3 rounded-2xl border border-border bg-white p-4 transition hover:border-primary md:grid-cols-[1fr_auto]"
          >
            <div>
              <p className="font-black">Pedido #{order.trackingCode}</p>
              <p className="text-sm text-muted-foreground">
                {order.orderType} · {new Date(order.createdAt).toLocaleString("es-PY")}
              </p>
            </div>
            <strong className="text-primary">{formatGs(order.total)}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
