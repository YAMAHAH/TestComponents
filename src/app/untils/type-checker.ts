export const Type = Function;
export function isType(v: any): v is Type<any> {
    return typeof v === 'function';
}
export interface Type<T> extends Function { new(...args: any[]): T; }

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

export function isObject(obj: any) {
    return typeof obj === 'object';
}
/**
 * 尝试获取指定表达式的值,返回SelectorResult<T>对象
 * @param selector 选择器表达式
 * @param callback 成功时调用的回调函数
 */
export function tryGetValue<T>(selector: () => T, callBack?: (value: T) => void): SelectorResult<T> {
    try {
        let result = selector();
        if (result) {
            if (callBack) callBack(result);
            return { value: result, hasValue: true };
        }
        return { value: null, hasValue: false };
    } catch (error) {
        return { value: null, hasValue: false };
    }
}

export class SelectorResult<T>{
    value: T;
    hasValue: boolean;
}