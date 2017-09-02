export const Type = Function;
export function isType(v: any): v is Type<any> {
    return typeof v === 'function';
}
export interface Type<T> extends Function { new (...args: any[]): T; }

/**
 * Check and return true if an object is type of string
 */
export function isString(obj: any) {
    return typeof obj === "string";
}

/**
 * Check and return true if an object is type of number
 */
export function isNumber(obj: any) {
    return typeof obj === "number";
}

/**
 * Check and return true if an object is type of Function
 */
export function isFunction(obj: any) {
    return typeof obj === "function";
}
