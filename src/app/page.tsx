import { Clock, MapPin, PackageCheck, Sparkles, Truck, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getPublicData } from "@/lib/data";
import { formatGs } from "@/lib/utils";
import { LinkButton } from "@/components/ui/button";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { ProductCard } from "@/components/public/product-card";

export default async function Home() {
  const { settings, categories, products, promotions } = await getPublicData();
  const featured = products.filter((product) => product.is_featured).slice(0, 4);

  return (
    <>
      <SiteHeader settings={settings} />
      <main>
        <section className="relative overflow-hidden bg-[#2a1710] text-white">
          <img src={settings.hero_image_url || ""} alt="Comida destacada de Sabor Express" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="container-page relative grid min-h-[calc(100svh-80px)] content-center gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_420px]">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">{settings.slogan}</span>
              <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl md:text-7xl">Pedi tu comida favorita en pocos pasos</h1>
              <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">Elegi tus platos, agregalos al carrito y envia el pedido por WhatsApp.</p>
              <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                <LinkButton href="/menu" className="w-full sm:w-auto">Ver menu</LinkButton>
                <LinkButton href="/checkout" className="w-full sm:w-auto" variant="secondary">Pedir ahora</LinkButton>
              </div>
            </div>
            <div className="hidden self-end rounded-3xl bg-white/12 p-5 backdrop-blur lg:block">
              <p className="text-sm font-bold text-white/80">Delivery desde</p>
              <p className="text-4xl font-black">{formatGs(settings.delivery_fee)}</p>
              <p className="mt-3 text-sm text-white/80">{settings.opening_hours}</p>
            </div>
          </div>
        </section>

        <section className="container-page -mt-10 relative z-10 grid gap-4 md:grid-cols-4">
          {([
            [Truck, "Delivery disponible", "Llegamos a tus zonas favoritas"],
            [PackageCheck, "Retiro en local", "Te avisamos cuando este listo"],
            [Clock, "Tiempo estimado", "30 a 45 minutos"],
            [MapPin, "Ciudad del Este", settings.address],
          ] as [LucideIcon, string, string][]).map(([Icon, title, text]) => (
            <div key={String(title)} className="rounded-2xl border border-border bg-white p-5 soft-shadow">
              <Icon className="text-primary" size={26} />
              <p className="mt-3 font-black">{String(title)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{String(text)}</p>
            </div>
          ))}
        </section>

        <section className="container-page grid gap-6 py-16">
          <div className="grid gap-4 sm:flex sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-primary">Categorias</p>
              <h2 className="text-3xl font-black">Elegi por antojo</h2>
            </div>
            <LinkButton href="/menu" className="w-full sm:w-auto" variant="outline">Ver todo</LinkButton>
          </div>
          <div className="grid grid-auto-fit gap-4">
            {categories.slice(0, 7).map((category) => (
              <a key={category.id} href={`/menu?category=${category.id}`} className="rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl">
                <Utensils className="text-primary" />
                <p className="mt-4 text-lg font-black">{category.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container-page grid gap-6">
            <div>
              <p className="text-sm font-black uppercase text-primary">Destacados</p>
              <h2 className="text-3xl font-black">Favoritos de la casa</h2>
            </div>
            <div className="grid grid-auto-fit gap-5">
              {featured.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>

        <section className="container-page grid gap-6 py-16">
          <div>
            <p className="text-sm font-black uppercase text-primary">Promociones</p>
            <h2 className="text-3xl font-black">Ofertas activas</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {promotions.map((promo) => (
              <article key={promo.id} className="overflow-hidden rounded-3xl bg-[#27140d] text-white soft-shadow md:grid md:grid-cols-[1fr_220px]">
                <div className="p-6">
                  <Sparkles className="text-secondary" />
                  <h3 className="mt-4 text-2xl font-black">{promo.title}</h3>
                  <p className="mt-2 text-white/75">{promo.description}</p>
                  <p className="mt-5 text-3xl font-black text-secondary">{formatGs(promo.promo_price)}</p>
                </div>
                {promo.image_url && <img src={promo.image_url} alt={promo.title} className="h-full min-h-56 w-full object-cover" />}
              </article>
            ))}
          </div>
        </section>

        <section className="container-page rounded-3xl bg-foreground p-5 text-white sm:p-8 md:p-12">
          <h2 className="text-3xl font-black">Mira el menu y hace tu pedido</h2>
          <p className="mt-3 max-w-2xl text-white/75">Ingredientes frescos, atencion rapida, pedidos faciles y precios pensados para disfrutar sin vueltas.</p>
          <LinkButton href="/menu" className="mt-6 w-full sm:w-auto" variant="secondary">Empezar pedido</LinkButton>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
