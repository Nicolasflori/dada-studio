import { createClient } from "@/lib/supabase/server";

export async function getProfesorActual() {
  const supabase = await createClient();
  const {
    data: { user },
    error: errorUser,
  } = await supabase.auth.getUser();
  if (errorUser) console.error("getUser error:", errorUser.status, errorUser.code, errorUser.message);
  if (!user) return null;

  const { data: yaVinculado, error: errorVinculado } = await supabase
    .from("profesores")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (errorVinculado) {
    console.error("getProfesorActual (por user_id) error:", errorVinculado.code, errorVinculado.message);
    throw errorVinculado;
  }
  if (yaVinculado) return yaVinculado;

  // Primer login: buscar una fila cargada de antemano con este email y vincularla.
  if (!user.email) return null;
  const { data: sinVincular, error: errorSinVincular } = await supabase
    .from("profesores")
    .select("*")
    .eq("email", user.email)
    .is("user_id", null)
    .maybeSingle();
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

  return vinculado ?? sinVincular;
}

export async function getProfesores() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profesores").select("*").order("rol");
  if (error) throw error;
  return data;
}

export async function getAlumnos() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("alumnos").select("*").order("nombre");
  if (error) throw error;
  return data;
}

export async function getClases() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("clases").select("*").order("hora");
  if (error) throw error;
  return data;
}

export async function getInscripciones() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("inscripciones").select("*");
  if (error) throw error;
  return data;
}

export async function getPagos() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("pagos").select("*").order("fecha", { ascending: false });
  if (error) throw error;
  return data;
}
