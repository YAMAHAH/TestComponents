exports.before = function (methodName: string, callback: any, context: any) {
    return weave.call(this, "before", methodName, callback, context);
};

exports.after = function (methodName: string, callback: any, context: any) {
    return weave.call(this, "after", methodName, callback, context);
};
function weave(when: string, methodName: string, callback: any, context: any) {
    var names = methodName.split(/\s+/);
    var name, method;
    while (name = names.shift()) {
        // this 指向基于 Base 生成的类的实例，如上例的 dialog
        method = getMethod(this, name);
        // 如果该函数（show）是第一次切面化绑定，则包装该函数。
        // 被包装的函数在执行前后都会触发下面注册的事件。
        if (!method.__isAspected) {
            wrap.call(this, name);
        }
        // 注册事件：例如 after:show 、 before:show .
        this.on(when + ":" + name, callback, context);
    }
    return this;
}
// 在实例中查找该方法，若没有则抛出异常
function getMethod(host: any, methodName: string) {
    var method = host[methodName];
    if (!method) {
        throw new Error('Invalid method name: ' + methodName);
    }
    return method;
}
// 包装器，使该函数（show）支持切面化
function wrap(methodName: string) {
    // 保存旧的方法，this 指向该对象（dialog）
    var old = this[methodName];
    // 定义新的方法，并在旧方法之前触发 before 绑定的函数，之后触发 after 绑定的函数
    this[methodName] = function () {
        var args = Array.prototype.slice.call(arguments);
        var beforeArgs = ["before:" + methodName].concat(args);
        // 触发 before 绑定的函数，如果返回 false 则阻止原函数 （show） 执行
        if (this.trigger.apply(this, beforeArgs) === false) return;
        // 执行旧的函数，并将返回值当作参数传递给 after 函数
        var ret = old.apply(this, arguments);
        var afterArgs = ["after:" + methodName, ret].concat(args);
        // 触发 after 绑定的函数，绑定的函数的第一个参数是旧函数的返回值
        this.trigger.apply(this, afterArgs);
        return ret;
    }
    // 包装之后打个标记，不用再重复包装了
    this[methodName].__isAspected = true;
}