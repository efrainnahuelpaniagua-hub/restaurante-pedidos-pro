"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

type ActionResult = { ok?: boolean; error?: string } | undefined;
type FormAction = (formData: FormData) => Promise<ActionResult>;

export function AdminForm({ action, children, submitLabel = "Guardar" }: { action: FormAction; children: React.ReactNode; submitLabel?: string }) {
  const [state, formAction, pending] = useActionState(async (_: ActionResult, formData: FormData) => action(formData), undefined);

  useEffect(() => {
    if (state?.ok) toast.success("Cambios guardados");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4 rounded-2xl border border-border bg-white p-4">
      {children}
      <Button disabled={pending}>{submitLabel}</Button>
    </form>
  );
}
