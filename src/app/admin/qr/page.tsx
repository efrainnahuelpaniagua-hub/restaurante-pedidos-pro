import { AdminShell } from "@/components/admin/admin-shell";
import { QrPanel } from "@/components/admin/qr-panel";
import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

export default async function QrPage() {
  await requireAdmin();
  const data = await getAdminData();
  return (
    <AdminShell settings={data.settings} demo={data.isDemo}>
      <section className="grid gap-6">
        <h1 className="text-3xl font-black">Codigo QR del menu</h1>
        <QrPanel url={absoluteUrl("/menu")} />
      </section>
    </AdminShell>
  );
}
