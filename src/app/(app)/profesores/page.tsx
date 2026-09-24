import { getAlumnos, getPagos, getProfesorActual, getProfesores } from "@/lib/data";
import { agruparPor } from "@/lib/utils";
import NuevoProfesorForm from "./NuevoProfesorForm";
import ProfesorCard from "./ProfesorCard";

export default async function ProfesoresPage() {
  const [profesores, alumnos, pagos, profesorActual] = await Promise.all([
    getProfesores(),
    getAlumnos(),
    getPagos(),
    getProfesorActual(),
  ]);
  const esDueña = profesorActual?.rol === "dueño";

  const alumnosActivosPorProfesor = agruparPor(
    alumnos.filter((a) => a.activo),
    (a) => a.profesor_id,
  );
  const pagosPendientesPorProfesor = agruparPor(
    pagos.filter((p) => !p.liquidado),
    (p) => p.profesor_id,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-medium text-ink-900">Profesores</h1>
        {esDueña && <NuevoProfesorForm />}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {profesores.map((prof) => {
          const alumnosDelProfesor = alumnosActivosPorProfesor.get(prof.id) ?? [];
          const pagosPendientes = pagosPendientesPorProfesor.get(prof.id) ?? [];
          const pctProfesor = 1 - prof.porcentaje_taller / 100;
          const pendiente = pagosPendientes.reduce((acc, p) => acc + p.monto * pctProfesor, 0);

          return (
            <ProfesorCard
              key={prof.id}
              profesor={prof}
              alumnosActivos={alumnosDelProfesor.length}
              pendiente={pendiente}
              esDueña={esDueña}
            />
          );
        })}
      </div>
    </div>
  );
}
