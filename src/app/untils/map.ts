import { Type } from '@angular/core';
export class mapUntils {
    static mapToObject(map: any) {
        let obj = {};
        for (let [key, value] of map) {
            obj[key] = value;
        }
        return obj;
    }
    static findInstanceInMap(map: any, type: Type<any>) {
        for (let [key, value] of map) {
            if (value instanceof type) return value;
        }
    }

    static mapToArray<K, V>(map: any): [K, V][] {
        return [...map];
    }

    static arrayToMap<K, V>(entries?: [K, V][]) {
        return new Map(entries);
    }
    static mapForEach(map: any, callBack: {}) {
        let reporter = {
            report: (key: any, value: any) => {

            }
        };
        map.forEach(function (value: any, key: any, map: any) {
            this.report(key, value);
        }, reporter);
    }
    static objectToMap(obj: any) {
        let map = new Map();
        for (let key of Object.keys(obj)) {
            map.set(key, obj[key]);
        }
        return map;
    }

    static merge(...sources: any[]) {
        return Object.assign({}, ...sources);
    }
    static objectsToMap(...objs: any[]) {
        let mergeObj = this.merge(objs);
        let map = new Map();
        for (let key of Object.keys(mergeObj)) {
            map.set(key, mergeObj[key]);
        }
        return map;
    }

    static mapToJson(map: any) {
        let keys = map.keys();
        let isAllKeyStr = true;
        for (let key of keys) {
            if (!((typeof key === 'string') && (key.constructor === String))) {
                isAllKeyStr = false;
                break;
            }
        }
        if (isAllKeyStr) {
            return JSON.stringify(mapUntils.mapToObject(map));
        } else {
            return JSON.stringify([...map]);
        }
    }

    static jsonToMap(json: any) {
        let _json = JSON.parse(json);
        if (Array.isArray(_json)) {
            return new Map(JSON.parse(json));
        } else {
            return mapUntils.objectToMap(JSON.parse(json));
        }
    }
}