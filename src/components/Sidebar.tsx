"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cerrarSesion } from "@/app/(app)/actions";

const links = [
  { href: "/", label: "Resumen" },
  { href: "/alumnos", label: "Alumnos" },
  { href: "/horarios", label: "Horarios" },
  { href: "/pagos", label: "Pagos" },
  { href: "/profesores", label: "Profesores" },
];

export default function Sidebar({ nombreUsuario }: { nombreUsuario: string }) {
  const pathname = usePathname();
  const [esOscuro, setEsOscuro] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    setEsOscuro(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  function alternarTema() {
    const nuevo = !esOscuro;
    document.documentElement.classList.toggle("dark", nuevo);
    localStorage.setItem("tema", nuevo ? "dark" : "light");
    setEsOscuro(nuevo);
  }

  return (
    <>
      <div className="flex items-center justify-between border-b-2 border-ink-900 bg-ink-50 p-4 md:hidden">
        <p className="font-logo text-2xl leading-none text-red-500">DADÁ STUDIO</p>
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
          className="rounded-sm border-2 border-ink-900 bg-surface p-2 text-ink-900"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {abierto && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/50 md:hidden"
          onClick={() => setAbierto(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r-2 border-ink-900 bg-ink-50 p-4 transition-transform duration-200 md:relative md:z-auto md:translate-x-0 ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 -rotate-1 px-2">
          <p className="font-logo text-6xl leading-none text-red-500">DADÁ</p>
          <p className="-mt-1 font-logo text-2xl leading-none tracking-widest text-ink-900">STUDIO</p>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-sm px-3 py-2 text-sm uppercase tracking-wide transition-colors ${
                  active ? "bg-red-500 text-paper" : "text-ink-700 hover:bg-ink-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={alternarTema}
          className="mt-auto rounded-sm border-2 border-ink-900 bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-700 hover:text-red-600"
        >
          {esOscuro ? "Modo claro" : "Modo oscuro"}
        </button>

        <div className="mt-4 border-t-2 border-ink-100 pt-4">
          <p className="truncate text-sm font-medium text-ink-800">{nombreUsuario}</p>
          <form action={cerrarSesion}>
            <button type="submit" className="mt-1 text-xs text-ink-500 underline hover:text-red-600">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
