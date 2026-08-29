"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function crearClase(_prevState: unknown, formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const profesorId = String(formData.get("profesor_id") ?? "");
  const dia = String(formData.get("dia") ?? "");
  const hora = String(formData.get("hora") ?? "");

  if (!nombre || !profesorId || !dia || !hora) {
    return { ok: false, mensaje: "Completá nombre, profesor, día y hora." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("clases").insert({
    nombre,
    profesor_id: profesorId,
    dia,
    hora,
  });

  if (error) {
    return { ok: false, mensaje: "No se pudo crear la clase." };
  }

  revalidatePath("/horarios");
  revalidatePath("/alumnos");
  return { ok: true, mensaje: `${nombre} se creó correctamente.` };
}

export async function editarClase(_prevState: unknown, formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const profesorId = String(formData.get("profesor_id") ?? "");
  const dia = String(formData.get("dia") ?? "");
  const hora = String(formData.get("hora") ?? "");

  if (!id || !nombre || !profesorId || !dia || !hora) {
    return { ok: false, mensaje: "Completá nombre, profesor, día y hora." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("clases")
    .update({ nombre, profesor_id: profesorId, dia, hora })
    .eq("id", id);

  if (error) {
    return { ok: false, mensaje: "No se pudo guardar el cambio." };
  }

  revalidatePath("/horarios");
  revalidatePath("/alumnos");
  return { ok: true, mensaje: "Clase actualizada." };
}

export async function borrarClase(claseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("clases").delete().eq("id", claseId);
  if (error) return { ok: false };

  revalidatePath("/horarios");
  revalidatePath("/alumnos");
  return { ok: true };
}
