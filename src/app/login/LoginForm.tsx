"use client";

import { useActionState } from "react";
import { iniciarSesion } from "./actions";

const estadoInicial = { ok: false, mensaje: "" };

export default function LoginForm() {
  const [estado, formAction, enviando] = useActionState(iniciarSesion, estadoInicial);

  return (
    <form
      action={formAction}
      className="mt-10 rounded-sm border-2 border-ink-900 bg-surface p-6 shadow-[4px_4px_0_0_var(--ink-900)]"
    >
      <label htmlFor="email" className="text-sm font-medium text-ink-700">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="vos@email.com"
        className="mt-2 w-full rounded-sm border-2 border-ink-900 bg-surface px-3 py-2 text-sm text-ink-900 outline-none focus:border-red-600"
      />

      <label htmlFor="password" className="mt-4 block text-sm font-medium text-ink-700">
        Contraseña
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        className="mt-2 w-full rounded-sm border-2 border-ink-900 bg-surface px-3 py-2 text-sm text-ink-900 outline-none focus:border-red-600"
      />

      <button
        type="submit"
        disabled={enviando}
        className="mt-4 w-full rounded-sm border-2 border-ink-900 bg-red-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-paper shadow-[3px_3px_0_0_var(--ink-900)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {enviando ? "Entrando..." : "Iniciar sesión"}
      </button>

      {estado.mensaje && (
        <p className={`mt-3 text-sm ${estado.ok ? "text-ink-700" : "text-red-700"}`}>{estado.mensaje}</p>
      )}
    </form>
  );
}
