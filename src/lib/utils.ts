// Las páginas cruzan varias tablas a mano (alumno -> profesor, clase ->
// alumnos anotados, etc.). Antes cada cruce se hacía con .find()/.filter()
// dentro de un .map(), es decir O(n*m) por tabla. Estos dos helpers arman un
// índice una sola vez (O(n)) y después cada búsqueda es O(1).

export function indexarPorId<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

export function agruparPor<T, K>(items: T[], clave: (item: T) => K): Map<K, T[]> {
  const grupos = new Map<K, T[]>();
  for (const item of items) {
    const k = clave(item);
    const grupo = grupos.get(k);
    if (grupo) grupo.push(item);
    else grupos.set(k, [item]);
  }
  return grupos;
}
