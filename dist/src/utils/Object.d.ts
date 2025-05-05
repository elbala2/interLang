/**
 * Obtiene un valor de un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @returns {any} El valor
 */
export declare function get(obj: Object, path: string): any;
/**
 * Establece un valor en un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @param {any} value - El valor
 * @returns {Object} El objeto
 */
export declare function set(obj: Object, path: string, value: any): Object;
/**
 * Elimina un valor de un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @returns {Object} El objeto
 */
export declare function del(obj: Object, path: string): Object;
/**
 * Verifica si un objeto es igual a otro
 * @param {any} obj1 - El objeto
 * @param {any} obj2 - El objeto
 * @returns {boolean} true si es igual, false en caso contrario
 */
export declare function isEquals(obj1: any, obj2: any): boolean;
