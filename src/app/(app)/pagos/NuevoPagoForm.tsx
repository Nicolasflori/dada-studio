"use client";

import { useActionState, useState } from "react";
import { crearPago } from "./actions";
import type { Alumno } from "@/lib/types";

const estadoInicial = { ok: false, mensaje: "" };
const hoy = () => new Date().toISOString().slice(0, 10);

export default function NuevoPagoForm({ alumnos }: { alumnos: Alumno[] }) {
  const [abierto, setAbierto] = useState(false);
  const [estado, formAction, enviando] = useActionState(crearPago, estadoInicial);

  return (
    <div>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="rounded-sm border-2 border-ink-900 bg-red-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-paper shadow-[3px_3px_0_0_var(--ink-900)] transition-transform hover:-translate-y-0.5"
      >
        {abierto ? "Cancelar" : "+ Registrar pago"}
      </button>

      {abierto && (
        <form
          action={formAction}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-sm border-2 border-ink-900 bg-surface p-4 shadow-[4px_4px_0_0_var(--ink-900)]"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Alumno</label>
            <select
              name="alumno_id"
              required
              className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
            >
              <option value="">Elegir...</option>
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Monto</label>
            <input
              name="monto"
              type="number"
              min="0"
              step="1"
              required
              className="w-28 rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Fecha</label>
            <input
              name="fecha"
              type="date"
              required
              defaultValue={hoy()}
              className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Medio</label>
            <input
              name="medio_pago"
              placeholder="efectivo, transferencia..."
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
