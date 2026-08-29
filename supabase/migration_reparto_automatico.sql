-- Migración: el reparto profesor/taller deja de elegirse por pago.
-- Denise (el estudio) siempre cobra el 100% del pago; lo que le corresponde
-- al profesor sale del % fijado en su propio perfil. Ya no hace falta
-- guardar "quién cobró" en cada pago.

alter table pagos drop column if exists cobrado_por;

-- "quién cobra" ya no se usa: el estudio siempre cobra el 100% y el reparto
-- sale directo del % del profesor.
alter table profesores drop column if exists quien_cobra;
