"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ToastProvider";

type EstadoAccion = { ok: boolean; mensaje: string };

// Los formularios de crear/editar usan useActionState y todos necesitan lo
// mismo cuando la Server Action responde: mostrar un toast y, si salió bien,
// cerrar el modal o limpiar el formulario. Antes ese useEffect estaba
// duplicado (idéntico, con el mismo eslint-disable) en 8 componentes.
export function useFeedbackDeAccion(estado: EstadoAccion, alExito?: () => void) {
  const mostrarToast = useToast();

  useEffect(() => {
    if (!estado.mensaje) return;
    mostrarToast(estado.mensaje, estado.ok);
    if (estado.ok) alExito?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);
}
