"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function iniciarSesion(_prevState: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, mensaje: "Completá email y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("signInWithPassword error:", error.status, error.code, error.message);
    return { ok: false, mensaje: "Email o contraseña incorrectos." };
  }

  redirect("/");
}
