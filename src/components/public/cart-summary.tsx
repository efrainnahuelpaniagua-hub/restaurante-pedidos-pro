"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, getCartTotals } from "@/lib/stores/cart-store";
import { formatGs } from "@/lib/utils";
import { Button, LinkButton } from "../ui/button";

export function CartSummary({ deliveryFee = 0, compact = false }: { deliveryFee?: number; compact?: boolean }) {
  const { items, increase, decrease, remove, clear } = useCartStore();
  const totals = getCartTotals(items, deliveryFee);

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-white p-8 text-center">
        <p className="text-xl font-black">Aun no agregaste productos a tu pedido.</p>
        <p className="mt-2 text-sm text-muted-foreground">Explora el menu y arma tu pedido en pocos pasos.</p>
        <LinkButton href="/menu" className="mt-5">Ver menu</LinkButton>
      </div>
    );
  }

  return (
    <aside className="grid gap-4 rounded-3xl border border-border bg-white p-4 soft-shadow">
      {!compact && <h2 className="text-2xl font-black">Tu pedido</h2>}
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.cartId} className="grid grid-cols-[64px_1fr] gap-3 rounded-2xl bg-background p-2">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="size-16 rounded-xl object-cover" /> : <div className="size-16 rounded-xl bg-muted" />}
            <div className="grid gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-black">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[item.variant?.name, ...item.extras.map((extra) => extra.name)].filter(Boolean).join(" · ") || "Sin extras"}
                  </p>
                  {item.notes && <p className="text-xs text-muted-foreground">Obs.: {item.notes}</p>}
                </div>
                <button onClick={() => remove(item.cartId)} aria-label="Eliminar producto" className="text-danger"><Trash2 size={17} /></button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button variant="outline" className="size-8 min-h-8 px-0" onClick={() => decrease(item.cartId)} aria-label="Disminuir"><Minus size={14} /></Button>
                  <span className="min-w-7 text-center font-black">{item.quantity}</span>
                  <Button variant="outline" className="size-8 min-h-8 px-0" onClick={() => increase(item.cartId)} aria-label="Aumentar"><Plus size={14} /></Button>
                </div>
                <p className="font-black text-primary">{formatGs(item.unitPrice * item.quantity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><strong>{formatGs(totals.subtotal)}</strong></div>
        <div className="flex justify-between"><span>Delivery</span><strong>{formatGs(deliveryFee)}</strong></div>
        <div className="flex justify-between text-xl"><span className="font-black">Total</span><strong className="text-primary">{formatGs(totals.total)}</strong></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={clear}>Vaciar</Button>
        {!compact && <LinkButton href="/checkout">Continuar</LinkButton>}
      </div>
    </aside>
  );
}
