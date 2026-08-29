"use client";

import { useTransition } from "react";
import { alternarLiquidado } from "./actions";

export default function SelloLiquidacion({ pagoId, liquidado }: { pagoId: string; liquidado: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await alternarLiquidado(pagoId, !liquidado);
        })
      }
      className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-wide transition-opacity disabled:opacity-50 ${
        liquidado ? "-rotate-2 bg-ink-900 text-ink-50" : "rotate-2 bg-red-100 text-red-700"
      }`}
      title="Click para marcar si ya se le pagó al profesor"
    >
      {liquidado ? "Pagado" : "Pendiente"}
    </button>
  );
}
