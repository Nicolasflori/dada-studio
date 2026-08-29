-- Migración: editar y borrar registros existentes queda reservado a la dueña
-- en todas las tablas. Crear sigue permitido para cada profesor en lo suyo.
-- Correr en el SQL Editor de Supabase.

-- ALUMNOS ---------------------------------------------------------------
drop policy if exists "crud_alumnos_propios" on alumnos;

create policy "crear_alumnos_propios" on alumnos
  for insert with check (is_owner() or profesor_id = mi_profesor_id());

create policy "dueña_edita_alumnos" on alumnos
  for update using (is_owner()) with check (is_owner());

create policy "dueña_borra_alumnos" on alumnos
  for delete using (is_owner());

-- PAGOS -------------------------------------------------------------------
drop policy if exists "crud_pagos_propios" on pagos;

create policy "crear_pagos_propios" on pagos
  for insert with check (is_owner() or profesor_id = mi_profesor_id());

create policy "dueña_edita_pagos" on pagos
  for update using (is_owner()) with check (is_owner());

create policy "dueña_borra_pagos" on pagos
  for delete using (is_owner());

-- Marcar liquidado/pendiente sigue disponible para cada profesor en lo suyo
-- (no es "editar el pago", es un estado que cualquiera de las dos partes
-- puede marcar cuando se hace la transferencia) a través de esta función,
-- que evita tener que abrir la edición completa del pago para eso.
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

-- PROFESORES --------------------------------------------------------------
create policy "dueña_edita_profesores" on profesores
  for update using (is_owner()) with check (is_owner());

create policy "dueña_borra_profesores" on profesores
  for delete using (is_owner());
