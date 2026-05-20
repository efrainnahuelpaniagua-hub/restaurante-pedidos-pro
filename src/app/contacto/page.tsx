import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { getPublicData } from "@/lib/data";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Direccion, horarios, WhatsApp y redes sociales de Sabor Express.",
};

export default async function ContactoPage() {
  const { settings } = await getPublicData();
  const whatsapp = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`;
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="container-page grid gap-8 py-14 lg:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-border bg-white p-6 soft-shadow">
          <p className="text-sm font-black uppercase text-primary">Contacto</p>
          <h1 className="mt-2 text-4xl font-black">Estamos listos para tomar tu pedido</h1>
          <div className="mt-8 grid gap-4">
            <Info icon={<MapPin />} title="Direccion" text={settings.address} />
            <Info icon={<Clock />} title="Horarios" text={settings.opening_hours} />
            <Info icon={<Phone />} title="Telefono" text={settings.phone} />
            <Info icon={<MessageCircle />} title="WhatsApp" text={settings.whatsapp_number} />
            <Info icon={<Share2 />} title="Instagram" text={settings.instagram_url || "Configurable desde admin"} />
            <Info icon={<Share2 />} title="Facebook" text={settings.facebook_url || "Configurable desde admin"} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={whatsapp}>Escribir por WhatsApp</LinkButton>
            <LinkButton href={settings.map_url || "#"} variant="outline">Como llegar</LinkButton>
          </div>
        </section>
        <section className="overflow-hidden rounded-3xl border border-border bg-white soft-shadow">
          <div className="grid h-full min-h-96 place-items-center bg-muted p-8 text-center">
            <MapPin className="mx-auto text-primary" size={52} />
            <h2 className="mt-4 text-2xl font-black">Mapa del local</h2>
            <p className="mt-2 text-sm text-muted-foreground">Usa el boton “Como llegar” para abrir la ubicacion configurada.</p>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}

function Info({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-background p-4">
      <span className="text-primary">{icon}</span>
      <div>
        <p className="font-black">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
