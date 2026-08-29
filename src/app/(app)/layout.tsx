import Sidebar from "@/components/Sidebar";
import { getProfesorActual } from "@/lib/data";
import { cerrarSesion } from "./actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profesor = await getProfesorActual();

  if (!profesor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
        <div className="max-w-sm rounded-sm border-2 border-ink-900 bg-surface p-6 text-center shadow-[4px_4px_0_0_var(--ink-900)]">
          <p className="font-display text-xl text-ink-900">Tu cuenta no está habilitada todavía</p>
          <p className="mt-2 text-sm text-ink-600">
            Pedile a Denise que te agregue como profesor desde la pantalla de Profesores, con el mismo email
            que usaste para entrar.
          </p>
          <form action={cerrarSesion}>
            <button type="submit" className="mt-4 text-sm text-red-700 underline">
              Volver a intentar con otro email
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar nombreUsuario={profesor.nombre} />
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
