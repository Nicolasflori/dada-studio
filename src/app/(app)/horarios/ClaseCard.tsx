"use client";

import { useActionState, useState } from "react";
import { editarClase, borrarClase } from "./actions";
import BotonBorrar from "@/components/BotonBorrar";
import Modal from "@/components/Modal";
import { useFeedbackDeAccion } from "@/lib/useFeedbackDeAccion";
import { DIAS } from "@/lib/types";
import type { Clase, Profesor } from "@/lib/types";

const estadoInicial = { ok: false, mensaje: "" };

export default function ClaseCard({
  clase,
  nombreProfesor,
  nombresAlumnos,
  profesores,
  esDueña,
}: {
  clase: Clase;
  nombreProfesor: string;
  nombresAlumnos: string[];
  profesores: Profesor[];
  esDueña: boolean;
}) {
  const [editando, setEditando] = useState(false);
  const [estado, formAction, enviando] = useActionState(editarClase, estadoInicial);

  useFeedbackDeAccion(estado, () => setEditando(false));

  return (
    <li className="border-l-4 border-red-500 bg-ink-50 px-3 py-2 text-xs">
      <p className="font-display text-base leading-none text-ink-900">
        {clase.hora.slice(0, 5)} — {clase.nombre}
      </p>
      <p className="mt-1 text-ink-500">{nombreProfesor}</p>
      <p className="mt-1 text-ink-500">
        {nombresAlumnos.length > 0 ? nombresAlumnos.join(", ") : "sin alumnos anotados"}
      </p>

      {esDueña && (
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="font-medium text-ink-700 underline decoration-dotted hover:text-red-700"
          >
            Editar
          </button>
          <BotonBorrar
            id={clase.id}
            accion={borrarClase}
            confirmar={`¿Borrar la clase "${clase.nombre}"? También se borran las inscripciones de sus alumnos.`}
          />

          <Modal open={editando} onClose={() => setEditando(false)} title="Editar clase">
            <form action={formAction} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={clase.id} />
              <div className="flex flex-col gap-1">
                <label className="text-xs text-ink-500">Nombre</label>
                <input
                  name="nombre"
                  required
                  defaultValue={clase.nombre}
                  className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-ink-500">Profesor</label>
                <select
                  name="profesor_id"
                  defaultValue={clase.profesor_id}
                  className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
                >
                  {profesores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-xs text-ink-500">Día</label>
                  <select
                    name="dia"
                    defaultValue={clase.dia}
                    className="w-full rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm capitalize text-ink-900 outline-none focus:border-red-600"
                  >
                    {DIAS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-xs text-ink-500">Hora</label>
                  <input
                    name="hora"
                    type="time"
                    defaultValue={clase.hora.slice(0, 5)}
                    className="w-full rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
                  />
                </div>
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
      )}
    </li>
  );
}
