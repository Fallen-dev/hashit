export const getElement = (selector, type = document) => type.querySelector(selector);
export const log = (...args) => console.debug(...args); //debug
export const log_err = (...args) => console.error(...args); //debug

export const toString = (value) => JSON.stringify(value);
export const toObject = (value) => JSON.parse(value);

export const save_to_storage = (key, list) => localStorage.setItem(key, list);
export const get_from_storage = (key) => localStorage.getItem(key);
