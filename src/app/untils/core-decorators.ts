import { decorate as _decorate, createDefaultSetter, TypeDecorator } from './decorators';

export class CoreDecorators {
    static readonly(...args: any[]) {
        let handleDescriptor = (target: any, key: any, descriptor: any) => {
            descriptor.writable = false;
            return descriptor;
        }
        return _decorate(handleDescriptor, args);
    }

    static lazyInitialize(...args: any[]) {
        const { defineProperty } = Object;
        let handleDescriptor = (target: any, key: any, descriptor: PropertyDescriptor) => {
            const { configurable, enumerable, initializer, value } = descriptor;
            return {
                configurable,
                enumerable,
                get() {
                    // This happens if someone accesses the
                    // property directly on the prototype
                    if (this === target) {
                        return;
                    }

                    const ret = initializer ? initializer.call(this) : value;

                    defineProperty(this, key, {
                        configurable,
                        enumerable,
                        writable: true,
                        value: ret
                    });

                    return ret;
                },
                set: createDefaultSetter(key)
            };
        }
        return _decorate(handleDescriptor, args);
    }


    static extendDescriptor(...args: any[]) {
        const { getPrototypeOf, getOwnPropertyDescriptor } = Object;
        function handleDescriptor(target: any, key: any, descriptor: PropertyDescriptor) {
            const superKlass = getPrototypeOf(target);
            const superDesc = getOwnPropertyDescriptor(superKlass, key);
            return {
                ...superDesc,
                value: descriptor.value,
                initializer: descriptor.initializer,
                get: descriptor.get || superDesc.get,
                set: descriptor.set || superDesc.set
            };
        }
        return _decorate(handleDescriptor, args);
    }



    static decorate(...args: any[]) {
        let handleDescriptor = (target: any, key: any, descriptor: PropertyDescriptor, [decorator, ...args]) => {
            const { configurable, enumerable, writable } = descriptor;
            const { defineProperty } = Object;
            const originalGet = descriptor.get;
            const originalSet = descriptor.set;
            const originalValue = descriptor.value;
            const isGetter = !!originalGet;

            return {
                configurable,
                enumerable,
                get() {
                    const fn = isGetter ? originalGet.call(this) : originalValue;
                    const value = decorator.call(this, fn, ...args);

                    if (isGetter) {
                        return value;
                    } else {
                        const desc: PropertyDescriptor = {
                            configurable,
                            enumerable
                        };

                        desc.value = value;
                        desc.writable = writable;

                        defineProperty(this, key, desc);

                        return value;
                    }
                },
                set: isGetter ? originalSet : createDefaultSetter(null)
            };
        }
        return _decorate(handleDescriptor, args);
    }

    static log(target: Function, key: string, descriptor: PropertyDescriptor) {

        // save a reference to the original method
        // this way we keep the values currently in the
        // descriptor and don't overwrite what another
        // decorator might have done to the descriptor.
        let originalMethod = descriptor.value;

        //editing the descriptor/value parameter
        descriptor.value = function (...args: any[]) {
            let a = args.map(a => JSON.stringify(a)).join();
            // note usage of originalMethod here
            let result = originalMethod.apply(this, args);
            let r = JSON.stringify(result);
            console.log(`Call: ${key}(${a}) => ${r}`);
            return result;
        }
        // return edited descriptor as opposed to overwriting
        // the descriptor by returning a new descriptor
        return descriptor;
    }
    static logProperty(target: any, key: string) {

        // property value
        let _val = this[key];

        // property getter
        let getter = function () {
            console.log(`Get: ${key} => ${_val}`);
            return _val;
        };

        // property setter
        let setter = function (newVal: any) {
            console.log(`Set: ${key} => ${newVal}`);
            _val = newVal;
        };

        // Delete property.
        if (delete this[key]) {
            // Create new property with getter and setter
            Object.defineProperty(target, key, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    }
    static logClass(target: any) {

        // save a reference to the original constructor
        let original = target;

        // a utility function to generate instances of a class
        function construct(constructor: Function, args: any[]) {
            let c: any = function () {
                return constructor.apply(this, args);
            }
            c.prototype = constructor.prototype;
            return new c();
        }

        // the new constructor behaviour
        let f: any = function (...args: any[]) {
            console.log("New: " + original.name);
            return construct(original, args);
        }

        // copy prototype so intanceof operator still works
        f.prototype = original.prototype;

        // return new constructor (will override original)
        return f;
    }
    static logParameter(target: any, key: string, index: number) {
        let metadataKey = `log_${key}_parameters`;
        if (Array.isArray(target[metadataKey])) {
            target[metadataKey].push(index);
        }
        else {
            target[metadataKey] = [index];
        }
    }
    static logMethod(target: Function, key: string, descriptor: PropertyDescriptor) {
        let originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {

            let metadataKey = `__log_${key}_parameters`;
            let indices = target[metadataKey];

            if (Array.isArray(indices)) {

                for (let i = 0; i < args.length; i++) {

                    if (indices.indexOf(i) !== -1) {

                        let arg = args[i];
                        let argStr = JSON.stringify(arg) || arg.toString();
                        console.log(`${key} arg[${i}]: ${argStr}`);
                    }
                }
                let result = originalMethod.apply(this, args);
                return result;
            }
            else {

                let a = args.map(a => (JSON.stringify(a) || a.toString())).join();
                let result = originalMethod.apply(this, args);
                let r = JSON.stringify(result);
                console.log(`Call: ${key}(${a}) => ${r}`);
                return result;
            }
        }
        return descriptor;
    }
    static logFactory(...args: any[]) {
        switch (args.length) {
            case 1:
                return this.logClass.apply(this, args);
            case 2:
                return this.logProperty.apply(this, args);
            case 3:
                if (typeof args[2] === "number") {
                    return this.logParameter.apply(this, args);
                }
                return this.logMethod.apply(this, args);
            default:
                throw new Error("Decorators are not valid here!");
        }
    }
    // Type metadata uses the metadata key "design:type".
    // Parameter type metadata uses the metadata key "design:paramtypes".
    // Return type metadata uses the metadata key "design:returntype".
    /**
     * 
     *  class Demo{ 
     *   @logType // apply property decorator
     *   public attr1 : string;
     *   }
     * @param target
     * @param key 
     */
    static logType(target: any, key: string) {
        let t = Reflect.getMetadata("design:type", target, key);
        console.log(`${key} type: ${t.name}`);
    }
    /**
     *  @logParameters // apply parameter decorator
     * doSomething(
     *  param1 : string,
     * param2 : number,
     * @param target 
     * @param key 
     */
    static logParamTypes(target: any, key: string) {
        let types = Reflect.getMetadata("design:paramtypes", target, key);
        let s = types.map((a: any) => a.name).join();
        console.log(`${key} param types: ${s}`);
    }
    /**
     * Reflect.getMetadata("design:returntype", target, key);
     */
    static setTimeout(waitTime: number = 20, callBack?: (result: any) => void) {
        return (target: any, key: string, descriptor: PropertyDescriptor) => {
            let originalMethod = descriptor.value;
            descriptor.value = function (...args: any[]) {
                setTimeout(() => {
                    let result = originalMethod.apply(this, args);
                    if (callBack) callBack(result);
                }, waitTime);
            }
            return descriptor;
        }
    }

}
