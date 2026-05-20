import type { Metadata } from "next";
import { signInAdmin } from "@/app/actions";
import { getSettings } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export const metadata: Metadata = { title: "Login admin" };

export default async function LoginPage() {
  const settings = await getSettings();
  return (
    <main className="grid min-h-screen place-items-center bg-[#2a1710] p-4">
      <form action={signInAdmin} className="grid w-full max-w-md gap-5 rounded-3xl bg-white p-6 soft-shadow">
        <div>
          <p className="text-sm font-black uppercase text-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-black">{settings.business_name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ingresa con tu email y contrasena de Supabase Auth.</p>
        </div>
        <Label>Email<Input type="email" name="email" required /></Label>
        <Label>Contrasena<Input type="password" name="password" required /></Label>
        <Button>Ingresar</Button>
      </form>
    </main>
  );
}
