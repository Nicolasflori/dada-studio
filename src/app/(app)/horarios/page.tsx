import { getAlumnos, getClases, getInscripciones, getProfesorActual, getProfesores } from "@/lib/data";
import { DIAS } from "@/lib/types";
import { agruparPor, indexarPorId } from "@/lib/utils";
import NuevaClaseForm from "./NuevaClaseForm";
import ClaseCard from "./ClaseCard";

export default async function HorariosPage() {
  const [alumnos, clases, inscripciones, profesores, profesorActual] = await Promise.all([
    getAlumnos(),
    getClases(),
    getInscripciones(),
    getProfesores(),
    getProfesorActual(),
  ]);
  const esDueña = profesorActual?.rol === "dueño";

  const profesoresPorId = indexarPorId(profesores);
  const alumnosPorId = indexarPorId(alumnos);
  const inscripcionesPorClase = agruparPor(inscripciones, (i) => i.clase_id);
  const clasesPorDia = agruparPor(clases, (c) => c.dia);

  const nombreProfesor = (id: string) => profesoresPorId.get(id)?.nombre ?? "—";
  const alumnosDeClase = (claseId: string) =>
    (inscripcionesPorClase.get(claseId) ?? [])
      .map((i) => alumnosPorId.get(i.alumno_id)?.nombre)
      .filter((n): n is string => Boolean(n));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-900">Horarios</h1>
          <p className="mt-1 text-sm text-ink-500">Clases de la semana, todos los profesores del espacio</p>
        </div>
        {esDueña && <NuevaClaseForm profesores={profesores} />}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DIAS.map((dia) => {
          const clasesDelDia = clasesPorDia.get(dia) ?? [];
          return (
            <div key={dia} className="rounded-sm border-2 border-ink-900 bg-surface p-4 shadow-[4px_4px_0_0_var(--ink-900)]">
              <h2 className="text-sm font-semibold capitalize text-ink-700">{dia}</h2>
              {clasesDelDia.length === 0 ? (
                <p className="mt-3 text-xs text-ink-400">Sin clases</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {clasesDelDia.map((c) => (
                    <ClaseCard
                      key={c.id}
                      clase={c}
                      nombreProfesor={nombreProfesor(c.profesor_id)}
                      nombresAlumnos={alumnosDeClase(c.id)}
                      profesores={profesores}
                      esDueña={esDueña}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
