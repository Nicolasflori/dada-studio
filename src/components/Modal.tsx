"use client";

import { useEffect } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative max-h-[90vh] w-full max-w-lg -rotate-1 overflow-y-auto rounded-sm border-2 border-ink-900 bg-surface p-6 shadow-[6px_6px_0_0_var(--ink-900)]"
      >
        <div className="flex items-start justify-between gap-4">
          {title && <h2 className="font-display text-xl font-medium text-ink-900">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="ml-auto rounded-sm border-2 border-ink-900 bg-surface px-2 py-1 text-sm font-bold leading-none text-ink-900 hover:text-red-600"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
