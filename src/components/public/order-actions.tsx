"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { cancelPublicOrder } from "@/app/actions";
import { buildWhatsAppUrl } from "@/lib/order-message";
import type { PublicOrderDetails, RestaurantSettings } from "@/lib/types";
import { Button } from "../ui/button";

const CANCEL_WINDOW_MINUTES = 10;

export function OrderActions({ order, settings }: { order: PublicOrderDetails; settings: RestaurantSettings }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [now, setNow] = useState(() => Date.now());
  const [currentUrl] = useState(() => (typeof window === "undefined" ? "" : window.location.href));

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now());
      router.refresh();
    }, 10000);
    return () => window.clearInterval(id);
  }, [router]);

  const createdAt = new Date(order.created_at || "").getTime();
  const minutesPassed = Math.floor((now - createdAt) / 60000);
  const canCancel = order.status === "Recibido" && minutesPassed < CANCEL_WINDOW_MINUTES;
  const minutesLeft = Math.max(0, CANCEL_WINDOW_MINUTES - minutesPassed);

  const message = useMemo(
    () =>
      [
        "Hola, ya hice mi pedido.",
        "",
        `Codigo: ${order.tracking_code}`,
        `Cliente: ${order.customer_name}`,
        `Tipo: ${order.order_type}`,
        `Total: Gs. ${new Intl.NumberFormat("es-PY").format(order.total)}`,
        "",
        currentUrl ? `Detalle: ${currentUrl}` : "",
      ].join("\n"),
    [currentUrl, order],
  );

  return (
    <div className="grid gap-3">
      <Button
        className="w-full"
        onClick={() => window.open(buildWhatsAppUrl(settings.whatsapp_number, message), "_blank", "noopener,noreferrer")}
      >
        Mandar por WhatsApp
      </Button>
      {order.status === "Recibido" ? (
        <Button
          className="w-full"
          variant="outline"
          disabled={!canCancel || isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await cancelPublicOrder(order.tracking_code);
              if (result.ok) {
                toast.success(result.message);
                router.refresh();
              } else {
                toast.error(result.message);
              }
            });
          }}
        >
          {canCancel ? `Cancelar pedido (${minutesLeft} min)` : "Ya no se puede cancelar"}
        </Button>
      ) : null}
      <p className="text-xs text-muted-foreground">
        La cancelacion solo esta disponible durante los primeros {CANCEL_WINDOW_MINUTES} minutos y antes de que el pedido pase a preparacion.
      </p>
    </div>
  );
}
