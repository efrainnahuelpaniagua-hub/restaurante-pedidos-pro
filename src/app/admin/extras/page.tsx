import { deleteExtra, saveExtra } from "@/app/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm } from "@/components/admin/form-status";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/data";
import { formatGs } from "@/lib/utils";

export default async function ExtrasPage() {
  await requireAdmin();
  const data = await getAdminData();
  return (
    <AdminShell settings={data.settings} demo={data.isDemo}>
      <section className="grid gap-6">
        <h1 className="text-3xl font-black">Extras</h1>
        <AdminForm action={saveExtra} submitLabel="Crear extra">
          <div className="grid gap-4 md:grid-cols-2">
            <Label>Nombre<Input name="name" required /></Label>
            <Label>Precio<Input name="price" type="number" required /></Label>
          </div>
          <input type="hidden" name="is_active" value="true" />
        </AdminForm>
        <div className="grid gap-3">
          {data.extras.map((extra) => (
            <div key={extra.id} className="grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-black">{extra.name}</p>
                <p className="text-sm text-muted-foreground">{formatGs(extra.price)} · {extra.is_active ? "Activo" : "Inactivo"}</p>
              </div>
              <form action={deleteExtra.bind(null, extra.id)}>
                <Button variant="danger">Eliminar</Button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
