import { z } from "zod";

export const checkoutSchema = z
  .object({
    customer_name: z.string().min(3, "Ingresa tu nombre completo"),
    customer_phone: z.string().min(6, "Ingresa un telefono valido"),
    order_type: z.enum(["Delivery", "Retiro"]),
    address: z.string().optional(),
    zone: z.string().optional(),
    reference: z.string().optional(),
    map_link: z.string().url("Debe ser un enlace valido").optional().or(z.literal("")),
    payment_method: z.enum(["Efectivo", "Transferencia", "Tarjeta al recibir"]),
    cash_amount: z.coerce.number().optional(),
    order_schedule_type: z.enum(["Lo antes posible", "Programado"]),
    scheduled_date: z.string().optional(),
    scheduled_time: z.string().optional(),
    general_notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.order_type === "Delivery") {
      if (!data.address || data.address.length < 5) {
        ctx.addIssue({ code: "custom", path: ["address"], message: "Ingresa la direccion de entrega" });
      }
      if (!data.zone) {
        ctx.addIssue({ code: "custom", path: ["zone"], message: "Selecciona una zona o barrio" });
      }
    }
    if (data.payment_method === "Efectivo" && (!data.cash_amount || data.cash_amount <= 0)) {
      ctx.addIssue({ code: "custom", path: ["cash_amount"], message: "Indica con cuanto vas a pagar" });
    }
    if (data.order_schedule_type === "Programado" && (!data.scheduled_date || !data.scheduled_time)) {
      ctx.addIssue({ code: "custom", path: ["scheduled_date"], message: "Selecciona fecha y hora" });
    }
  });

export type CheckoutValues = z.infer<typeof checkoutSchema>;
