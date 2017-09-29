import {
    Directive, OnChanges, OnDestroy, Input, SimpleChanges, ElementRef,
    SimpleChange, Optional, Host, SkipSelf,
} from '@angular/core';
import { AppStoreService } from '../../services/app.store.service';
import { Subscription } from 'rxjs/Subscription';
import { ComponentFactoryConatiner } from '../../pur/pur-order/ComponentFactoryConatiner';
import { HostBinding } from '@angular/core';
import { isFunction } from 'util';

@Directive({
    selector: '[keyBinding]'
})
export class KeyBindingDirective implements OnChanges, OnDestroy {

    // @HostBinding("objectId")
    @Input("keyBinding") objectId: string;

    // @HostBinding("templateId")
    @Input() get templateId(): string {
        return this._templateId;
    }
    private _templateId: string;
    set templateId(value: string) {
        if (this._templateId != value)
            this._templateId = value;
        this.elementTemplateId = value;
    }
    constructor(private appStore: AppStoreService,
        @Optional() private container: ComponentFactoryConatiner,
        private elementRef: ElementRef) { }

    get target() {
        return <HTMLElement>this.elementRef.nativeElement;
    }
    set elementTemplateId(value: string) {
        if (this.target && value != this.target.templateId) {
            this.target.templateId = value;
            this._templateId = value;
        }
    }

    // @HostBinding("prefix")
    @Input() prefix: string = "自定义指令前缀";

    // @HostBinding("moduleId")
    @Input() moduleId: string;

    private _objectName: string;
    // @HostBinding("objectName")
    get objectName(): string {
        return this._objectName;
    }

    set objectName(newValue: string) {
        this._objectName = newValue;
    }
    private keyConst = "objectId";
    ngOnChanges(changes: SimpleChanges) {
        let target: HTMLElement = this.elementRef.nativeElement;
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                let change: SimpleChange = changes[key];

                if (key === this.keyConst && target) {
                    let tempObject = this.container.getTemplateClassObject(this.objectId);

                    target.objectId = tempObject.objectId;
                    target.id = tempObject.objectId;

                    if (change.firstChange) {
                        // target.moduleId = this.objectId;
                        // target.setAttribute("templateId", this.objectId);
                        //target.templateId = "" || tempObject.templateId;
                        //target.dataSourceName = this.objectId;
                        // target.objectName = tempObject.name;
                        // this._objectName = tempObject.objectId;
                        target.readOnly = false;
                        target.required = false;
                        target.disabled = false;
                        target.hidden = false;
                        //创建订阅
                        this.unSubscribeFn = this.createElementSubscribe(target);
                        //创建代理
                        this.createElementProxy(target);
                        //创建变化观察者
                        this.createElementMutaionObserver(target);
                    }
                }
            }
        }
    }
    unSubscribeFn: () => void;
    ngOnDestroy(): void {
        if (this.unSubscribeFn) this.unSubscribeFn();
    }

    applyChildAuthorize(target: HTMLElement, objectId: string) {
        if (!!!target.objectId && target && !!objectId) {
            let tempObject = this.container.getTemplateClassObject(objectId);
            target.required = tempObject.required;
            if (!tempObject.editable) target.readOnly = true;
            if (!tempObject.enabled) target.disabled = true;
            if (!tempObject.visible) {
                target.style.display = "none";
                target.style.visibility = "hidden";
                target.hidden = true;
            }
            for (let index = 0; index < target.children.length; index++) {
                let childElement = target.children[index];
                this.applyChildAuthorize(<HTMLElement>childElement, objectId);
            }
        }
    }
    loopCtrlVar: number = 0;
    private authorizeProcessing: boolean = false;
    applyAuthorize(target: HTMLElement) {
        this.loopCtrlVar++;
        if (this.loopCtrlVar < 3 && !this.authorizeProcessing && !!target.objectId) {
            this.authorizeProcessing = true;
            let tempObject = this.container.getTemplateClassObject(this.objectId);
            target.required = tempObject.required;
            if (!tempObject.editable) target.readOnly = true;
            if (!tempObject.enabled) target.disabled = true;
            if (!tempObject.visible) {
                target.style.display = "none";
                target.style.visibility = "hidden";
                target.hidden = true;
            }
            for (let index = 0; index < target.children.length; index++) {
                let childElement = target.children[index];
                this.applyChildAuthorize(<HTMLElement>childElement, this.objectId);
            }
        }
        this.authorizeProcessing = false;
        if (this.loopCtrlVar > 2) this.loopCtrlVar = 0;
    }
    createElementSubscribe(target: HTMLElement) {
        //订阅全局
        let globalSubscription = this.appStore.rightSubject$
            .distinctUntilChanged()
            .filter(x => x && x.templateId == target.templateId && x.objectId == target.objectId || true)
            .subscribe((x: any) => {
                if (x) {
                    this.applyAuthorize(target);
                }
            });
        //订阅容器
        let containerSubscription = this.container && this.container.containerSubject
            .filter(x => x && x.templateId == target.templateId && x.objectId == target.objectId)
            .subscribe(x => {
                if (x)
                    this.applyAuthorize(target);
            });
        //创建
        return () => {
            globalSubscription && globalSubscription.unsubscribe();
            containerSubscription && containerSubscription.unsubscribe();
        };
    }
    private propertyChanged: boolean = false;
    createElementMutaionObserver(target: HTMLElement) {
        let observer = target.observer = new MutationObserver((mutations, observer) => {
            mutations.forEach((mutation) => {
                console.log(mutation);
            });
            this.loopCtrlVar++;
            console.log(this.loopCtrlVar);
            if (this.loopCtrlVar < 3 && !this.authorizeProcessing && target.objectId)
                this.applyAuthorize(target);
            if (this.loopCtrlVar > 2) this.loopCtrlVar = 0;

        });
        let config: MutationObserverInit = {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: [
                'style',
                'readOnly',
                'required',
                'disabled',
                'hidden'
            ]
        };
        observer.observe(target, config);
    }
    createElementProxy(target: HTMLElement) {
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
                // let value = target[propertyKey];
                // if (typeof propertyKey === "string" && getters.indexOf(propertyKey) != -1) {
                //     return target[propertyKey];
                // }
                // if (isFunction(value)) {
                //     console.log("method");
                //     return function (...argumens: any[]) {
                //         // logMethodAsync(new Date(), key);
                //         return Reflect.apply(value, target, arguments);
                //     };
                // } else
                return Reflect.get(target, propertyKey, receiver);
            },
            set(target: any, propertyKey: PropertyKey, value: any, receiver?: any) {
                // if (typeof key === "string" && setters.indexOf(key) != -1) {
                //     return target[key];
                // }
                if (propertyKey in { "disabled": "disabled", "readOnly": "readOnly", "required": "required", 'style': "style", "hidden": "hidden" }) {
                    let res = Reflect.set(target, propertyKey, value, receiver);
                    return res;
                } else {
                    return Reflect.set(target, propertyKey, value, receiver);
                }
            },
            apply(target: any, thisBinding: any, ...args: any[]) {
                console.log(target);
                return Reflect.apply(target, thisBinding, args);
            },
            construct(target: any, ...args: any[]) {
                return Reflect.construct(target, args);
            }
        };
        let proxy = new Proxy(Object.getPrototypeOf(target), handler);
        Object.setPrototypeOf(target, proxy);
        return proxy;
    }
}
