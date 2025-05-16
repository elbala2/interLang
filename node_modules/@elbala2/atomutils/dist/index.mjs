var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/Object/index.ts
var Object_exports = {};
__export(Object_exports, {
  del: () => del,
  get: () => get,
  isEquals: () => isEquals,
  set: () => set
});
function get(obj, path) {
  let acc = obj;
  for (const key of path.split(".")) {
    if (!key) return acc;
    if (typeof acc !== "object" || Array.isArray(acc) && Number.isNaN(key) || !(key in acc)) return void 0;
    acc = acc[key];
  }
  return acc;
}
function set(obj, path, value) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!key) continue;
    if (!current[key] || typeof current[key] !== "object") current[key] = {};
    current = current[key];
  }
  const lastKey = keys[keys.length - 1];
  if (lastKey) current[lastKey] = value;
  return obj;
}
function del(obj, path) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const parent = get(obj, keys.join("."));
  if (!parent || !lastKey) return obj;
  delete parent[lastKey];
  return obj;
}
function isEquals(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== typeof obj2) return false;
  if (obj1 === null || obj2 === null) return false;
  if (typeof obj1 === "object") {
    if (obj1.length !== obj2.length) return false;
    return Object.keys(obj1).every((key) => isEquals(obj1[key], obj2[key]));
  }
  return obj1 === obj2;
}
export {
  Object_exports as Object
};
