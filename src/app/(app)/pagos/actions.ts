"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function crearPago(_prevState: unknown, formData: FormData) {
  const alumnoId = String(formData.get("alumno_id") ?? "");
  const monto = Number(formData.get("monto"));
  const fecha = String(formData.get("fecha") ?? "");
  const medioPago = String(formData.get("medio_pago") ?? "").trim();

  if (!alumnoId || Number.isNaN(monto) || monto < 0 || !fecha) {
    return { ok: false, mensaje: "Completá alumno, monto y fecha." };
  }

  const supabase = await createClient();

  const { data: alumno, error: errorAlumno } = await supabase
    .from("alumnos")
    .select("profesor_id")
    .eq("id", alumnoId)
    .single();

  if (errorAlumno || !alumno) {
    return { ok: false, mensaje: "No se encontró el alumno seleccionado." };
  }

  const mesCorrespondiente = `${fecha.slice(0, 7)}-01`;

  const { error } = await supabase.from("pagos").insert({
    alumno_id: alumnoId,
    profesor_id: alumno.profesor_id,
    monto,
    fecha,
    mes_correspondiente: mesCorrespondiente,
    medio_pago: medioPago || null,
  });

  if (error) {
    return { ok: false, mensaje: "No se pudo registrar el pago." };
  }

  revalidatePath("/pagos");
  revalidatePath("/");
  revalidatePath("/profesores");
  return { ok: true, mensaje: "Pago registrado." };
}

export async function alternarLiquidado(pagoId: string, liquidado: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("alternar_liquidado", {
    p_pago_id: pagoId,
    p_liquidado: liquidado,
  });

  if (error) return { ok: false };

  revalidatePath("/pagos");
  revalidatePath("/");
  revalidatePath("/profesores");
  return { ok: true };
}

export async function editarPago(_prevState: unknown, formData: FormData) {
  const pagoId = String(formData.get("id") ?? "");
  const monto = Number(formData.get("monto"));
  const fecha = String(formData.get("fecha") ?? "");
  const medioPago = String(formData.get("medio_pago") ?? "").trim();

  if (!pagoId || Number.isNaN(monto) || monto < 0 || !fecha) {
    return { ok: false, mensaje: "Completá monto y fecha." };
  }

  const supabase = await createClient();
  const mesCorrespondiente = `${fecha.slice(0, 7)}-01`;
  const { error } = await supabase
    .from("pagos")
    .update({
      monto,
      fecha,
      mes_correspondiente: mesCorrespondiente,
      medio_pago: medioPago || null,
    })
    .eq("id", pagoId);

  if (error) {
    return { ok: false, mensaje: "No se pudo guardar el cambio." };
  }

  revalidatePath("/pagos");
  revalidatePath("/");
  revalidatePath("/profesores");
  return { ok: true, mensaje: "Pago actualizado." };
}

export async function borrarPago(pagoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("pagos").delete().eq("id", pagoId);
  if (error) return { ok: false };

  revalidatePath("/pagos");
  revalidatePath("/");
  revalidatePath("/profesores");
  return { ok: true };
}
