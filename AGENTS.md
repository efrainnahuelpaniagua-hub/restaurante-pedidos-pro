# Reglas del Proyecto

- Mantener TypeScript estricto y resolver errores de tipos antes de cerrar cambios.
- No exponer claves privadas ni `SUPABASE_SERVICE_ROLE_KEY` en componentes cliente.
- Mantener RLS activa en todas las tablas publicas de Supabase.
- No crear endpoints ni Server Actions que permitan operaciones admin sin validar sesion y rol.
- Ejecutar `npm run lint` y `npm run build` antes de entregar cambios relevantes.
- Preservar responsive mobile, tablet y desktop.
- Mantener el estilo visual de componentes, botones, cards, formularios y estados vacios.
- No romper integracion Supabase, Auth, Storage ni el flujo de pedidos.
- Mantener el carrito persistente y la generacion de WhatsApp probada.
- Agregar comentarios solo cuando aclaren logica compleja.
