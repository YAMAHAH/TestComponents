export function applyMixins(derivedCtor: any, baseCtors: any[], excludeConstructor: boolean = true) {
    let excludes = ["length", "name", "prototype", "arguments", "caller"];
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (excludeConstructor) {
                if (name != 'constructor')
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
            } else {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
        Object.getOwnPropertyNames(baseCtor)
            .filter(p => excludes.indexOf(p) < 0)
            .forEach(name => {
                derivedCtor[name] = baseCtor[name];
            });
    });
}