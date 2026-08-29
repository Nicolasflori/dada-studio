"use server";

import { createClient } from "@/lib/supabase/server";

export async function enviarLinkDeAcceso(_prevState: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { ok: false, mensaje: "Ingresá tu email." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    console.error("signInWithOtp error:", error.status, error.code, error.message);
    return { ok: false, mensaje: "No se pudo enviar el link. Probá de nuevo en un momento." };
  }

  return { ok: true, mensaje: `Te enviamos un link de acceso a ${email}. Revisá tu correo.` };
}
