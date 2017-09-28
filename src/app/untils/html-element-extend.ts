
import { Injectable } from '@angular/core';

@Injectable()
export class HTMLElementExtendService {
    constructor() {

    }

    createDescriptor(element: HTMLElement, property: string): PropertyDescriptor {
        return {
            ...Object.getOwnPropertyDescriptor(element, property),
            ...{
                set(value: any) {
                    if (value)
                        this.setAttribute(property, value);
                    else
                        this.removeAttribute(property);
                }
            }
        };
    }

    initConfig(target: HTMLElement = HTMLElement.prototype) {
        // let _self = this;
        // target.moduleId = "";
        // target.templateId = "";
        // target.dataSourceName = "";
        // // target.objectId = "";
        // target.objectName = "";
        // // target.readOnly = false;
        // // target.required = false;
        // // target.disabled = false;
        // Object.defineProperties(target, {

        //     moduleId: this.createDescriptor(target, "moduleId"),
        //     templateId: this.createDescriptor(target, "templateId"),
        //     objectId: this.createDescriptor(target, "objectId"),
        //     required: this.createDescriptor(target, "required"),
        //     readOnly: this.createDescriptor(target, "readOnly"),
        //     disabled: this.createDescriptor(target, "disabled")
        // });
        // let _this = this;
        // element.templateId = "";
        // element._rightId = "";
        // element.subscribed = false;
        // element.readOnly = false;
        // element.required = false;
        // element.disabled = false;
        // Object.defineProperties(element, {
        //     rightId: {
        //         get: function () {
        //             return this._rightId;
        //         },
        //         set: function (newValue) {
        //             if (newValue === this._rightId) return;
        //             this._rightId = newValue;
        //             if (!this.subscribed && _this.rightObserver) {
        //               //  _this.rightObserver(this);
        //               //  this.subscribed = true;
        //               //  Object.setPrototypeOf(this, _this.createElementProxy(Object.getPrototypeOf(this)));
        //                // _this.createElementMutaionObserver(this);
        //             }
        //         }
        //     },
        //     // required: _this.createDescriptor(element, "required"),
        //     // readOnly: _this.createDescriptor(element, "readOnly"),
        //     // disabled: _this.createDescriptor(element, "disabled")
        // });


    }
}