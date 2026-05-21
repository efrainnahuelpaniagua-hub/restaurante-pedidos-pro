"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/stores/cart-store";
import type { CartExtra, Product } from "@/lib/types";
import { formatGs, getProductPrice } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/field";

export function ProductCard({ product }: { product: Product }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const basePrice = getProductPrice(product.base_price, product.offer_price);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card soft-shadow">
      <button className="block w-full text-left" onClick={() => setDetailsOpen(true)}>
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
          ) : (
            <div className="grid h-full place-items-center font-bold text-muted-foreground">{product.name}</div>
          )}
        </div>
      </button>
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {product.is_promotion && <Badge className="bg-primary text-white">Oferta</Badge>}
          {product.is_new && <Badge>Nuevo</Badge>}
          {product.is_best_seller && <Badge>Mas vendido</Badge>}
          {!product.is_available && <Badge className="bg-danger text-white">No disponible</Badge>}
        </div>
        <div>
          <h3 className="text-lg font-black">{product.name}</h3>
          <p className="line-clamp-2 mt-1 text-sm text-muted-foreground">{product.short_description}</p>
        </div>
        <div className="grid gap-3 sm:flex sm:items-end sm:justify-between">
          <div className="min-w-0">
            {product.offer_price && <p className="text-xs font-semibold text-muted-foreground line-through">{formatGs(product.base_price)}</p>}
            <p className="text-xl font-black text-primary">{formatGs(basePrice)}</p>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2 sm:flex">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => setDetailsOpen(true)}>Ver detalles</Button>
            <QuickAdd product={product} />
          </div>
        </div>
      </div>
      {detailsOpen && <ProductDetail product={product} onClose={() => setDetailsOpen(false)} />}
    </article>
  );
}

function QuickAdd({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <Button
      disabled={!product.is_available}
      aria-label={`Agregar ${product.name}`}
      onClick={() => {
        const unitPrice = getProductPrice(product.base_price, product.offer_price);
        addItem({
          cartId: `${product.id}:quick`,
          productId: product.id,
          name: product.name,
          imageUrl: product.image_url,
          basePrice: unitPrice,
          unitPrice,
          quantity: 1,
          variant: null,
          extras: [],
          notes: "",
        });
        toast.success("Producto agregado al carrito");
      }}
    >
      <ShoppingCart size={18} />
    </Button>
  );
}

function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState(product.product_variants?.[0]?.id || "");
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const extras = (product.product_extras?.map((item) => item.extras).filter(Boolean) as CartExtra[] | undefined) ?? [];
  const variant = product.product_variants?.find((item) => item.id === variantId) ?? null;
  const selectedExtras = extras.filter((extra) => extraIds.includes(extra.id));
  const unitPrice = getProductPrice(product.base_price, product.offer_price) + (variant?.price_modifier || 0) + selectedExtras.reduce((sum, extra) => sum + extra.price, 0);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/50 p-0 sm:place-items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-background sm:rounded-3xl">
        <div className="grid md:grid-cols-2">
          <div className="aspect-[4/3] bg-muted md:aspect-auto">
            {product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />}
          </div>
          <div className="grid gap-5 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="break-words text-2xl font-black">{product.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{product.long_description}</p>
              </div>
              <button onClick={onClose} className="shrink-0 rounded-full bg-muted px-3 py-1 font-black" aria-label="Cerrar">x</button>
            </div>

            {!!product.product_variants?.length && (
              <fieldset className="grid gap-2">
                <legend className="font-bold">Variante</legend>
                <div className="grid gap-2">
                  {product.product_variants.map((item) => (
                    <label key={item.id} className="grid gap-2 rounded-xl border border-border bg-white p-3 text-sm font-semibold sm:flex sm:items-center sm:justify-between">
                      <span className="min-w-0 break-words"><input type="radio" name="variant" className="mr-2" checked={variantId === item.id} onChange={() => setVariantId(item.id)} />{item.name}</span>
                      <span className="whitespace-nowrap">{item.price_modifier ? `+ ${formatGs(item.price_modifier)}` : "Incluido"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <fieldset className="grid gap-2">
              <legend className="font-bold">Extras opcionales</legend>
              <div className="grid gap-2">
                {extras.map((extra) => (
                  <label key={extra.id} className="grid gap-2 rounded-xl border border-border bg-white p-3 text-sm font-semibold sm:flex sm:items-center sm:justify-between">
                    <span className="min-w-0 break-words">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={extraIds.includes(extra.id)}
                        onChange={() => setExtraIds((current) => current.includes(extra.id) ? current.filter((id) => id !== extra.id) : [...current, extra.id])}
                      />
                      {extra.name}
                    </span>
                    <span className="whitespace-nowrap">+ {formatGs(extra.price)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Textarea placeholder="Observacion para este producto" value={notes} onChange={(event) => setNotes(event.target.value)} />

            <div className="grid gap-3 rounded-2xl bg-white p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Button variant="outline" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Disminuir"><Minus size={16} /></Button>
                <span className="min-w-8 text-center text-lg font-black">{quantity}</span>
                <Button variant="outline" onClick={() => setQuantity((value) => value + 1)} aria-label="Aumentar"><Plus size={16} /></Button>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs font-semibold text-muted-foreground">Total</p>
                <p className="text-2xl font-black text-primary">{formatGs(unitPrice * quantity)}</p>
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!product.is_available}
              onClick={() => {
                addItem({
                  cartId: `${product.id}:${variant?.id || "base"}:${selectedExtras.map((extra) => extra.id).sort().join("-")}:${notes}`,
                  productId: product.id,
                  name: product.name,
                  imageUrl: product.image_url,
                  basePrice: getProductPrice(product.base_price, product.offer_price),
                  unitPrice,
                  quantity,
                  variant,
                  extras: selectedExtras,
                  notes,
                });
                toast.success("Producto agregado al carrito");
                onClose();
              }}
            >
              Agregar al carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
