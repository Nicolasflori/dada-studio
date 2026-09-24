import type { Database } from "./database.types";

export type Rol = "dueño" | "externo";
export type Dia = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

type Fila<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

// Reusar las filas generadas desde el esquema real de Supabase (src/lib/database.types.ts)
// en vez de declarar estas formas a mano: si una columna cambia en la base, TypeScript
// avisa acá en vez de fallar recién en producción. rol/dia se angostan a sus valores
// posibles porque el generador no conoce los `check` constraints de Postgres.
export type Profesor = Omit<Fila<"profesores">, "rol"> & { rol: Rol };
export type Alumno = Fila<"alumnos">;
export type Clase = Omit<Fila<"clases">, "dia"> & { dia: Dia };
export type Inscripcion = Fila<"inscripciones">;
export type Pago = Fila<"pagos">;

export const DIAS: Dia[] = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
