import { getAlumnos, getPagos, getProfesorActual, getProfesores } from "@/lib/data";
import NuevoPagoForm from "./NuevoPagoForm";
import PagoRow from "./PagoRow";

export default async function PagosPage() {
  const [alumnos, pagos, profesores, profesorActual] = await Promise.all([
    getAlumnos(),
    getPagos(),
    getProfesores(),
    getProfesorActual(),
  ]);
  const esDueña = profesorActual?.rol === "dueño";

  const nombreAlumno = (id: string) => alumnos.find((a) => a.id === id)?.nombre ?? "—";
  const profesorDe = (id: string) => profesores.find((p) => p.id === id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-medium text-ink-900">Pagos</h1>
        <NuevoPagoForm alumnos={alumnos} />
      </div>

      <div className="mt-6 rounded-sm border-2 border-ink-900 bg-surface p-3 shadow-[4px_4px_0_0_var(--ink-900)] md:p-5">
        {pagos.length === 0 ? (
          <p className="text-sm text-ink-500">Todavía no hay pagos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-ink-400">
                  <th className="pb-2 font-medium">Alumno</th>
                  <th className="pb-2 font-medium">Profesor</th>
                  <th className="pb-2 font-medium">Monto</th>
                  <th className="pb-2 font-medium">Reparto</th>
                  <th className="pb-2 font-medium">Fecha</th>
                  <th className="pb-2 font-medium">Pago a profesor</th>
                  {esDueña && <th className="pb-2 font-medium">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {pagos.map((p) => {
                  const profesor = profesorDe(p.profesor_id);
                  const pctTaller = profesor ? profesor.porcentaje_taller / 100 : 0;
                  const montoTaller = p.monto * pctTaller;
                  const montoProfesor = p.monto - montoTaller;
                  return (
                    <PagoRow
                      key={p.id}
                      pago={p}
                      nombreAlumno={nombreAlumno(p.alumno_id)}
                      nombreProfesor={profesor?.nombre ?? "—"}
                      montoTaller={montoTaller}
                      montoProfesor={montoProfesor}
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
