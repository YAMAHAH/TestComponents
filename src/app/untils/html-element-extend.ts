import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AppStoreService } from '../services/app.store.service';
import { ObjectExtentions } from './object-extend';
import { isPDFPluginInstall } from './pdf-plugin';
import { extend } from './proxy';

@Injectable()
export class HTMLElementExtendService {
    constructor(private appStore: AppStoreService) {
    }

    rightObserver(element: HTMLElement = HTMLElement.prototype) {
        this.appStore.rightSubject$
            .filter(x => x.templateId == element.templateId)
            .subscribe((x: any) => {
                element.applyRight();
            });
    }

    applyRight() {
        //获取权限ID的权限数据,tempId,rightId
    }

    printInfo(info: any) {
        // console.log(info);
        // let Person = function (name: string) {
        //     this.name = name
        // };

        // let Boy = extend(Person, function (name: any, age: any) {
        //     this.age = age;
        // });

        // Boy.prototype.sex = "M";

        // var Peter = new Boy("Peter", 13);
        // console.log(Peter.sex);  // "M"
        // console.log(Peter.name); // "Peter"
        // console.log(Peter.age);  // 13
    }

    createElementProxy(element: HTMLElement = HTMLElement.prototype) {
        // let names = Object.getOwnPropertyNames(HTMLElement.prototype);
        // let getters = names.filter((name) => {
        //     let result = Object.getOwnPropertyDescriptor(HTMLElement.prototype, name);
        //     return !!result.get;
        // });
        // let setters = names.filter((name) => {
        //     let result = Object.getOwnPropertyDescriptor(HTMLElement.prototype, name);
        //     return !!result.set;
        // });
        let handler = {
            get(target: any, propertyKey: PropertyKey, receiver: any) {
                // if (typeof key === "string" && getters.indexOf(key) != -1) {
                //     return target[key];
                // }
                return Reflect.get(target, propertyKey, receiver);
                // throw new Error('');
            },
            set(target: any, propertyKey: PropertyKey, value: any, receiver?: any) {
                // if (typeof key === "string" && setters.indexOf(key) != -1) {
                //     return target[key];
                // }
                if (propertyKey in { "required": "1", "readOnly": "1", "requried": "1", "display": "1", "hidden": "1" }) {
                    console.log("rightKey:" + propertyKey.toString());
                } else {
                    console.log(propertyKey);
                }
                return Reflect.set(target, propertyKey, value, receiver);
                // throw new Error('');
            }
        };
        return new Proxy(element, handler);
    }

    createDescriptor(element: HTMLElement, property: string): PropertyDescriptor {
        return {
            ...Object.getOwnPropertyDescriptor(element, property),
            ...{
                set(value: any) {
                    console.log(element);
                    if (value)
                        this.setAttribute(property, value);
                    else
                        this.removeAttribute(property);
                }
            }
        };
    }


    initConfig(element: HTMLElement = HTMLElement.prototype) {

        let _this = this;
        element.templateId = "";
        element._rightId = "";
        element.subscribed = false;
        Object.defineProperties(element, {
            rightId: {
                get: function () {
                    return this._rightId;
                },
                set: function (newValue) {
                    if (newValue === this._rightId) return;
                    this._rightId = newValue;
                    if (!this.subscribed && _this.rightObserver) {
                        _this.rightObserver(this);
                        this.subscribed = true;
                        this.__proto__ = _this.createElementProxy(this.__proto__);
                    }
                }
            },
            required: _this.createDescriptor(element, "required"),
            readOnly: _this.createDescriptor(element, "readOnly"),
            disabled: _this.createDescriptor(element, "disabled")
        });

        element.applyRight = function () {
            if (!!this._rightId) {
                // element.hidden = false;
                // element.style.visibility = ""; //可视
                // element.style.display = "";
                //required right.readOnly && self.readOnly
                // if (this.hasOwnProperty('required') || 'required' in this) { console.log("has required"); }
                // if (this.hasOwnProperty('readOnly') || 'readOnly' in this) { console.log("has readonly"); }
                // if (this.hasOwnProperty('disabled') || 'disabled' in this) { console.log("has disabled"); }
                // style.display="block"或style.visibility="visible"时控件或见;
                // style.display="none"或style.visibility="hidden"时控件不可见。
                _this.printInfo("RightID:" + this._rightId);
            } else
                _this.printInfo("权限ID为空,不能设置权限");
        }
    }
}