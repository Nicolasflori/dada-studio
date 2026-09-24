import StatCard from "@/components/StatCard";
import { getAlumnos, getPagos, getProfesores } from "@/lib/data";
import { indexarPorId } from "@/lib/utils";
import SelloLiquidacion from "./pagos/SelloLiquidacion";

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default async function DashboardPage() {
  const [alumnos, pagos, profesores] = await Promise.all([getAlumnos(), getPagos(), getProfesores()]);
  const alumnosPorId = indexarPorId(alumnos);
  const profesoresPorId = indexarPorId(profesores);

  const ahora = new Date();
  const mesActual = ahora.toISOString().slice(0, 7);
  const etiquetaMes = ahora.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const pctProfesorDe = (profesorId: string) => {
    const profesor = profesoresPorId.get(profesorId);
    return profesor ? 1 - profesor.porcentaje_taller / 100 : 0;
  };

  const pagosDelMes = pagos.filter((p) => p.mes_correspondiente.slice(0, 7) === mesActual);
  const totalRecaudado = pagosDelMes.reduce((acc, p) => acc + p.monto, 0);
  const alumnosActivos = alumnos.filter((a) => a.activo).length;

  const pendientes = pagos.filter((p) => !p.liquidado && pctProfesorDe(p.profesor_id) > 0);
  const totalPendiente = pendientes.reduce((acc, p) => acc + p.monto * pctProfesorDe(p.profesor_id), 0);

  const nombreAlumno = (id: string) => alumnosPorId.get(id)?.nombre ?? "—";
  const nombreProfesor = (id: string) => profesoresPorId.get(id)?.nombre ?? "—";
  const ultimosPagos = pagos.slice(0, 8);

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink-900">Resumen</h1>
      <p className="mt-1 text-sm capitalize text-ink-500">{etiquetaMes}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Recaudado este mes"
          value={formatoMoneda.format(totalRecaudado)}
          hint={`${pagosDelMes.length} pagos registrados`}
        />
        <StatCard
          label="Alumnos activos"
          value={String(alumnosActivos)}
          hint={`${profesores.length} profesores en el espacio`}
        />
        <StatCard
          label="Pendiente de pagar a profesores"
          value={formatoMoneda.format(totalPendiente)}
          hint={`${pendientes.length} pagos sin liquidar`}
          destacado={totalPendiente > 0}
        />
      </div>

      <div className="mt-8 rounded-sm border-2 border-ink-900 bg-surface p-3 shadow-[4px_4px_0_0_var(--ink-900)] md:p-5">
        <h2 className="text-sm font-semibold text-ink-700">Últimos pagos</h2>
        {ultimosPagos.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">Todavía no hay pagos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="text-ink-400">
                  <th className="pb-2 font-medium">Alumno</th>
                  <th className="pb-2 font-medium">Profesor</th>
                  <th className="pb-2 font-medium">Monto</th>
                  <th className="pb-2 font-medium">Fecha</th>
                  <th className="pb-2 font-medium">Pago a profesor</th>
                </tr>
              </thead>
              <tbody>
                {ultimosPagos.map((p) => (
                  <tr key={p.id} className="border-t border-ink-50">
                    <td className="py-2 text-ink-800">{nombreAlumno(p.alumno_id)}</td>
                    <td className="py-2 text-ink-600">{nombreProfesor(p.profesor_id)}</td>
                    <td className="py-2 text-ink-800">{formatoMoneda.format(p.monto)}</td>
                    <td className="py-2 text-ink-500">{p.fecha}</td>
                    <td className="py-2">
                      {pctProfesorDe(p.profesor_id) > 0 ? (
                        <SelloLiquidacion pagoId={p.id} liquidado={p.liquidado} />
                      ) : (
                        <span className="text-xs text-ink-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
