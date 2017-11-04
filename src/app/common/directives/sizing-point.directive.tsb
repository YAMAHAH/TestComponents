import { ModalBase } from '../modal-base';
import { isFunction } from '../toasty/toasty.utils';
import {
    ComponentFactoryResolver, ComponentRef, Directive, Injector, Input,
    NgModuleFactory, NgModuleRef, OnChanges, OnDestroy, Provider,
    SimpleChanges, Type, ViewContainerRef
} from '@angular/core';

@Directive({ selector: '[sizing-point]' })
export class SizingPointDirective implements OnChanges, OnDestroy {
    @Input() SizingPoint: Type<any>;

    @Input() resizable: boolean;
    @Input() SizingPointInjector: Injector;
    @Input() ngComponentOutletContent: any[][];
    @Input() ngComponentOutletContext: any;
    @Input() ngComponentOutletNgModuleFactory: NgModuleFactory<any>;

    private _componentRef: ComponentRef<any> = null;
    private _moduleRef: NgModuleRef<any> = null;

    constructor(private _viewContainerRef: ViewContainerRef) { }

    onResize(event: any) {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this._componentRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._componentRef.hostView));
        }
        this._viewContainerRef.clear();
        this._componentRef = null;

        if (this.SizingPoint) {
            let injector = this.SizingPointInjector || this._viewContainerRef.parentInjector;

            if ((changes as any).ngComponentOutletNgModuleFactory) {
                if (this._moduleRef) this._moduleRef.destroy();
                if (this.ngComponentOutletNgModuleFactory) {
                    this._moduleRef = this.ngComponentOutletNgModuleFactory.create(injector);
                } else {
                    this._moduleRef = null;
                }
            }
            if (this._moduleRef) {
                injector = this._moduleRef.injector;
            }

            let componentFactory =
                injector.get(ComponentFactoryResolver).resolveComponentFactory(this.SizingPoint);

            this._componentRef = this._viewContainerRef.createComponent(
                componentFactory, this._viewContainerRef.length, injector, this.ngComponentOutletContent);

            if (this.ngComponentOutletContext) {
                let parseObject = this.ngComponentOutletContext;
                if (isFunction(parseObject)) {
                    parseObject = parseObject();
                }
                Object.assign(this._componentRef.instance, parseObject);
            }
        }
    }
    ngOnDestroy() {
        if (this._moduleRef) this._moduleRef.destroy();
    }


}