import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AppStoreService } from '../services/app.store.service';
import { ObjectExtentions } from './object-extend';

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
    
    printInfo(info:any){
        console.log(info);
    }


    initConfig(element: HTMLElement = HTMLElement.prototype) {
        let self = this;
        element.templateId = "";
        element._rightId = "";
        element.subscribed = false;
        ObjectExtentions.defineProperty(element, "rightId", {
            get: function () {
                return this._rightId;
            },
            set: function (newValue) {
                if (newValue === this._rightId) return;
                this._rightId = newValue;
                if (!this.subscribed && self.rightObserver) {
                    self.rightObserver(this);
                    this.subscribed = true;
                }
            }
        });
        element.applyRight = function () {
            if (!!this._rightId) {
               self.printInfo("RightID:" + this._rightId);
            } else
               self.printInfo("权限ID为空,不能设置权限");
        }
    }
}