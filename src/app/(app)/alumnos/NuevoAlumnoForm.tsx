"use client";

import { useActionState, useState } from "react";
import { crearAlumno } from "./actions";
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

  const nombreProfesor = (id: string) => profesores.find((p) => p.id === id)?.nombre ?? "—";

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
    <div>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="rounded-sm border-2 border-ink-900 bg-red-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-paper shadow-[3px_3px_0_0_var(--ink-900)] transition-transform hover:-translate-y-0.5"
      >
        {abierto ? "Cancelar" : "+ Nuevo alumno"}
      </button>

      {abierto && (
        <form
          action={formAction}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-sm border-2 border-ink-900 bg-surface p-4 shadow-[4px_4px_0_0_var(--ink-900)]"
        >
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
            className="rounded-sm border-2 border-ink-900 bg-ink-900 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink-50 disabled:opacity-60"
          >
            {enviando ? "Guardando..." : "Guardar"}
          </button>
          {estado.mensaje && (
            <p className={`w-full text-xs ${estado.ok ? "text-ink-600" : "text-red-700"}`}>{estado.mensaje}</p>
          )}
        </form>
      )}
    </div>
  );
}
