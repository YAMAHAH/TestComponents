import { AppStoreService } from '../services/app.store.service';
import { IAction } from '../Models/IAction';
import { OnInit, OnDestroy } from '@angular/core';
import { Type, Provider, forwardRef } from "@angular/core";

export abstract class Base implements OnInit, OnDestroy {
    constructor(private appStore: AppStoreService) {

    }
    key: string;
    name: string;
    title: string;
    childs: Base[] = [];

    parent: Base;
    dispatch(action: IAction, hasState: boolean = false) {
        this.appStore.dispatch(action, hasState);
    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    getComponentTree() {
        let expand = (comp: Base): { [key: string]: Base } => {
            let dict: { [key: string]: Base } = {};
            dict[comp.name] = comp;
            comp.childs.forEach(child => {
                dict = Object.assign(dict, expand(child));
            });
            return dict;
        }
        return expand(this);
    }

    searchUpByLevel(rootComp: Base, predicate: (comp: Base) => boolean): Base {
        let compChilds = [rootComp] || [];
        let p;
        while (compChilds.length > 0) {
            let curComp = compChilds.shift();
            if (predicate(curComp)) { return curComp; }
            p = curComp.parent.parent;
            p && p.childs.forEach(c => {
                compChilds.push(c);
            });
        }
        return null;
    }

    searchDownByLevel(rootComp: Base, predicate: (comp: Base) => boolean): Base {
        let compChilds = [rootComp] || [];
        while (compChilds.length > 0) {
            let curComp = compChilds.shift();
            if (predicate(curComp)) { return curComp; }
            curComp.childs.forEach(c => {
                compChilds.push(c);
            });
        }
        return null;
    }
    expand(comp: Base, callback: (comp: Base) => void) {
        callback(comp);
        comp.childs.forEach(c => {
            this.expand(c, callback);
        });
    }

    /**
   * 从指定的组件开始向下寻找目标组件
   */
    findChildComp(comp: string | Base, startComp: Base): Base {
        let result: Base = null;

        if (typeof (comp) === 'string') {
            if (startComp.name === comp) {
                return result = startComp;
            }
        } else if (comp instanceof Base) {
            if (startComp === comp) {
                return result = startComp;
            }
        }
        startComp.childs.forEach(child => {
            if (typeof (comp) === 'string') {
                if (child.name === comp) {
                    return result = child;
                }
            } else if (comp instanceof Base) {
                if (child === comp) return result = child;
            }
        });
        startComp.childs.forEach(element => {
            result = this.findChildComp(comp, element);
            if (result) return result;
        });
        return result;
    }

    findComponent<T extends Base>(comp: string): T {
        let key: string = <string>comp;
        let findComp = this.getComponentTree()[key];
        return findComp ? findComp as T : null;
    }
    /**
     * 根据指定的条件向上查找组件
     */
    searchUp(startComp: Base, predicate: (comp: Base) => boolean): Base {
        let result: Base = null;
        if (predicate(startComp)) {
            return result = startComp;
        }
        result = this.searchUp(startComp.parent, predicate);
        if (result) return result;
        return result;
    }

    searchDown(startComp: Base, predicate: (comp: Base) => boolean): Base {
        let result: Base = null;
        result = predicate(startComp) ? startComp : null || startComp.childs.filter(predicate)[0];
        if (result) return result;
        startComp.childs.forEach(element => {
            element.childs.forEach(element => {
                result = this.searchDown(element, predicate);
                if (result) return result;
            });
        });
        return result;
    }

    /**
     * 从指定的部件开始往上寻找目标组件
     */
    findComp(comp: string | Type<Base>, startComp: Base): Base {
        let result: Base = null;
        if (typeof (comp) === 'string') {
            if (startComp.name === comp) {
                return result = startComp;
            }
        } else if (comp instanceof Base) {
            if (startComp === comp) {
                return result = startComp;
            }
        }

        if (startComp.parent) {
            startComp.parent.childs.forEach(child => {
                if (typeof (comp) === 'string') {
                    if (child.name === comp) {
                        return result = child;
                    }
                } else if (comp instanceof Base) {
                    if (child === comp) return result = child;
                }
            });
            result = this.findComp(comp, startComp.parent);
            if (result) return result;
        }
        return result;
    }

    getComp<T extends Base>(comp: string | Type<T>, startNode: Base): T {
        return this.findComp(comp, startNode) as T;
    }

    findComponentList(type: Type<Base>, first?: boolean): Base | Base[] {
        let typeList = new Array<Base>();
        let object = this.getComponentTree();
        for (let key in object) {
            let element = object[key];
            if (element instanceof type) {
                if (first) { return element; }
                typeList.push(element);
            }
        }
        return typeList;
    }
    getComponent(compKey: string) {
        let findComp = this.getComponentTree()[compKey];
        return findComp ? findComp : null;
    }

    /**
     * 调用方法
     */
    callMethod(method: string, params?: any[]) {
        return this[method] ? this[method].call(this, params) : null;
    }
    /**
     * 获取属性
     */
    getProperty(propertyName: string) {
        return this.hasOwnProperty(propertyName) ? this[propertyName] : null;
    }

}

// export const provideParent = (component: any, parentType?: any) => provide(parentType || Base, { useExisting: forwardRef(() => component) });

// export const provideTheParent = (component: any) => provide(Base, { useExisting: forwardRef(() => component) });


