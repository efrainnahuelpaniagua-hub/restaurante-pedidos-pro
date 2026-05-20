"use client";

import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
import type { RestaurantSettings } from "@/lib/types";
import { Button } from "../ui/button";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menu" },
  { href: "/menu?sort=promotions", label: "Promociones" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader({ settings }: { settings: RestaurantSettings }) {
  const [open, setOpen] = useState(false);
  const count = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur">
      <div className="container-page flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-black">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-lg text-white soft-shadow">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.business_name} className="size-full rounded-2xl object-cover" />
            ) : (
              "SE"
            )}
          </span>
          <span>
            <span className="block leading-tight">{settings.business_name}</span>
            <span className="block text-xs font-semibold text-muted-foreground">{settings.slogan}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/checkout"
            className="relative inline-flex size-11 items-center justify-center rounded-xl bg-foreground text-white"
            aria-label="Abrir carrito"
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-secondary px-1 text-xs font-black text-secondary-foreground">
                {count}
              </span>
            )}
          </Link>
          <Button variant="ghost" className="lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="container-page grid gap-1 pb-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
