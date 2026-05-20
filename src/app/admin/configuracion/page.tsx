import { saveSettings } from "@/app/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm } from "@/components/admin/form-status";
import { Input, Label, Textarea } from "@/components/ui/field";
import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/data";

export default async function ConfiguracionPage() {
  await requireAdmin();
  const data = await getAdminData();
  const s = data.settings;
  return (
    <AdminShell settings={s} demo={data.isDemo}>
      <section className="grid gap-6">
        <h1 className="text-3xl font-black">Configuracion del negocio</h1>
        <AdminForm action={saveSettings}>
          <input type="hidden" name="id" value={s.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <Label>Nombre<Input name="business_name" defaultValue={s.business_name} /></Label>
            <Label>Slogan<Input name="slogan" defaultValue={s.slogan} /></Label>
            <Label>WhatsApp<Input name="whatsapp_number" defaultValue={s.whatsapp_number} /></Label>
            <Label>Telefono<Input name="phone" defaultValue={s.phone} /></Label>
            <Label>Logo URL<Input name="logo_url" defaultValue={s.logo_url || ""} /></Label>
            <Label>Portada URL<Input name="hero_image_url" defaultValue={s.hero_image_url || ""} /></Label>
            <Label>Instagram<Input name="instagram_url" defaultValue={s.instagram_url || ""} /></Label>
            <Label>Facebook<Input name="facebook_url" defaultValue={s.facebook_url || ""} /></Label>
            <Label>TikTok<Input name="tiktok_url" defaultValue={s.tiktok_url || ""} /></Label>
            <Label>Mapa<Input name="map_url" defaultValue={s.map_url || ""} /></Label>
            <Label>Precio delivery<Input type="number" name="delivery_fee" defaultValue={s.delivery_fee} /></Label>
            <Label>Pedido minimo<Input type="number" name="minimum_order_for_delivery" defaultValue={s.minimum_order_for_delivery} /></Label>
            <Label>Color principal<Input name="primary_color" defaultValue={s.primary_color} /></Label>
            <Label>Color secundario<Input name="secondary_color" defaultValue={s.secondary_color} /></Label>
          </div>
          <Label>Direccion<Textarea name="address" defaultValue={s.address} /></Label>
          <Label>Horarios<Textarea name="opening_hours" defaultValue={s.opening_hours} /></Label>
          <div className="grid gap-2 md:grid-cols-4">
            {[
              ["delivery_enabled", "Delivery", s.delivery_enabled],
              ["pickup_enabled", "Retiro", s.pickup_enabled],
              ["save_orders_enabled", "Guardar pedidos", s.save_orders_enabled],
              ["allow_cash_payment", "Efectivo", s.allow_cash_payment],
              ["allow_transfer_payment", "Transferencia", s.allow_transfer_payment],
              ["allow_card_on_delivery", "Tarjeta al recibir", s.allow_card_on_delivery],
              ["is_open", "Abierto", s.is_open],
              ["accepting_orders", "Acepta pedidos", s.accepting_orders],
            ].map(([name, label, checked]) => (
              <label key={String(name)} className="flex items-center gap-2 rounded-xl bg-background p-3 text-sm font-bold">
                <input type="checkbox" name={String(name)} value="true" defaultChecked={Boolean(checked)} /> {String(label)}
              </label>
            ))}
          </div>
        </AdminForm>
      </section>
    </AdminShell>
  );
}
