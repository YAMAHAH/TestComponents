export function extend(sup: any, base: any) {
    var descriptor = Object.getOwnPropertyDescriptor(
        base.prototype, "constructor"
    );
    base.prototype = Object.create(sup.prototype);
    var handler = {
        construct: function (target: any, args: any[]) {
            var obj = Object.create(base.prototype);
            this.apply(target, obj, args);
            return obj;
        },
        apply: function (target: any, that: any, args: any[]) {
            sup.apply(that, args);
            base.apply(that, args);
        }
    };
    var proxy = new Proxy(base, handler);
    descriptor.value = proxy;
    Object.defineProperty(base.prototype, "constructor", descriptor);
    return proxy;
}