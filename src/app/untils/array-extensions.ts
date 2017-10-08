export class ArrayExtensions<T> extends Array<T> {
    //集合取交集
    intersect(...params: T[]) {
        let first = arguments[0] || [];
        arguments[0] = this.concat(first);
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
    uniquelize() {
        let tmp = Object.create({}),
            ret: T[] = [];
        for (let i = 0, j = this.length; i < j; i++) {
            if (!tmp[this[i]]) {
                tmp[this[i]] = 1;
                ret.push(this[i]);
            }
        }
        return ret;
    }
    // //并集
    union(...params: T[]): T[] {
        let first = arguments[0] || [];
        arguments[0] = this.concat(first);
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
     * 计算出已存在的数组中没有的元素
     * @param first 已存在的数组
     * @param second 最新的数组
     */
    except(second: T[] = []): T[] {
        let result = new Array<T>();
        let obj = Object.create({});
        for (let i = 0; i < second.length; i++) {
            obj[second[i]] = 1;
        }
        for (let j = 0; j < this.length; j++) {
            if (!obj[this[j]]) {
                obj[this[j]] = 1;
                result.push(this[j]);
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

    contains(value: T) {
        for (let i in this) {
            if (this[i] == value) return true;
        }
        return false;
    }
    uniquelize2(): T[] {
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
    complement(second: T[]): T[] {
        return this.union2(second).except2(this.intersect2(second));
    }

    /**
     * 获取两个数组的交集
     * @param first 第一个数组
     * @param second 第二个数组
     */
    intersect2(second: T[]): T[] {
        return this.uniquelize2().each(x => second.contains(x) ? x : null);
    }
    /**
     * 获取两个数组的差集
     * @param first 第一个数组
     * @param second 第二个数组
     */
    except2(second: T[]): T[] {
        return this.uniquelize2().each((x) => second.contains(x) ? null : x);
    }

    /**
     * 获取两个数组的并集
    * @param first 第一个数组
    * @param second 第二个数组
    */
    union2(second: T[]): T[] {
        return this.concat(second).uniquelize2();
    }
}