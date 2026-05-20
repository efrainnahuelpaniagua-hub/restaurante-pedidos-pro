import { saveZone } from "@/app/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm } from "@/components/admin/form-status";
import { Input, Label } from "@/components/ui/field";
import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/data";
import { formatGs } from "@/lib/utils";

export default async function ZonasDeliveryPage() {
  await requireAdmin();
  const data = await getAdminData();
  return (
    <AdminShell settings={data.settings} demo={data.isDemo}>
      <section className="grid gap-6">
        <h1 className="text-3xl font-black">Zonas de delivery</h1>
        <AdminForm action={saveZone} submitLabel="Crear zona">
          <div className="grid gap-4 md:grid-cols-4">
            <Label>Nombre<Input name="name" required /></Label>
            <Label>Costo<Input name="fee" type="number" required /></Label>
            <Label>Minimo<Input name="minimum_order" type="number" required /></Label>
            <Label>Orden<Input name="display_order" type="number" defaultValue={data.zones.length + 1} /></Label>
          </div>
          <input type="hidden" name="is_active" value="true" />
        </AdminForm>
        <div className="grid grid-auto-fit gap-4">
          {data.zones.map((zone) => (
            <article key={zone.id} className="rounded-2xl border border-border bg-white p-5">
              <p className="text-lg font-black">{zone.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">Delivery {formatGs(zone.fee)} · minimo {formatGs(zone.minimum_order)}</p>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
