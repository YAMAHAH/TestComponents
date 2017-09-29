(function (window, undefined: any) {
    function aspect(type: string) {
        return function (target: any, methodName: string, advice: any) {
            var exist = target[methodName],
                dispatcher: any;

            if (!exist || exist.target != target) {
                dispatcher = target[methodName] = function () {
                    // before methods
                    var beforeArr = dispatcher.before;
                    var args = arguments;
                    for (var l = beforeArr.length; l--;) {
                        args = beforeArr[l].advice.apply(this, args) || args;
                    }
                    // target method
                    var rs = dispatcher.method.apply(this, args);
                    // after methods
                    var afterArr = dispatcher.after;
                    for (var i = 0, ii = afterArr.length; i < ii; i++) {
                        rs = afterArr[i].advice.call(this, rs, args) || rs;
                    }
                    // return object
                    return rs;
                }

                dispatcher.before = [];
                dispatcher.after = [];

                if (exist) {
                    dispatcher.method = exist;
                }
                dispatcher.target = target;
            }

            var aspectArr = (dispatcher || exist)[type];
            var obj = {
                advice: advice,
                _index: aspectArr.length,
                remove: function () {
                    aspectArr.splice(this._index, 1);
                }
            };
            aspectArr.push(obj);

            return obj;
        };
    }

    window['aspect'] = {
        before: aspect("before"),
        after: aspect("after")
    };

    return window['aspect'];

})(window, undefined);