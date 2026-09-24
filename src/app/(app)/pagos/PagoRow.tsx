"use client";

import { useActionState, useState } from "react";
import { editarPago, borrarPago } from "./actions";
import BotonBorrar from "@/components/BotonBorrar";
import Modal from "@/components/Modal";
import { useFeedbackDeAccion } from "@/lib/useFeedbackDeAccion";
import SelloLiquidacion from "./SelloLiquidacion";
import type { Pago } from "@/lib/types";

const estadoInicial = { ok: false, mensaje: "" };
const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default function PagoRow({
  pago,
  nombreAlumno,
  nombreProfesor,
  montoTaller,
  montoProfesor,
  esDueña,
}: {
  pago: Pago;
  nombreAlumno: string;
  nombreProfesor: string;
  montoTaller: number;
  montoProfesor: number;
  esDueña: boolean;
}) {
  const [editando, setEditando] = useState(false);
  const [estado, formAction, enviando] = useActionState(editarPago, estadoInicial);
  const hayReparto = montoProfesor > 0;

  useFeedbackDeAccion(estado, () => setEditando(false));

  return (
    <tr className="border-t border-ink-50 align-top">
      <td className="py-2 font-medium text-ink-800">{nombreAlumno}</td>
      <td className="py-2 text-ink-600">{nombreProfesor}</td>
      <td className="py-2 text-ink-800">{formatoMoneda.format(pago.monto)}</td>
      <td className="py-2 text-xs text-ink-500">
        {hayReparto ? (
          <>
            <span className="font-medium text-ink-700">Profesor: {formatoMoneda.format(montoProfesor)}</span>
            <br />
            estudio: {formatoMoneda.format(montoTaller)}
          </>
        ) : (
          "queda todo en el estudio"
        )}
      </td>
      <td className="py-2 text-ink-500">{pago.fecha}</td>
      <td className="py-2">
        {hayReparto ? (
          <SelloLiquidacion pagoId={pago.id} liquidado={pago.liquidado} />
        ) : (
          <span className="text-xs text-ink-400">—</span>
        )}
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
              id={pago.id}
              accion={borrarPago}
              confirmar={`¿Borrar el pago de ${nombreAlumno} por ${formatoMoneda.format(pago.monto)}?`}
            />

            <Modal open={editando} onClose={() => setEditando(false)} title="Editar pago">
              <form action={formAction} className="flex flex-col gap-4">
                <input type="hidden" name="id" value={pago.id} />
                <div className="flex gap-3">
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="text-xs text-ink-500">Monto</label>
                    <input
                      name="monto"
                      type="number"
                      min="0"
                      step="1"
                      required
                      defaultValue={pago.monto}
                      className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="text-xs text-ink-500">Fecha</label>
                    <input
                      name="fecha"
                      type="date"
                      required
                      defaultValue={pago.fecha}
                      className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-ink-500">Medio</label>
                  <input
                    name="medio_pago"
                    defaultValue={pago.medio_pago ?? ""}
                    className="rounded-sm border-2 border-ink-900 bg-surface px-2 py-1.5 text-sm text-ink-900 outline-none focus:border-red-600"
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
        </td>
      )}
    </tr>
  );
}
