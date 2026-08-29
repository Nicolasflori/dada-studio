import { getAlumnos, getPagos, getProfesorActual, getProfesores } from "@/lib/data";
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink-900">Profesores</h1>
        {esDueña && <NuevoProfesorForm />}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {profesores.map((prof) => {
          const alumnosDelProfesor = alumnos.filter((a) => a.profesor_id === prof.id && a.activo);
          const pagosPendientes = pagos.filter((p) => p.profesor_id === prof.id && !p.liquidado);
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
