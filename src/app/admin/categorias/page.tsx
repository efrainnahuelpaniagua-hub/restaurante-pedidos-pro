import { deleteCategory, saveCategory } from "@/app/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm } from "@/components/admin/form-status";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/data";
import { slugify } from "@/lib/utils";

export default async function CategoriasPage() {
  await requireAdmin();
  const data = await getAdminData();
  return (
    <AdminShell settings={data.settings} demo={data.isDemo}>
      <section className="grid gap-6">
        <h1 className="text-3xl font-black">Categorias</h1>
        <AdminForm action={saveCategory} submitLabel="Crear categoria">
          <div className="grid gap-4 md:grid-cols-3">
            <Label>Nombre<Input name="name" required /></Label>
            <Label>Slug<Input name="slug" required placeholder={slugify("Hamburguesas")} /></Label>
            <Label>Orden<Input name="display_order" type="number" defaultValue={data.categories.length + 1} /></Label>
          </div>
          <Label>Descripcion<Textarea name="description" /></Label>
          <input type="hidden" name="is_active" value="true" />
        </AdminForm>
        <div className="grid gap-3">
          {data.categories.map((category) => (
            <div key={category.id} className="grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-black">{category.name}</p>
                <p className="text-sm text-muted-foreground">{category.slug} · orden {category.display_order} · {category.is_active ? "Activa" : "Inactiva"}</p>
              </div>
              <form action={deleteCategory.bind(null, category.id)}>
                <Button variant="danger">Eliminar</Button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
