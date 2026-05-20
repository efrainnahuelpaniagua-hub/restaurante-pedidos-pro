import type { Metadata } from "next";
import { getPublicData } from "@/lib/data";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { CheckoutForm } from "@/components/public/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Completa tus datos y envia tu pedido por WhatsApp.",
};

export default async function CheckoutPage() {
  const { settings, zones } = await getPublicData();
  return (
    <>
      <SiteHeader settings={settings} />
      <main>
        <CheckoutForm settings={settings} zones={zones} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
