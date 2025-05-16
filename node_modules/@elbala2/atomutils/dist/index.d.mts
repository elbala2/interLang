/**
 * Obtiene un valor de un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @returns {any} El valor
 */
declare function get(obj: Object, path: string): Object | undefined;
/**
 * Establece un valor en un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @param {any} value - El valor
 * @returns {Object} El objeto
 */
declare function set(obj: Object, path: string, value: any): Record<string, any>;
/**
 * Elimina un valor de un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @returns {Object} El objeto
 */
declare function del(obj: Object, path: string): Record<string, any>;
/**</edit>
 * Verifica si un objeto es igual a otro
 * @param {any} obj1 - El objeto
 * @param {any} obj2 - El objeto
 * @returns {boolean} true si es igual, false en caso contrario
 */
declare function isEquals(obj1: any, obj2: any): boolean;

declare const index_del: typeof del;
declare const index_get: typeof get;
declare const index_isEquals: typeof isEquals;
declare const index_set: typeof set;
declare namespace index {
  export { index_del as del, index_get as get, index_isEquals as isEquals, index_set as set };
}

export { index as Object };
