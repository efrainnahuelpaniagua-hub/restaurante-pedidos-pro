import type { Metadata } from "next";
import { Heart, Leaf, Timer, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getPublicData } from "@/lib/data";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce la historia, mision y valores de Sabor Express.",
};

export default async function NosotrosPage() {
  const { settings } = await getPublicData();
  return (
    <>
      <SiteHeader settings={settings} />
      <main>
        <section className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-sm font-black uppercase text-primary">Nosotros</p>
            <h1 className="mt-2 text-4xl font-black">Cocina rapida con sabor de verdad</h1>
            <p className="mt-5 text-lg text-muted-foreground">
              {settings.business_name} nacio en Ciudad del Este con una idea simple: hacer que pedir comida rica sea facil, claro y rapido. Trabajamos con ingredientes frescos, recetas populares y una atencion cercana.
            </p>
            <p className="mt-4 text-muted-foreground">
              Nuestra mision es resolver tus antojos con productos consistentes, precios accesibles y una experiencia digital sin complicaciones.
            </p>
          </div>
          <img src={settings.hero_image_url || ""} alt="Cocina de Sabor Express" className="h-full min-h-80 rounded-3xl object-cover soft-shadow" />
        </section>
        <section className="bg-white py-14">
          <div className="container-page grid grid-auto-fit gap-4">
            {([
              [Leaf, "Ingredientes frescos", "Seleccionamos insumos de calidad para cada pedido."],
              [Timer, "Atencion rapida", "Procesos simples para entregar mejor y antes."],
              [Heart, "Pedidos faciles", "Menu claro, carrito completo y WhatsApp listo."],
              [WalletCards, "Precios accesibles", "Opciones para todos los gustos y presupuestos."],
            ] as [LucideIcon, string, string][]).map(([Icon, title, text]) => (
              <article key={String(title)} className="rounded-2xl border border-border bg-background p-6">
                <Icon className="text-primary" />
                <h2 className="mt-4 text-xl font-black">{String(title)}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{String(text)}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
