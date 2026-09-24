"use client";

import { useActionState, useState } from "react";
import { editarProfesor, borrarProfesor } from "./actions";
import BotonBorrar from "@/components/BotonBorrar";
import Modal from "@/components/Modal";
import { useFeedbackDeAccion } from "@/lib/useFeedbackDeAccion";
import type { Profesor } from "@/lib/types";

const estadoInicial = { ok: false, mensaje: "" };
const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default function ProfesorCard({
  profesor,
  alumnosActivos,
  pendiente,
  esDueña,
}: {
  profesor: Profesor;
  alumnosActivos: number;
  pendiente: number;
  esDueña: boolean;
}) {
  const [editando, setEditando] = useState(false);
  const [estado, formAction, enviando] = useActionState(editarProfesor, estadoInicial);
  const sinConfirmar = !profesor.user_id;

  useFeedbackDeAccion(estado, () => setEditando(false));

  return (
    <div className="rounded-sm border-2 border-ink-900 bg-surface p-5 shadow-[4px_4px_0_0_var(--ink-900)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-ink-800">{profesor.nombre}</p>
          <p className="text-xs text-ink-500">{profesor.email}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium capitalize text-ink-600">
            {profesor.rol}
          </span>
          {sinConfirmar && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              sin confirmar
            </span>
          )}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-ink-400">% para el estudio</dt>
          <dd className="font-medium text-ink-800">{profesor.porcentaje_taller}%</dd>
        </div>
        <div>
          <dt className="text-ink-400">% para el profesor</dt>
          <dd className="font-medium text-ink-800">{100 - profesor.porcentaje_taller}%</dd>
        </div>
        <div>
          <dt className="text-ink-400">Alumnos activos</dt>
          <dd className="font-medium text-ink-800">{alumnosActivos}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Pendiente de pagarle</dt>
          <dd className="font-medium text-ink-800">{formatoMoneda.format(pendiente)}</dd>
        </div>
      </dl>

      {esDueña && (
        <div className="mt-4 flex items-center gap-3 border-t border-ink-100 pt-3">
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="text-xs font-medium text-ink-700 underline decoration-dotted hover:text-red-700"
          >
            Editar
          </button>
          {profesor.rol === "externo" && (
            <BotonBorrar
              id={profesor.id}
              accion={borrarProfesor}
              confirmar={`¿Borrar a ${profesor.nombre}? También se borran sus alumnos, clases y pagos.`}
            />
          )}
        </div>
      )}

      <Modal open={editando} onClose={() => setEditando(false)} title="Editar profesor">
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={profesor.id} />
          <div className="flex flex-col gap-1">
            <label className="text-xs text-ink-500">Nombre</label>
            <input
              name="nombre"
              required
              defaultValue={profesor.nombre}
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
              required
              defaultValue={profesor.porcentaje_taller}
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
    </div>
  );
}
