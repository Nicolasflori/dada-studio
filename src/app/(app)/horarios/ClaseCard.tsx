"use client";

import { useActionState, useState } from "react";
import { editarClase, borrarClase } from "./actions";
import BotonBorrar from "@/components/BotonBorrar";
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

  return (
    <li className="rounded-lg bg-ink-50 px-3 py-2 text-xs">
      <p className="font-medium text-ink-800">
        {clase.hora.slice(0, 5)} — {clase.nombre}
      </p>
      <p className="text-ink-500">{nombreProfesor}</p>
      <p className="mt-1 text-ink-500">{nombresAlumnos.length > 0 ? nombresAlumnos.join(", ") : "sin alumnos anotados"}</p>

      {esDueña && (
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditando((v) => !v)}
            className="font-medium text-ink-700 underline decoration-dotted hover:text-red-700"
          >
            {editando ? "Cerrar" : "Editar"}
          </button>
          <BotonBorrar
            id={clase.id}
            accion={borrarClase}
            confirmar={`¿Borrar la clase "${clase.nombre}"? También se borran las inscripciones de sus alumnos.`}
          />
        </div>
      )}

      {editando && (
        <form action={formAction} className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-3">
          <input type="hidden" name="id" value={clase.id} />
          <input
            name="nombre"
            required
            defaultValue={clase.nombre}
            className="rounded-sm border-2 border-ink-900 px-2 py-1.5 text-xs outline-none focus:border-red-600"
          />
          <select
            name="profesor_id"
            defaultValue={clase.profesor_id}
            className="rounded-sm border-2 border-ink-900 px-2 py-1.5 text-xs outline-none focus:border-red-600"
          >
            {profesores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <select
              name="dia"
              defaultValue={clase.dia}
              className="w-full rounded-sm border-2 border-ink-900 px-2 py-1.5 text-xs capitalize outline-none focus:border-red-600"
            >
              {DIAS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <input
              name="hora"
              type="time"
              defaultValue={clase.hora.slice(0, 5)}
              className="w-full rounded-sm border-2 border-ink-900 px-2 py-1.5 text-xs outline-none focus:border-red-600"
            />
          </div>
          <button
            type="submit"
            disabled={enviando}
            className="rounded-sm border-2 border-ink-900 bg-ink-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-50 disabled:opacity-60"
          >
            {enviando ? "Guardando..." : "Guardar"}
          </button>
          {estado.mensaje && (
            <p className={estado.ok ? "text-ink-600" : "text-red-700"}>{estado.mensaje}</p>
          )}
        </form>
      )}
    </li>
  );
}
