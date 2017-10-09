import {
    Directive, OnChanges, OnDestroy, Input, SimpleChanges, ElementRef,
    SimpleChange, Optional
} from '@angular/core';
import { AppStoreService } from '../../services/app.store.service';
import { Subscription } from 'rxjs/Subscription';
import { ComponentFactoryConatiner } from '../../pur/pur-order/ComponentFactoryConatiner';
import { Subject } from 'rxjs/Rx';
import { AuthorizeModel } from '../../Models/authorizeModel';

@Directive({
    selector: '[keyBinding]'
})
export class KeyBindingDirective implements OnChanges, OnDestroy {

    @Input("keyBinding") objectId: string;

    @Input() modelRef: AuthorizeModel;
    @Input() get templateId(): string {
        return this._templateId;
    }

    private _templateId: string;
    set templateId(value: string) {
        if (this._templateId != value)
            this._templateId = value;
    }
    constructor(private appStore: AppStoreService,
        @Optional() private container: ComponentFactoryConatiner,
        private elementRef: ElementRef) {
    }

    get target() {
        return <HTMLElement>this.elementRef.nativeElement;
    }
    set elementTemplateId(value: string) {
        if (this.target && value != this.target.templateId) {
            this.target.templateId = value;
            this._templateId = value;
        }
    }
    private keyConst = "objectId";
    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                let change: SimpleChange = changes[key];

                if (key === this.keyConst && this.target) {
                    this.target.id = this.objectId;
                    this.target.objectId = this.objectId;
                    if (change.firstChange) {
                        //创建订阅
                        this.unSubscribeFn = this.createElementSubscribe();
                        //创建代理
                        this.createTargetProxy(this.target);
                        if (this.modelRef) this.createTargetProxy(this.modelRef);
                        //创建变化观察者
                        this.createElementMutaionObserver(this.target);
                    }
                }
            }
        }
    }
    unSubscribeFn: () => void;

    createChildElementProxyAndMutaion(target: HTMLElement) {
        if (!!!target.objectId && target) {
            if (!!!target.observer)
                this.createElementMutaionObserver(target);
            if (!!!target.isProxy)
                this.createTargetProxy(target);
            for (let index = 0; index < target.children.length; index++) {
                let childElement = target.children[index];
                this.createChildElementProxyAndMutaion(<HTMLElement>childElement);
            }
        }
    }
    ngOnDestroy(): void {
        if (this.unSubscribeFn) this.unSubscribeFn();
    }

    applyChildAuthorize(target: HTMLElement, objectId: string) {
        if (!!!target.objectId && target && !!objectId) {
            if (!!!target.observer) {
                this.createChildElementMutaionObserver(target);
            }
            if (!!!target.isProxy) {
                this.createTargetProxy(target);
            }

            let tempObject = this.container.getTemplateClassObject(objectId);
            target.required = tempObject.required;

            if (!tempObject.editable)
                target.readOnly = true;

            if (!tempObject.enabled)
                target.disabled = true;

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

    hasAttribute(attribute: string) {
        return (attribute in this.target || this.target.hasOwnProperty(attribute) || this.target.hasAttribute(attribute));
    }
    //  获取对象的原型链
    getPrototypeChain(target: HTMLElement) {
        let result = [], proto = target;
        while (proto != null) {
            proto = Object.getPrototypeOf(target);
            if (proto != null) {
                result.push(proto);
                target = proto;
            }
        }
        return result;
    }
    private authorizeProcessing: boolean = false;
    applyAuthorize() {
        this.loopCtrlVar++;
        if (this.loopCtrlVar < 3 && !this.authorizeProcessing && !!this.objectId) {
            this.authorizeProcessing = true;
            let tempObject = this.container.getTemplateClassObject(this.objectId);

            this.target.required = tempObject.required;
            if (this.modelRef) {
                this.modelRef.required = tempObject.required;
            }

            if (!tempObject.editable) {
                this.target.readOnly = true;
                if (this.modelRef) {
                    this.modelRef.editable = false;
                }
            }

            if (!tempObject.enabled) {
                this.target.disabled = true;
                if (this.modelRef) {
                    this.modelRef.enabled = false;
                }
            }

            if (!tempObject.visible) {
                this.target.style.display = "none";
                this.target.style.visibility = "hidden";
                this.target.hidden = true;
                if (this.modelRef) {
                    this.modelRef.visible = false;
                }
            }
            for (let index = 0; index < this.target.children.length; index++) {
                let childElement = this.target.children[index];
                this.applyChildAuthorize(<HTMLElement>childElement, this.objectId);
            }
        }
        this.authorizeProcessing = false;
        if (this.loopCtrlVar > 2) this.loopCtrlVar = 0;
    }
    createElementSubscribe() {
        this.updateAuthorize$
            .debounceTime(200)
            .subscribe(res => {
                this.updateAuthorize();
                this.authorizeUpdated = false;
            });
        //订阅全局
        let globalSubscription = this.appStore.rightSubject$
            .distinctUntilChanged()
            .filter(x => x && x.templateId == this.templateId && x.objectId == this.objectId || true)
            .subscribe((x: any) => {
                if (x) {
                    this.applyAuthorize();
                }
            });
        //订阅容器
        let containerSubscription = this.container && this.container.containerSubject
            .filter(x => x && x.templateId == this.templateId && x.objectId == this.objectId)
            .subscribe(x => {
                if (x)
                    this.applyAuthorize();
            });
        //创建
        return () => {
            globalSubscription && globalSubscription.unsubscribe();
            containerSubscription && containerSubscription.unsubscribe();
        };
    }
    private authorizeUpdated: boolean = false;

    updateAuthorize() {
        if (this.authorizeUpdated) return;
        this.authorizeUpdated = true;
        this.loopCtrlVar++;
        if (this.loopCtrlVar < 3 && !this.authorizeProcessing && !!this.objectId) {
            this.applyAuthorize();
        }
        if (this.loopCtrlVar > 2) this.loopCtrlVar = 0;
    }

    updateAuthorize$: Subject<HTMLElement> = new Subject<HTMLElement>();
    createElementMutaionObserver(target: HTMLElement) {
        target.observer = new MutationObserver((mutations, observer) => {
            // mutations.forEach((mutation) => {
            //     console.log(mutation);
            // });

            // this.updateAuthorize$.next(target);
            this.updateAuthorize();
            this.authorizeUpdated = false;
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
        target.observer.observe(target, config);
    }
    createChildElementMutaionObserver(target: HTMLElement) {
        target.observer = new MutationObserver((mutations, observer) => {
            this.updateAuthorize$.next(target);
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
        target.observer.observe(target, config);
    }
    createTargetProxy(target: any) {

        let handler = () => {
            let _self = this;
            let listenProps = {
                "disabled": "disabled",
                "enabled": "enabled",
                "readOnly": "readOnly",
                "editable": "editable",
                "required": "required",
                'style': "style",
                "hidden": "hidden",
                "visible": "visible",
            };
            return {
                get: function (target: any, propertyKey: PropertyKey, receiver: any) {
                    if (propertyKey === 'isProxy')
                        return true;
                    else
                        return Reflect.get(target, propertyKey, receiver);
                },
                set: function (target: any, propertyKey: PropertyKey, value: any, receiver?: any) {
                    if (propertyKey in listenProps) {
                        let res = Reflect.set(target, propertyKey, value, receiver);
                        _self.authorizeUpdated = false;
                        _self.updateAuthorize();
                        if (!_self.target.hasAttribute(propertyKey.toString())) {
                            _self.authorizeUpdated = false;
                        }
                        return res;
                    } else {
                        return Reflect.set(target, propertyKey, value, receiver);
                    }
                },
                apply: function (target: any, thisBinding: any, ...args: any[]) {
                    return Reflect.apply(target, thisBinding, args);
                },
                construct: function (target: any, ...args: any[]) {
                    return Reflect.construct(target, args);
                }
            };
        };
        let proxy = new Proxy(Object.getPrototypeOf(target), handler());
        Object.setPrototypeOf(target, proxy);
        return proxy;
    }
}
