import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Alumno, Clase, Inscripcion, Pago, Profesor } from "@/lib/types";

// A veces, justo después de loguearse, Supabase rechaza el token recién
// emitido con "JWT issued at future" (desfasaje de reloj entre sus propios
// servidores). Se resuelve solo medio segundo después, así que reintentamos
// una vez en silencio antes de mostrar un error de verdad.
async function conReintento<T>(
  consulta: () => PromiseLike<{ data: T; error: { code?: string; message: string } | null }>,
): Promise<{ data: T; error: { code?: string; message: string } | null }> {
  let resultado = await consulta();
  if (resultado.error?.code === "PGRST303") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    resultado = await consulta();
  }
  return resultado;
}

// El layout y cada página piden "quién soy" por separado para poder armar la
// sidebar y ocultar botones de edición sin pasarse el profesor a mano por
// props. cache() de React hace que, dentro de un mismo request, esas llamadas
// resuelvan una sola vez contra Supabase en vez de repetir el roundtrip
// (antes: hasta 2 consultas del profesor actual por cada carga de página).
export const getProfesorActual = cache(async (): Promise<Profesor | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: errorUser,
  } = await supabase.auth.getUser();
  if (errorUser) console.error("getUser error:", errorUser.status, errorUser.code, errorUser.message);
  if (!user) return null;

  const { data: yaVinculado, error: errorVinculado } = await conReintento(() =>
    supabase.from("profesores").select("*").eq("user_id", user.id).maybeSingle(),
  );
  if (errorVinculado) {
    console.error("getProfesorActual (por user_id) error:", errorVinculado.code, errorVinculado.message);
    throw errorVinculado;
  }
  if (yaVinculado) return yaVinculado as Profesor;

  // Primer login: buscar una fila cargada de antemano con este email y vincularla.
  if (!user.email) return null;
  const { data: sinVincular, error: errorSinVincular } = await conReintento(() =>
    supabase.from("profesores").select("*").eq("email", user.email!).is("user_id", null).maybeSingle(),
  );
  if (errorSinVincular) {
    console.error("getProfesorActual (por email) error:", errorSinVincular.code, errorSinVincular.message);
    throw errorSinVincular;
  }
  if (!sinVincular) return null;

  const { data: vinculado, error: errorVincular } = await supabase
    .from("profesores")
    .update({ user_id: user.id })
    .eq("id", sinVincular.id)
    .select("*")
    .single();
  if (errorVincular) {
    console.error("getProfesorActual (al vincular) error:", errorVincular.code, errorVincular.message);
  }

  return (vinculado ?? sinVincular) as Profesor;
});

export async function getProfesores(): Promise<Profesor[]> {
  const supabase = await createClient();
  const { data, error } = await conReintento(() => supabase.from("profesores").select("*").order("rol"));
  if (error) throw error;
  return (data ?? []) as Profesor[];
}

export async function getAlumnos(): Promise<Alumno[]> {
  const supabase = await createClient();
  const { data, error } = await conReintento(() => supabase.from("alumnos").select("*").order("nombre"));
  if (error) throw error;
  return data ?? [];
}

export async function getClases(): Promise<Clase[]> {
  const supabase = await createClient();
  const { data, error } = await conReintento(() => supabase.from("clases").select("*").order("hora"));
  if (error) throw error;
  return (data ?? []) as Clase[];
}

export async function getInscripciones(): Promise<Inscripcion[]> {
  const supabase = await createClient();
  const { data, error } = await conReintento(() => supabase.from("inscripciones").select("*"));
  if (error) throw error;
  return data ?? [];
}

export async function getPagos(): Promise<Pago[]> {
  const supabase = await createClient();
  const { data, error } = await conReintento(() =>
    supabase.from("pagos").select("*").order("fecha", { ascending: false }),
  );
  if (error) throw error;
  return data ?? [];
}
