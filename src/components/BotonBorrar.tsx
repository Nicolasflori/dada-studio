"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { useToast } from "./ToastProvider";

export default function BotonBorrar({
  id,
  accion,
  confirmar,
}: {
  id: string;
  accion: (id: string) => Promise<{ ok: boolean }>;
  confirmar: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [pending, startTransition] = useTransition();
  const mostrarToast = useToast();
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="text-xs font-medium text-red-700 underline decoration-dotted hover:text-red-800"
      >
        Borrar
      </button>

      <Modal open={abierto} onClose={() => setAbierto(false)} title="¿Confirmás?">
        <p className="text-sm text-ink-700">{confirmar}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setAbierto(false)}
            className="rounded-sm border-2 border-ink-900 bg-surface px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const resultado = await accion(id);
                setAbierto(false);
                mostrarToast(resultado.ok ? "Se borró correctamente." : "No se pudo borrar.", resultado.ok);
                if (resultado.ok) router.refresh();
              })
            }
            className="rounded-sm border-2 border-ink-900 bg-red-500 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-paper disabled:opacity-60"
          >
            {pending ? "Borrando..." : "Borrar"}
          </button>
        </div>
      </Modal>
    </>
  );
}
