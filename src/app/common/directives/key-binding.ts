import {
    Directive, OnChanges, OnDestroy, Input, SimpleChanges, ElementRef,
    SimpleChange, Optional, Host, SkipSelf,
} from '@angular/core';
import { AppStoreService } from '../../services/app.store.service';
import { Subscription } from 'rxjs/Subscription';
import { ComponentFactoryConatiner } from '../../pur/pur-order/ComponentFactoryConatiner';

@Directive({
    selector: '[keyBinding]'
})
export class KeyBindingDirective implements OnChanges, OnDestroy {
    @Input("keyBinding") keyBinding: string;
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

    private keyConst = "keyBinding";
    ngOnChanges(changes: SimpleChanges) {
        let target: HTMLElement = this.elementRef.nativeElement;
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                let change: SimpleChange = changes[key];
                if (key === this.keyConst && target) {
                    target.rightId = this.keyBinding;
                    target.id = this.keyBinding;
                    //一个容器有N个组件模板,每个模板有N个模板对象
                    //每个元素或组件绑定到模板对象ID,模板对象的从哪里获取???????
                    //根据idKEY获取模板对象??? 从哪里取?
                    //绑定模板对象信息到具体的元素或组件
                    this.container.getTemplateObject(this.keyBinding);
                }
                if (target && key == this.keyConst && change.firstChange) {
                    target.templateId = "" || this._templateId;
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

    unSubscribeFn: () => void;
    ngOnDestroy(): void {
        if (this.unSubscribeFn) this.unSubscribeFn();
    }

    printInfo(info: any) {
        // console.log(info);
    }
    applyRight(target: HTMLElement) {
        if (!!target.rightId) {
            // element.hidden = false;
            // element.style.visibility = ""; //可视
            // element.style.display = "";
            //required right.readOnly && self.readOnly
            // if (this.hasOwnProperty('required') || 'required' in this) { console.log("has required"); }
            // if (this.hasOwnProperty('readOnly') || 'readOnly' in this) { console.log("has readonly"); }
            // if (this.hasOwnProperty('disabled') || 'disabled' in this) { console.log("has disabled"); }
            // style.display="block"或style.visibility="visible"时控件或见;
            // style.display="none"或style.visibility="hidden"时控件不可见。
            this.printInfo("RightID:" + target.rightId);
        } else
            this.printInfo("权限ID为空,不能设置权限");
    }
    createElementSubscribe(target: HTMLElement) {
        //订阅全局
        let globalSubscription = this.appStore.rightSubject$
            .filter(x => x && x.templateId == target.templateId && x.rightId == target.rightId || true)
            .subscribe((x: any) => {
                this.applyRight(target);
            });
        //订阅容器
        let containerSubscription = this.container && this.container.containerSubject
            .filter(x => x && x.templateId == target.templateId && x.rightId == target.rightId)
            .subscribe(x => {
                this.applyRight(target);
            });
        //创建
        return () => {
            globalSubscription && globalSubscription.unsubscribe();
            containerSubscription && containerSubscription.unsubscribe();
        };
    }

    createElementMutaionObserver(target: HTMLElement) {
        let observer = target.observer = new MutationObserver((mutations, observer) => {
            mutations.forEach((mutation) => {
                console.log(mutation);
            });
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
                if (propertyKey in { "disabled": 1, "readOnly": 1, "required": 1, 'style': 1, "hidden": 1 }) {
                    //  console.log("rightKey:" + propertyKey.toString());
                } else {
                    //  console.log(propertyKey);
                }
                return Reflect.set(target, propertyKey, value, receiver);
                // throw new Error('');
            }
        };
        let proxy = new Proxy(Object.getPrototypeOf(target), handler);
        Object.setPrototypeOf(target, proxy);
        return proxy;
    }
}



export interface TemplateAction {
    /**
     * 模块ID
     */
    moduleId: string;
    /**
     * 模板ID
     */
    templateId: string;
    /**
     * 对象ID
     */
    objectId: string;
    /**
     * 对象名称
     */
    name: string;
    /**
     * 对象别名
     */
    objectAlias: string;
    /**
     * 对象前缀
     */
    prefix: string;

    /**
     * 可视
     */
    visible: boolean;
    /**
     * 可用
     */
    enabled: boolean;
    /**
     * 标题
     */
    text: string;
    componentType: string;
}