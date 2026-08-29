"use client";

import { useActionState, useState } from "react";
import { crearProfesor } from "./actions";

const estadoInicial = { ok: false, mensaje: "" };

export default function NuevoProfesorForm() {
  const [abierto, setAbierto] = useState(false);
  const [estado, formAction, enviando] = useActionState(crearProfesor, estadoInicial);

  return (
    <div>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="rounded-sm border-2 border-ink-900 bg-red-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-paper shadow-[3px_3px_0_0_var(--ink-900)] transition-transform hover:-translate-y-0.5"
      >
        {abierto ? "Cancelar" : "+ Nuevo profesor"}
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
