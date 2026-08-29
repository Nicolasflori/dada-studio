"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function crearProfesor(_prevState: unknown, formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const porcentajeTaller = Number(formData.get("porcentaje_taller"));

  if (!nombre || !email || Number.isNaN(porcentajeTaller)) {
    return { ok: false, mensaje: "Completá nombre, email y porcentaje." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profesores").insert({
    nombre,
    email,
    rol: "externo",
    porcentaje_taller: porcentajeTaller,
  });

  if (error) {
    console.error("crearProfesor error:", error.code, error.message);
    const mensaje = error.code === "23505" ? "Ya hay un profesor con ese email." : "No se pudo agregar el profesor.";
    return { ok: false, mensaje };
  }

  revalidatePath("/profesores");
  return { ok: true, mensaje: `${nombre} fue agregado. Va a poder entrar con ${email}.` };
}

export async function editarProfesor(_prevState: unknown, formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const porcentajeTaller = Number(formData.get("porcentaje_taller"));

  if (!id || !nombre || Number.isNaN(porcentajeTaller)) {
    return { ok: false, mensaje: "Completá nombre y porcentaje." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profesores")
    .update({ nombre, porcentaje_taller: porcentajeTaller })
    .eq("id", id);

  if (error) {
    return { ok: false, mensaje: "No se pudo guardar el cambio." };
  }

  revalidatePath("/profesores");
  revalidatePath("/pagos");
  revalidatePath("/");
  return { ok: true, mensaje: "Profesor actualizado." };
}

export async function borrarProfesor(profesorId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("profesores").delete().eq("id", profesorId);
  if (error) return { ok: false };

  revalidatePath("/profesores");
  revalidatePath("/alumnos");
  revalidatePath("/horarios");
  revalidatePath("/pagos");
  return { ok: true };
}
