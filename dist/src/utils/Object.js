"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = get;
exports.set = set;
exports.del = del;
exports.isEquals = isEquals;
/**
 * Obtiene un valor de un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @returns {any} El valor
 */
function get(obj, path) {
    return path.split('.')
        .reduce((acc, key) => {
        if (typeof acc !== 'object'
            || (Array.isArray(acc) && Number.isNaN(key))
            || !(key in acc))
            return undefined;
        return acc[key];
    }, obj);
}
/**
 * Establece un valor en un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @param {any} value - El valor
 * @returns {Object} El objeto
 */
function set(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const parent = get(obj, keys.join('.'));
    if (!parent || !lastKey)
        return obj;
    parent[lastKey] = value;
    return obj;
}
/**
 * Elimina un valor de un objeto a partir de una ruta
 * @param {Object} obj - El objeto
 * @param {string} path - La ruta
 * @returns {Object} El objeto
 */
function del(obj, path) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const parent = get(obj, keys.join('.'));
    if (!parent || !lastKey)
        return obj;
    delete parent[lastKey];
    return obj;
}
/**
 * Verifica si un objeto es igual a otro
 * @param {any} obj1 - El objeto
 * @param {any} obj2 - El objeto
 * @returns {boolean} true si es igual, false en caso contrario
 */
function isEquals(obj1, obj2) {
    if (obj1 === obj2)
        return true;
    if (typeof obj1 !== typeof obj2)
        return false;
    if (obj1 === null || obj2 === null)
        return false;
    if (typeof obj1 === 'object') {
        if (obj1.length !== obj2.length)
            return false;
        return Object.keys(obj1).every(key => isEquals(obj1[key], obj2[key]));
    }
    return obj1 === obj2;
}
