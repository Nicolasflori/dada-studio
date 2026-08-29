"use client";

import { useActionState, useState } from "react";
import { crearClase } from "./actions";
import type { Profesor } from "@/lib/types";
import { DIAS } from "@/lib/types";

const estadoInicial = { ok: false, mensaje: "" };

export default function NuevaClaseForm({ profesores }: { profesores: Profesor[] }) {
  const [abierto, setAbierto] = useState(false);
  const [estado, formAction, enviando] = useActionState(crearClase, estadoInicial);

  return (
    <div>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="rounded-sm border-2 border-ink-900 bg-red-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-paper shadow-[3px_3px_0_0_var(--ink-900)] transition-transform hover:-translate-y-0.5"
      >
        {abierto ? "Cancelar" : "+ Nueva clase"}
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
              placeholder="Pintura, Piano, Cerámica..."
              required
              className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Profesor</label>
            <select
              name="profesor_id"
              required
              className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
            >
              {profesores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Día</label>
            <select
              name="dia"
              required
              className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 capitalize outline-none focus:border-red-600"
            >
              {DIAS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Hora</label>
            <input
              name="hora"
              type="time"
              required
              className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
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
