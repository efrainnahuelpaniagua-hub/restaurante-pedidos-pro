import type { Metadata } from "next";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { MyOrdersList } from "@/components/public/my-orders-list";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mis pedidos",
  description: "Pedidos guardados en este dispositivo.",
};

export default async function MisPedidosPage() {
  const settings = await getSettings();

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="container-page py-10">
        <MyOrdersList />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
