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
      <aside className="border-r border-border bg-white p-4 lg:min-h-screen">
        <div className="mb-6 rounded-2xl bg-foreground p-4 text-white">
          <p className="text-lg font-black">{settings.business_name}</p>
          <p className="text-xs text-white/70">Panel administrativo</p>
          {demo && <p className="mt-3 rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">Modo demo sin Supabase</p>}
        </div>
        <nav className="grid gap-1">
          {nav.map(([href, label, Icon]) => (
            <Link key={String(href)} href={String(href)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold hover:bg-muted">
              <Icon size={18} /> {String(label)}
            </Link>
          ))}
        </nav>
        <form action={signOutAdmin} className="mt-6">
          <Button variant="outline" className="w-full"><LogOut size={16} /> Salir</Button>
        </form>
      </aside>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
