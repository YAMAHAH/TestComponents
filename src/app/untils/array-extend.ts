export class ArrayExtend {
    //集合取交集
    static intersect<T>(...params: T[]) {
        let result = new Array<T>();
        let obj = {};
        for (let i = 0; i < arguments.length; i++) {
            for (let j = 0; j < arguments[i].length; j++) {
                let str = arguments[i][j];
                if (!obj[str]) {
                    obj[str] = 1;
                }
                else {
                    obj[str]++;
                    if (obj[str] == arguments.length) {
                        result.push(str);
                    }
                }
            }
        }
        return result;
    }

    //集合去掉重复
    static uniquelize<T>(exists: T[]) {
        let tmp = Object.create({}),
            ret: T[] = [];
        for (let i = 0, j = exists.length; i < j; i++) {
            if (!tmp[exists[i]]) {
                tmp[exists[i]] = 1;
                ret.push(this[i]);
            }
        }
        return ret;
    }
    // //并集
    static union<T>(...params: T[]): T[] {
        let results = new Array<T>();
        let obj = {};
        for (let i = 0; i < arguments.length; i++) {
            for (let j = 0; j < arguments[i].length; j++) {
                let str = arguments[i][j];
                if (!obj[str]) {
                    obj[str] = 1;
                    results.push(str);
                }
            }
        }
        return results;
    }

    /**
     * 计算出已存在的数组中没有的无素
     * @param first 已存在的数组
     * @param second 最新的数组
     */
    static except<T>(first: T[], second: T[]): T[] {
        let result = new Array<T>();
        let obj = Object.create({});
        for (let i = 0; i < first.length; i++) {
            obj[first[i]] = 1;
        }
        for (let j = 0; j < second.length; j++) {
            if (!obj[second[j]]) {
                obj[second[j]] = 1;
                result.push(second[j]);
            }
        }
        return result;
    }

    static each<T>(source: T[], predicate: (element: T, index?: number) => T = (element, index) => element) {
        let results: T[] = [];
        for (let i = 0; i < source.length; i++) {
            let foundItem = predicate(source[i], i);
            if (foundItem != null) results.push(foundItem);
        }
        return results;
    }

    static contains<T>(source: T[], value: T) {
        for (let i in source) {
            if (source[i] == value) return true;
        }
        return false;
    }
    static uniquelize2<T>(source: T[]): T[] {
        source = source || [];
        let result = new Array();
        for (let i = 0; i < source.length; i++) {
            if (!this.contains(result, source[i])) {
                result.push(source[i]);
            }
        }
        return result;
    }

    /**
     * 获取两个数组的补集
     * @param first 第一个数组
     * @param second 第二个数组
     */
    static complement<T>(first: T[], second: T[]): T[] {
        return this.except2(this.union2(first, second), this.intersect2(first, second));
    }

    /**
     * 获取两个数组的交集
     * @param first 第一个数组
     * @param second 第二个数组
     */
    static intersect2<T>(first: T[], second: T[]): T[] {
        return this.each(this.uniquelize2(first), (x) => this.contains(second, x) ? x : null);
    }
    /**
     * 获取两个数组的差集
     * @param first 第一个数组
     * @param second 第二个数组
     */
    static except2<T>(first: T[], second: T[]): T[] {
        return this.each(this.uniquelize2(first), (x) => this.contains(second, x) ? null : x);
    }

    /**
     * 获取两个数组的并集
    * @param first 第一个数组
    * @param second 第二个数组
    */
    static union2<T>(first: T[], second: T[]): T[] {
        return this.uniquelize2(first.concat(second));
    }
}