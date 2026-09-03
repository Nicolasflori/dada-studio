"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { crearClase } from "./actions";
import Modal from "@/components/Modal";
import { useToast } from "@/components/ToastProvider";
import type { Profesor } from "@/lib/types";
import { DIAS } from "@/lib/types";

const estadoInicial = { ok: false, mensaje: "" };

export default function NuevaClaseForm({ profesores }: { profesores: Profesor[] }) {
  const [abierto, setAbierto] = useState(false);
  const [estado, formAction, enviando] = useActionState(crearClase, estadoInicial);
  const formRef = useRef<HTMLFormElement>(null);
  const mostrarToast = useToast();

  useEffect(() => {
    if (!estado.mensaje) return;
    mostrarToast(estado.mensaje, estado.ok);
    if (estado.ok) {
      setAbierto(false);
      formRef.current?.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-2 rounded-sm border-2 border-ink-900 bg-red-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-paper shadow-[3px_3px_0_0_var(--ink-900)] transition-transform hover:-translate-y-0.5"
      >
        <span className="text-base leading-none">+</span> Nueva clase
      </button>

      <Modal open={abierto} onClose={() => setAbierto(false)} title="Nueva clase">
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
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
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs text-ink-500">Día</label>
              <select
                name="dia"
                required
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
                required
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
    </>
  );
}
