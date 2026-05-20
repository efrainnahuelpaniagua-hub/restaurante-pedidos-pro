import Link from "next/link";
import { MapPin, Phone, Share2 } from "lucide-react";
import type { RestaurantSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: RestaurantSettings }) {
  return (
    <footer className="mt-20 border-t border-border bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-xl font-black">{settings.business_name}</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{settings.slogan}. Pedidos faciles, sabores frescos y atencion rapida en Ciudad del Este.</p>
        </div>
        <div className="grid gap-2 text-sm">
          <Link href="/menu" className="font-semibold hover:text-primary">Menu</Link>
          <Link href="/nosotros" className="font-semibold hover:text-primary">Nosotros</Link>
          <Link href="/contacto" className="font-semibold hover:text-primary">Contacto</Link>
          <Link href="/admin/login" className="font-semibold hover:text-primary">Admin</Link>
        </div>
        <div className="grid gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><MapPin size={16} /> {settings.address}</span>
          <span className="flex items-center gap-2"><Phone size={16} /> {settings.phone}</span>
          <span className="flex items-center gap-2"><Share2 size={16} /> Instagram</span>
          <span className="flex items-center gap-2"><Share2 size={16} /> Facebook</span>
        </div>
      </div>
    </footer>
  );
}
