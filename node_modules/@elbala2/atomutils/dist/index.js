"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Object: () => Object_exports
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Object
});
