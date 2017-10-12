export function applyMixins(derivedCtor: any, baseCtors: any[], excludeConstructor: boolean = true) {
    let excludes = ["length", "name", "prototype", "arguments", "caller"];
    baseCtors.forEach(baseCtor => {
        let memberNames = Object.getOwnPropertyNames(baseCtor.prototype);
        let propDescMap = new Map<string, PropertyDescriptor>();
        let propNames = memberNames.filter((name) => {
            let result = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
            let isProp = !!result.get || !!result.set;
            if (isProp) propDescMap.set(name, result);
            return isProp;
        });
        memberNames.forEach(name => {
            if (propNames.indexOf(name) > -1) {
                Reflect.defineProperty(derivedCtor.prototype, name, propDescMap.get(name));
            } else {
                if (excludeConstructor) {
                    if (name != 'constructor')
                        derivedCtor.prototype[name] = baseCtor.prototype[name];
                } else {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            }
        });
        let staticMemberNames = Object.getOwnPropertyNames(baseCtor);
        let staticPropDescMap = new Map<string, PropertyDescriptor>();
        let staticPropNames = staticMemberNames.filter((name) => {
            let result = Object.getOwnPropertyDescriptor(baseCtor, name);
            let isProp = !!result.get || !!result.set;
            if (isProp) staticPropDescMap.set(name, result);
            return isProp;
        });
        staticMemberNames
            .filter(p => excludes.indexOf(p) < 0)
            .forEach(name => {
                if (staticPropNames.indexOf(name) > -1) {
                    Reflect.defineProperty(derivedCtor, name, staticPropDescMap.get(name));
                } else {
                    derivedCtor[name] = baseCtor[name];
                }
            });
    });
}