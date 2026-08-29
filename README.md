# DADÁ STUDIO — Gestión

App para registrar alumnos, horarios y pagos del estudio de Denise, incluyendo alumnos de otros profesores que usan el espacio.

## Requisitos

- Node.js 18 o superior (ya instalado)
- Una cuenta gratuita en https://supabase.com

## Puesta en marcha

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un proyecto en Supabase.

3. Ir a **SQL Editor** y correr el contenido de `supabase/schema.sql`. Antes de correrlo, cambiar el email de ejemplo del `insert into profesores (...)` del final por el email real de Denise — es la fila que la habilita como dueña la primera vez que entra.

4. Copiar `.env.local.example` a `.env.local` y completar con los datos del proyecto (Project Settings → API → Project URL / anon public key):

   ```bash
   cp .env.local.example .env.local
   ```

5. En Supabase, ir a **Authentication → URL Configuration** y agregar `http://localhost:3000/auth/callback` a las Redirect URLs (y la URL de producción cuando la haya).

6. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

7. Abrir http://localhost:3000 y entrar con el email de Denise — Supabase manda un link mágico por correo, sin contraseña.

## Cómo se suman los otros profesores

Desde la pantalla **Profesores**, Denise agrega nombre, email y el % que le corresponde al estudio. Esa persona entra a la app con ese mismo email (le llega su propio link mágico) y queda vinculada automáticamente a esa fila — no hace falta que Denise haga nada más.

## Estado actual

Las pantallas están conectadas a Supabase de verdad (`src/lib/data.ts` para lecturas, `src/app/(app)/*/actions.ts` para altas). Row Level Security hace que cada profesor externo solo vea sus propios alumnos y pagos, mientras que Denise ve todo. Horarios sigue siendo de solo lectura por ahora — no tiene un formulario de alta todavía.
