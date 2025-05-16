/**
 * Obtiene un valor de un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @returns {any} El valor
 */
export function get(obj: Object, path: string) {
  let acc = obj;
  for (const key of path.split('.')) {
    if (!key) return acc;

    if (
      typeof acc !== 'object'
      || (Array.isArray(acc) && Number.isNaN(key))
      || !(key in acc)
    ) return undefined;

    acc = (acc as Record<string, any>)[key];
  }

  return acc;
}

/**
 * Establece un valor en un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @param {any} value - El valor
 * @returns {Object} El objeto
 */
export function set(obj: Object, path: string, value: any): Record<string, any> {
  const keys = path.split('.');
  let current = obj as Record<string, any>;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!key) continue;

    if (!current[key] || typeof current[key] !== 'object') current[key] = {};

    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey) current[lastKey] = value;

  return obj as Record<string, any>;
}

/**
 * Elimina un valor de un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @returns {Object} El objeto
 */
export function del(obj: Object, path: string): Record<string, any> {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const parent = get(obj, keys.join('.'));
  if (!parent || !lastKey) return obj as Record<string, any>;
  delete (parent as Record<string, any>)[lastKey];
  return obj as Record<string, any>;
}

/**</edit>
 * Verifica si un objeto es igual a otro
 * @param {any} obj1 - El objeto
 * @param {any} obj2 - El objeto
 * @returns {boolean} true si es igual, false en caso contrario
 */
export function isEquals(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== typeof obj2) return false;
  if (obj1 === null || obj2 === null) return false;

  if (typeof obj1 === 'object') {
    if (obj1.length !== obj2.length) return false;
    return Object.keys(obj1).every(key => isEquals(obj1[key], obj2[key]));
  }

  return obj1 === obj2;
}