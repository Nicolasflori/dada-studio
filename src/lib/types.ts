export type Rol = "dueño" | "externo";
export type Dia = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

export interface Profesor {
  id: string;
  user_id: string | null;
  nombre: string;
  email: string;
  rol: Rol;
  porcentaje_taller: number;
}

export interface Alumno {
  id: string;
  profesor_id: string;
  nombre: string;
  contacto: string | null;
  fecha_inicio: string;
  activo: boolean;
}

export interface Clase {
  id: string;
  profesor_id: string;
  nombre: string;
  dia: Dia;
  hora: string;
}

export interface Inscripcion {
  id: string;
  alumno_id: string;
  clase_id: string;
}

export interface Pago {
  id: string;
  alumno_id: string;
  profesor_id: string;
  monto: number;
  fecha: string;
  mes_correspondiente: string;
  medio_pago: string | null;
  liquidado: boolean;
}

export const DIAS: Dia[] = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
