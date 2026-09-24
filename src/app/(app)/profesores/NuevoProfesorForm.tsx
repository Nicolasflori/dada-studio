"use client";

import { useActionState, useRef, useState } from "react";
import { crearProfesor } from "./actions";
import Modal from "@/components/Modal";
import { useFeedbackDeAccion } from "@/lib/useFeedbackDeAccion";

const estadoInicial = { ok: false, mensaje: "" };

export default function NuevoProfesorForm() {
  const [abierto, setAbierto] = useState(false);
  const [estado, formAction, enviando] = useActionState(crearProfesor, estadoInicial);
  const formRef = useRef<HTMLFormElement>(null);

  useFeedbackDeAccion(estado, () => {
    setAbierto(false);
    formRef.current?.reset();
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-2 rounded-sm border-2 border-ink-900 bg-red-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-paper shadow-[3px_3px_0_0_var(--ink-900)] transition-transform hover:-translate-y-0.5"
      >
        <span className="text-base leading-none">+</span> Nuevo profesor
      </button>

      <Modal open={abierto} onClose={() => setAbierto(false)} title="Nuevo profesor">
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Nombre</label>
            <input
              name="nombre"
              required
              className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Email</label>
            <input
              name="email"
              type="email"
              required
              className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">% para el estudio</label>
            <input
              name="porcentaje_taller"
              type="number"
              min="0"
              max="100"
              defaultValue={50}
              required
              className="w-20 rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
            />
          </div>
          <button
            type="submit"
            disabled={enviando}
            className="mt-1 rounded-sm border-2 border-ink-900 bg-ink-900 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink-50 disabled:opacity-60"
          >
            {enviando ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </Modal>
    </>
  );
}
