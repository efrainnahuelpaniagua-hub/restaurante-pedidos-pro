import { deleteProduct, saveProduct } from "@/app/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminForm } from "@/components/admin/form-status";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/data";
import { formatGs } from "@/lib/utils";

export default async function ProductosPage() {
  await requireAdmin();
  const data = await getAdminData();
  return (
    <AdminShell settings={data.settings} demo={data.isDemo}>
      <section className="grid gap-6">
        <h1 className="text-3xl font-black">Productos</h1>
        <AdminForm action={saveProduct} submitLabel="Crear producto">
          <div className="grid gap-4 md:grid-cols-3">
            <Label>Nombre<Input name="name" required /></Label>
            <Label>Slug<Input name="slug" required /></Label>
            <Label>Categoria<Select name="category_id">{data.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></Label>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Label>Precio base<Input name="base_price" type="number" required /></Label>
            <Label>Precio oferta<Input name="offer_price" type="number" /></Label>
            <Label>Orden<Input name="display_order" type="number" defaultValue={data.products.length + 1} /></Label>
          </div>
          <Label>Imagen URL<Input name="image_url" /></Label>
          <Label>Descripcion corta<Textarea name="short_description" required /></Label>
          <Label>Descripcion larga<Textarea name="long_description" required /></Label>
          <div className="grid gap-2 md:grid-cols-5">
            {[
              ["is_available", "Disponible"],
              ["is_featured", "Destacado"],
              ["is_best_seller", "Mas vendido"],
              ["is_new", "Nuevo"],
              ["is_promotion", "Promo"],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 rounded-xl bg-background p-3 text-sm font-bold">
                <input type="checkbox" name={name} value="true" defaultChecked={name === "is_available"} /> {label}
              </label>
            ))}
          </div>
        </AdminForm>
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr><th className="p-3">Producto</th><th>Categoria</th><th>Precio</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="p-3 font-black">{product.name}</td>
                  <td>{product.categories?.name || data.categories.find((category) => category.id === product.category_id)?.name}</td>
                  <td>{formatGs(product.offer_price || product.base_price)}</td>
                  <td>{product.is_available ? "Disponible" : "No disponible"}</td>
                  <td className="p-3 text-right">
                    <form action={deleteProduct.bind(null, product.id)}><Button variant="danger">Eliminar</Button></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
