"use client";

import { useTransition } from "react";

export default function BotonBorrar({
  id,
  accion,
  confirmar,
}: {
  id: string;
  accion: (id: string) => Promise<{ ok: boolean }>;
  confirmar: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmar)) {
          startTransition(async () => {
            await accion(id);
          });
        }
      }}
      className="text-xs font-medium text-red-700 underline decoration-dotted hover:text-red-800 disabled:opacity-50"
    >
      {pending ? "Borrando..." : "Borrar"}
    </button>
  );
}
