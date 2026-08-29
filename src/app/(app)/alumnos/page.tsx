import { getAlumnos, getClases, getInscripciones, getProfesorActual, getProfesores } from "@/lib/data";
import NuevoAlumnoForm from "./NuevoAlumnoForm";
import AlumnoRow from "./AlumnoRow";

export default async function AlumnosPage() {
  const [alumnos, profesores, clases, inscripciones, profesorActual] = await Promise.all([
    getAlumnos(),
    getProfesores(),
    getClases(),
    getInscripciones(),
    getProfesorActual(),
  ]);
  const esDueña = profesorActual?.rol === "dueño";

  const nombreProfesor = (id: string) => profesores.find((p) => p.id === id)?.nombre ?? "—";
  const clasesDe = (alumnoId: string) =>
    inscripciones
      .filter((i) => i.alumno_id === alumnoId)
      .map((i) => clases.find((c) => c.id === i.clase_id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-medium text-ink-900">Alumnos</h1>
        <NuevoAlumnoForm clases={clases} profesores={profesores} rolActual={profesorActual?.rol ?? "externo"} />
      </div>

      <div className="mt-6 rounded-sm border-2 border-ink-900 bg-surface p-3 shadow-[4px_4px_0_0_var(--ink-900)] md:p-5">
        {alumnos.length === 0 ? (
          <p className="text-sm text-ink-500">Todavía no hay alumnos cargados.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-ink-400">
                <th className="pb-2 font-medium">Nombre</th>
                <th className="pb-2 font-medium">Profesor</th>
                <th className="pb-2 font-medium">Clase</th>
                <th className="pb-2 font-medium">Contacto</th>
                <th className="pb-2 font-medium">Desde</th>
                <th className="pb-2 font-medium">Estado</th>
                {esDueña && <th className="pb-2 font-medium">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {alumnos.map((a) => {
                const clasesDelAlumno = clasesDe(a.id);
                const clasesTexto =
                  clasesDelAlumno.length > 0
                    ? clasesDelAlumno.map((c) => `${c.nombre} (${c.dia} ${c.hora.slice(0, 5)})`).join(", ")
                    : "sin clase";
                return (
                  <AlumnoRow
                    key={a.id}
                    alumno={a}
                    nombreProfesor={nombreProfesor(a.profesor_id)}
                    clasesTexto={clasesTexto}
                    esDueña={esDueña}
                  />
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
