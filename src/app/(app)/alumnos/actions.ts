"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function crearAlumno(_prevState: unknown, formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const contacto = String(formData.get("contacto") ?? "").trim();
  const claseId = String(formData.get("clase_id") ?? "");

  if (!nombre || !claseId) {
    return { ok: false, mensaje: "Completá al menos el nombre y la clase." };
  }

  const supabase = await createClient();

  const { data: clase, error: errorClase } = await supabase
    .from("clases")
    .select("profesor_id")
    .eq("id", claseId)
    .single();

  if (errorClase || !clase) {
    return { ok: false, mensaje: "No se encontró la clase seleccionada." };
  }

  const { data: alumno, error: errorAlumno } = await supabase
    .from("alumnos")
    .insert({ nombre, contacto: contacto || null, profesor_id: clase.profesor_id })
    .select("id")
    .single();

  if (errorAlumno || !alumno) {
    return { ok: false, mensaje: "No se pudo guardar el alumno." };
  }

  const { error: errorInscripcion } = await supabase
    .from("inscripciones")
    .insert({ alumno_id: alumno.id, clase_id: claseId });

  if (errorInscripcion) {
    // El alumno sin inscripción queda "huérfano" (no aparece en ninguna clase);
    // deshacemos el insert anterior para no dejar el dato a mitad de camino.
    await supabase.from("alumnos").delete().eq("id", alumno.id);
    return { ok: false, mensaje: "No se pudo anotar al alumno en la clase. Probá de nuevo." };
  }

  revalidatePath("/alumnos");
  revalidatePath("/horarios");
  revalidatePath("/");
  return { ok: true, mensaje: `${nombre} se agregó correctamente.` };
}

export async function editarAlumno(_prevState: unknown, formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const contacto = String(formData.get("contacto") ?? "").trim();
  const activo = formData.get("activo") === "on";

  if (!id || !nombre) {
    return { ok: false, mensaje: "Falta el nombre." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("alumnos")
    .update({ nombre, contacto: contacto || null, activo })
    .eq("id", id);

  if (error) {
    return { ok: false, mensaje: "No se pudo guardar el cambio." };
  }

  revalidatePath("/alumnos");
  revalidatePath("/");
  return { ok: true, mensaje: "Alumno actualizado." };
}

export async function borrarAlumno(alumnoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("alumnos").delete().eq("id", alumnoId);
  if (error) return { ok: false };

  revalidatePath("/alumnos");
  revalidatePath("/horarios");
  revalidatePath("/");
  return { ok: true };
}
