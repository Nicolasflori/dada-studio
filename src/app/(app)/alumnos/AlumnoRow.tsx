"use client";

import { useActionState, useEffect, useState } from "react";
import { editarAlumno, borrarAlumno } from "./actions";
import BotonBorrar from "@/components/BotonBorrar";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import type { Alumno } from "@/lib/types";

const estadoInicial = { ok: false, mensaje: "" };

export default function AlumnoRow({
  alumno,
  nombreProfesor,
  clasesTexto,
  esDueña,
}: {
  alumno: Alumno;
  nombreProfesor: string;
  clasesTexto: string;
  esDueña: boolean;
}) {
  const [editando, setEditando] = useState(false);
  const [estado, formAction, enviando] = useActionState(editarAlumno, estadoInicial);
  const mostrarToast = useToast();

  useEffect(() => {
    if (!estado.mensaje) return;
    mostrarToast(estado.mensaje, estado.ok);
    if (estado.ok) setEditando(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  return (
    <tr className="border-t border-ink-50">
      <td className="py-2 font-medium text-ink-800">{alumno.nombre}</td>
      <td className="py-2 text-ink-600">{nombreProfesor}</td>
      <td className="py-2 text-ink-600">{clasesTexto}</td>
      <td className="py-2 text-ink-500">{alumno.contacto ?? "—"}</td>
      <td className="py-2 text-ink-500">{alumno.fecha_inicio}</td>
      <td className="py-2">
        <span
          className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
            alumno.activo ? "-rotate-2 bg-ink-900 text-ink-50" : "bg-ink-100 text-ink-500"
          }`}
        >
          {alumno.activo ? "Activo" : "Inactivo"}
        </span>
      </td>
      {esDueña && (
        <td className="py-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="text-xs font-medium text-ink-700 underline decoration-dotted hover:text-red-700"
            >
              Editar
            </button>
            <BotonBorrar
              id={alumno.id}
              accion={borrarAlumno}
              confirmar={`¿Borrar a ${alumno.nombre}? También se borran sus pagos e inscripciones.`}
            />

            <Modal open={editando} onClose={() => setEditando(false)} title="Editar alumno">
              <form action={formAction} className="flex flex-col gap-4">
                <input type="hidden" name="id" value={alumno.id} />
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-ink-500">Nombre</label>
                  <input
                    name="nombre"
                    required
                    defaultValue={alumno.nombre}
                    className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-ink-500">Contacto</label>
                  <input
                    name="contacto"
                    defaultValue={alumno.contacto ?? ""}
                    className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-ink-700">
                  <input type="checkbox" name="activo" defaultChecked={alumno.activo} className="h-4 w-4" />
                  Activo
                </label>
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
        </td>
      )}
    </tr>
  );
}
