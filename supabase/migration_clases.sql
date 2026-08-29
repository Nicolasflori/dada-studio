-- Migración: separar "clase" (disciplina + profesor + horario) del alumno,
-- y agregar la inscripción de alumnos a clases (muchos a muchos).
-- Correr en el SQL Editor de Supabase. La tabla "clases" vieja se borra:
-- todavía no tenía filas reales porque no había pantalla para cargarlas.

drop table if exists clases cascade;

create table clases (
  id uuid primary key default gen_random_uuid(),
  profesor_id uuid not null references profesores (id) on delete cascade,
  nombre text not null,
  dia text not null check (dia in ('lunes','martes','miercoles','jueves','viernes','sabado','domingo')),
  hora time not null,
  created_at timestamptz not null default now()
);

create table inscripciones (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references alumnos (id) on delete cascade,
  clase_id uuid not null references clases (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (alumno_id, clase_id)
);

alter table clases enable row level security;
alter table inscripciones enable row level security;

-- Clases: solo la dueña crea, edita o borra. Cada profesor ve y usa las suyas.
create policy "ver_clases" on clases
  for select using (is_owner() or profesor_id = mi_profesor_id());

create policy "dueña_crea_clases" on clases
  for insert with check (is_owner());

create policy "dueña_edita_clases" on clases
  for update using (is_owner());

create policy "dueña_borra_clases" on clases
  for delete using (is_owner());

-- Inscripciones: la dueña ve/inscribe en cualquier clase; cada profesor solo
-- en las clases que le pertenecen (y así, indirectamente, solo sus alumnos).
create policy "ver_inscripciones" on inscripciones
  for select using (
    is_owner()
    or exists (select 1 from clases c where c.id = inscripciones.clase_id and c.profesor_id = mi_profesor_id())
  );

create policy "crear_inscripciones" on inscripciones
  for insert with check (
    is_owner()
    or exists (select 1 from clases c where c.id = inscripciones.clase_id and c.profesor_id = mi_profesor_id())
  );

create policy "borrar_inscripciones" on inscripciones
  for delete using (
    is_owner()
    or exists (select 1 from clases c where c.id = inscripciones.clase_id and c.profesor_id = mi_profesor_id())
  );
