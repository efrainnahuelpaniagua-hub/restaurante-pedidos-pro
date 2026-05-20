import { deletePromotion, savePromotion } from "@/app/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm } from "@/components/admin/form-status";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/data";
import { formatGs } from "@/lib/utils";

export default async function PromocionesPage() {
  await requireAdmin();
  const data = await getAdminData();
  return (
    <AdminShell settings={data.settings} demo={data.isDemo}>
      <section className="grid gap-6">
        <h1 className="text-3xl font-black">Promociones</h1>
        <AdminForm action={savePromotion} submitLabel="Crear promocion">
          <div className="grid gap-4 md:grid-cols-2">
            <Label>Titulo<Input name="title" required /></Label>
            <Label>Producto vinculado<Select name="linked_product_id"><option value="">Sin producto</option>{data.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</Select></Label>
          </div>
          <Label>Descripcion<Textarea name="description" required /></Label>
          <div className="grid gap-4 md:grid-cols-4">
            <Label>Precio promo<Input name="promo_price" type="number" required /></Label>
            <Label>Precio original<Input name="original_price" type="number" /></Label>
            <Label>Inicio<Input name="starts_at" type="datetime-local" /></Label>
            <Label>Fin<Input name="ends_at" type="datetime-local" /></Label>
          </div>
          <Label>Imagen URL<Input name="image_url" /></Label>
          <input type="hidden" name="is_active" value="true" />
        </AdminForm>
        <div className="grid gap-3">
          {data.promotions.map((promo) => (
            <div key={promo.id} className="grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-black">{promo.title}</p>
                <p className="text-sm text-muted-foreground">{formatGs(promo.promo_price)} · {promo.is_active ? "Activa" : "Inactiva"}</p>
              </div>
              <form action={deletePromotion.bind(null, promo.id)}>
                <Button variant="danger">Eliminar</Button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
