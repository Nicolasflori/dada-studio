"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: number; mensaje: string; ok: boolean };
type MostrarToast = (mensaje: string, ok: boolean) => void;

const ToastContext = createContext<MostrarToast>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const mostrarToast = useCallback<MostrarToast>((mensaje, ok) => {
    const id = Date.now();
    setToast({ id, mensaje, ok });
    setTimeout(() => {
      setToast((actual) => (actual?.id === id ? null : actual));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={mostrarToast}>
      {children}
      {toast && (
        <div
          key={toast.id}
          role="status"
          className={`fixed bottom-6 right-6 z-[60] max-w-xs rotate-1 rounded-sm border-2 border-ink-900 px-4 py-3 text-sm font-semibold shadow-[4px_4px_0_0_var(--ink-900)] animate-[entrada_0.2s_ease-out] ${
            toast.ok ? "bg-ink-900 text-ink-50" : "bg-red-100 text-red-700"
          }`}
        >
          {toast.mensaje}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
