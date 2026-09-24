"use client";

import { useActionState, useRef, useState } from "react";
import { crearAlumno } from "./actions";
import Modal from "@/components/Modal";
import { useFeedbackDeAccion } from "@/lib/useFeedbackDeAccion";
import type { Clase, Profesor, Rol } from "@/lib/types";

const estadoInicial = { ok: false, mensaje: "" };

export default function NuevoAlumnoForm({
  clases,
  profesores,
  rolActual,
}: {
  clases: Clase[];
  profesores: Profesor[];
  rolActual: Rol;
}) {
  const [abierto, setAbierto] = useState(false);
  const [estado, formAction, enviando] = useActionState(crearAlumno, estadoInicial);
  const formRef = useRef<HTMLFormElement>(null);

  const nombreProfesor = (id: string) => profesores.find((p) => p.id === id)?.nombre ?? "—";

  useFeedbackDeAccion(estado, () => {
    setAbierto(false);
    formRef.current?.reset();
  });

  if (clases.length === 0) {
    return (
      <p className="max-w-xs text-right text-xs text-ink-500">
        {rolActual === "dueño"
          ? "Creá una clase primero desde Horarios."
          : "Todavía no tenés ninguna clase creada. Pedile a Denise que te cree una en Horarios."}
      </p>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-2 rounded-sm border-2 border-ink-900 bg-red-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-paper shadow-[3px_3px_0_0_var(--ink-900)] transition-transform hover:-translate-y-0.5"
      >
        <span className="text-base leading-none">+</span> Nuevo alumno
      </button>

      <Modal open={abierto} onClose={() => setAbierto(false)} title="Nuevo alumno">
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
            <label className="text-xs text-ink-500">Contacto</label>
            <input
              name="contacto"
              placeholder="teléfono"
              className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Clase</label>
            <select
              name="clase_id"
              required
              className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
            >
              {clases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} — {nombreProfesor(c.profesor_id)} — {c.dia} {c.hora.slice(0, 5)}
                </option>
              ))}
            </select>
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
