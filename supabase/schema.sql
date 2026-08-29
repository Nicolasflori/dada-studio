-- Esquema inicial para el taller de arte
-- Correr esto en el SQL Editor de Supabase (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

create table profesores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) unique,
  nombre text not null,
  email text not null unique,
  rol text not null check (rol in ('dueño', 'externo')),
  porcentaje_taller numeric not null default 50 check (porcentaje_taller between 0 and 100),
  created_at timestamptz not null default now()
);

create table alumnos (
  id uuid primary key default gen_random_uuid(),
  profesor_id uuid not null references profesores (id) on delete cascade,
  nombre text not null,
  contacto text,
  fecha_inicio date not null default current_date,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

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

create table pagos (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references alumnos (id) on delete cascade,
  profesor_id uuid not null references profesores (id) on delete cascade,
  monto numeric not null check (monto >= 0),
  fecha date not null default current_date,
  mes_correspondiente date not null,
  medio_pago text,
  liquidado boolean not null default false,
  fecha_liquidacion date,
  created_at timestamptz not null default now()
);

-- Row Level Security: la dueña ve todo, cada profesor externo ve solo lo suyo.

alter table profesores enable row level security;
alter table alumnos enable row level security;
alter table clases enable row level security;
alter table inscripciones enable row level security;
alter table pagos enable row level security;

create or replace function is_owner()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profesores
    where user_id = auth.uid() and rol = 'dueño'
  );
$$;

create or replace function mi_profesor_id()
returns uuid
language sql
security definer
stable
as $$
  select id from profesores where user_id = auth.uid();
$$;

create policy "ver_profesores" on profesores
  for select using (
    is_owner()
    or user_id = auth.uid()
    or (user_id is null and email = (auth.jwt() ->> 'email'))
  );

create policy "vincular_propio_login" on profesores
  for update using (
    user_id = auth.uid()
    or (user_id is null and email = (auth.jwt() ->> 'email'))
  )
  with check (user_id = auth.uid());

create policy "dueña_agrega_profesores" on profesores
  for insert with check (is_owner());

create policy "dueña_edita_profesores" on profesores
  for update using (is_owner()) with check (is_owner());

create policy "dueña_borra_profesores" on profesores
  for delete using (is_owner());

create policy "ver_alumnos" on alumnos
  for select using (is_owner() or profesor_id = mi_profesor_id());

create policy "crear_alumnos_propios" on alumnos
  for insert with check (is_owner() or profesor_id = mi_profesor_id());

create policy "dueña_edita_alumnos" on alumnos
  for update using (is_owner()) with check (is_owner());

create policy "dueña_borra_alumnos" on alumnos
  for delete using (is_owner());

create policy "ver_clases" on clases
  for select using (is_owner() or profesor_id = mi_profesor_id());

create policy "dueña_crea_clases" on clases
  for insert with check (is_owner());

create policy "dueña_edita_clases" on clases
  for update using (is_owner());

create policy "dueña_borra_clases" on clases
  for delete using (is_owner());

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

create policy "ver_pagos" on pagos
  for select using (is_owner() or profesor_id = mi_profesor_id());

create policy "crear_pagos_propios" on pagos
  for insert with check (is_owner() or profesor_id = mi_profesor_id());

create policy "dueña_edita_pagos" on pagos
  for update using (is_owner()) with check (is_owner());

create policy "dueña_borra_pagos" on pagos
  for delete using (is_owner());

-- Confirmar que ya se le pagó al profesor su parte queda disponible para
-- cada profesor en lo suyo (no es "editar el pago"), a través de esta
-- función en vez de la política general de update, que es solo para la dueña.
create or replace function alternar_liquidado(p_pago_id uuid, p_liquidado boolean)
returns void
language plpgsql
security definer
as $$
begin
  if not exists (
    select 1 from pagos p
    where p.id = p_pago_id and (is_owner() or p.profesor_id = mi_profesor_id())
  ) then
    raise exception 'No autorizado';
  end if;

  update pagos
  set liquidado = p_liquidado,
      fecha_liquidacion = case when p_liquidado then current_date else null end
  where id = p_pago_id;
end;
$$;

-- El vínculo entre el login y la fila de "profesores" (por email) se hace
-- desde la app la primera vez que cada persona entra (ver src/lib/data.ts),
-- no acá: crear triggers sobre auth.users requiere permisos que el SQL
-- Editor no siempre tiene, y si esa sentencia falla se revierte todo el script.

-- Antes de que alguien entre por primera vez, precargar su fila como dueña
-- (reemplazar el email de Denise por el real). Los profesores externos se
-- agregan desde la pantalla "Profesores" de la app.
insert into profesores (nombre, email, rol, porcentaje_taller)
values
  ('Denise', 'denise@dadastudio.com', 'dueño', 100),
  ('Nicolás', 'nicolasflori@hotmail.com', 'dueño', 100);
