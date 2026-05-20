import type { Metadata } from "next";
import { getPublicData } from "@/lib/data";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { MenuExplorer } from "@/components/public/menu-explorer";

export const metadata: Metadata = {
  title: "Menu digital",
  description: "Explora hamburguesas, pizzas, lomitos, combos, bebidas y postres de Sabor Express.",
};

export default async function MenuPage() {
  const { settings, categories, products } = await getPublicData();

  return (
    <>
      <SiteHeader settings={settings} />
      <main>
        <section className="bg-white py-12">
          <div className="container-page">
            <p className="text-sm font-black uppercase text-primary">Menu digital</p>
            <h1 className="mt-2 text-4xl font-black">Arma tu pedido</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">Busca, filtra, personaliza con extras y envia el pedido directo por WhatsApp.</p>
          </div>
        </section>
        <MenuExplorer categories={categories} products={products} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
