import Link from "next/link";
import { BarChart3, Boxes, ClipboardList, FolderTree, Gift, LogOut, MapPinned, QrCode, Settings, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { signOutAdmin } from "@/app/actions";
import type { RestaurantSettings } from "@/lib/types";
import { Button } from "../ui/button";

const nav: [string, string, LucideIcon][] = [
  ["/admin/dashboard", "Dashboard", BarChart3],
  ["/admin/productos", "Productos", Boxes],
  ["/admin/categorias", "Categorias", FolderTree],
  ["/admin/extras", "Extras", Sparkles],
  ["/admin/promociones", "Promociones", Gift],
  ["/admin/pedidos", "Pedidos", ClipboardList],
  ["/admin/zonas-delivery", "Zonas", MapPinned],
  ["/admin/configuracion", "Configuracion", Settings],
  ["/admin/qr", "QR", QrCode],
];

export function AdminShell({ children, settings, demo = false }: { children: React.ReactNode; settings: RestaurantSettings; demo?: boolean }) {
  return (
    <div className="min-h-screen bg-[#f7f1ea] lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="sticky top-0 z-30 min-w-0 overflow-hidden border-b border-border bg-white p-3 lg:static lg:min-h-screen lg:border-b-0 lg:border-r lg:p-4">
        <div className="mb-3 rounded-2xl bg-foreground p-3 text-white lg:mb-6 lg:p-4">
          <p className="text-base font-black lg:text-lg">{settings.business_name}</p>
          <p className="text-xs text-white/70">Panel administrativo</p>
          {demo && <p className="mt-3 rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">Modo demo sin Supabase</p>}
        </div>
        <nav className="-mx-1 flex max-w-full gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0">
          {nav.map(([href, label, Icon]) => (
            <Link key={String(href)} href={String(href)} className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold hover:bg-muted lg:text-sm">
              <Icon size={18} /> {String(label)}
            </Link>
          ))}
        </nav>
        <form action={signOutAdmin} className="mt-3 lg:mt-6">
          <Button variant="outline" className="w-full"><LogOut size={16} /> Salir</Button>
        </form>
      </aside>
      <main className="min-w-0 p-3 md:p-8">{children}</main>
    </div>
  );
}
