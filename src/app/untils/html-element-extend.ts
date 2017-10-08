
import { Injectable } from '@angular/core';

@Injectable()
export class HTMLElementExtendService {
    constructor() {

    }

    createDescriptor(element: HTMLElement, property: string): PropertyDescriptor {
        return {
            ...Object.getOwnPropertyDescriptor(element, property),
            ...{
                set: function (value: any) {
                    // return Reflect.set(element, '_' + property, value);
                    // this.setAttribute(property, value);
                    if (value)
                        this.setAttribute(property, value);
                    else
                        this.removeAttribute(property);
                },
                // get: function () {
                //     return this.hasAttribute(property) ? this.getAttribute(property) : 
                // }
            }
        };
    }

    initConfig(target: HTMLElement = HTMLElement.prototype) {
        Reflect.defineProperty(target, "readOnly", {
            get() {
                return this._readonly;
            },
            set(value: boolean) {
                if (value != this._readonly)
                    this._readonly = value;
            },
            configurable: true,
            enumerable: true
        })
        Reflect.defineProperty(target, "required", {
            get() {
                return this._required;
            },
            set(value: boolean) {
                if (value != this._required)
                    this._required = value;
            },
            configurable: true,
            enumerable: true
        });
        Reflect.defineProperty(target, "disabled", {
            get() {
                return this._disabled;
            },
            set(value: boolean) {
                if (value != this._disabled)
                    this._disabled = value;
            },
            configurable: true,
            enumerable: true
        });
        Reflect.defineProperty(target, "hidden", {
            get() {
                return this._hidden;
            },
            set(value: boolean) {
                if (value != this._hidden)
                    this._hidden = value;
            },
            configurable: true,
            enumerable: true
        });
        Reflect.defineProperty(target, "templateId", {
            get() {
                return this._templateId;
            },
            set(value: boolean) {
                if (value != this._templateId)
                    this._templateId = value;
            },
            configurable: true,
            enumerable: true
        });
        Reflect.defineProperty(target, "objectId", {
            get() {
                return this._objectId;
            },
            set(value: boolean) {
                if (value != this._objectId)
                    this._objectId = value;
            },
            configurable: true,
            enumerable: true
        });
    }
}