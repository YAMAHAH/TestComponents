export class ArrayExtensions<T> extends Array<T> {

    /**
     * 集合交集
     * @param params 
     */
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

    /**
     * 集合并集
     * @param params 
     */
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
     * 集合去掉重复
     * @param first 
     */
    static uniquelize<T>(first: any[]) {
        let tmp = Object.create({}),
            ret: T[] = [];
        for (let i = 0, j = first.length; i < j; i++) {
            if (!tmp[first[i]]) {
                tmp[first[i]] = 1;
                ret.push(first[i]);
            }
        }
        return ret;
    }

    /**
     * 集合差集
     * @param first 已存在的数组
     * @param second 最新的数组
     */
    static except<T>(first: T[], second: T[] = []): T[] {
        let result = new Array<T>();
        let obj = Object.create({});
        for (let i = 0; i < second.length; i++) {
            obj[second[i]] = 1;
        }
        for (let j = 0; j < first.length; j++) {
            if (!obj[first[j]]) {
                obj[first[j]] = 1;
                result.push(first[j]);
            }
        }
        return result;
    }

    each(predicate: (element: T, index?: number) => T = (element, index) => element) {
        let results: T[] = [];
        for (let i = 0; i < this.length; i++) {
            let foundItem = predicate(this[i], i);
            if (foundItem != null) results.push(foundItem);
        }
        return results;
    }
    /**
     * 集合包含
     * @param value 
     */
    contains(value: T) {
        for (let i in this) {
            if (this[i] == value) return true;
        }
        return false;
    }
    uniquelizeWith(): T[] {
        let result = new Array();
        for (let i = 0; i < this.length; i++) {
            if (!result.contains(this[i])) {
                result.push(this[i]);
            }
        }
        return result;
    }

    /**
     * 获取两个数组的补集
     * @param first 第一个数组
     * @param second 第二个数组
     */
    complementWith(second: T[]): T[] {
        return this.unionWith(second).exceptWith(this.intersectWith(second));
    }

    /**
     * 获取两个数组的交集
     * @param first 第一个数组
     * @param second 第二个数组
     */
    intersectWith(second: T[]): T[] {
        return this.uniquelizeWith().each(x => second.contains(x) ? x : null);
    }
    /**
     * 获取两个数组的差集
     * @param first 第一个数组
     * @param second 第二个数组
     */
    exceptWith(second: T[]): T[] {
        return this.uniquelizeWith().each((x) => second.contains(x) ? null : x);
    }

    /**
     * 获取两个数组的并集
    * @param first 第一个数组
    * @param second 第二个数组
    */
    unionWith(second: T[]): T[] {
        return this.concat(second).uniquelizeWith();
    }
}
