import { ModalBase } from '../modal-base';
import { isFunction } from '../toasty/toasty.utils';
import { ComponentRef } from '@angular/core';
import {
    ComponentFactoryResolver, Directive, Injector, Input,
    NgModuleFactory, NgModuleRef, OnChanges, OnDestroy, Provider,
    SimpleChanges, Type, ViewContainerRef
} from '@angular/core';



/**
 * Instantiates a single {@link Component} type and inserts its Host View into current View.
 * `NgComponentOutlet` provides a declarative approach for dynamic component creation.
 *
 * `NgComponentOutlet` requires a component type, if a falsy value is set the view will clear and
 * any existing component will get destroyed.
 *
 * ### Fine tune control
 *
 * You can control the component creation process by using the following optional attributes:
 *
 * * `ngComponentOutletInjector`: Optional custom {@link Injector} that will be used as parent for
 * the Component. Defaults to the injector of the current view container.
 *
 * * `ngComponentOutletProviders`: Optional injectable objects ({@link Provider}) that are visible
 * to the component.
 *
 * * `ngComponentOutletContent`: Optional list of projectable nodes to insert into the content
 * section of the component, if exists.
 *
 * * `ngComponentOutletNgModuleFactory`: Optional module factory to allow dynamically loading other
 * module, then load a component from that module.
 *
 * ### Syntax
 *
 * Simple
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression"></ng-container>
 * ```
 *
 * Customized injector/content
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression;
 *                                   injector: injectorExpression;
 *                                   content: contentNodesExpression;">
 * </ng-container>
 * ```
 *
 * Customized ngModuleFactory
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression;
 *                                   ngModuleFactory: moduleFactory;">
 * </ng-container>
 * ```
 * # Example
 *
 * {@example common/ngComponentOutlet/ts/module.ts region='SimpleExample'}
 *
 * A more complete example with additional options:
 *
 * {@example common/ngComponentOutlet/ts/module.ts region='CompleteExample'}
 * A more complete example with ngModuleFactory:
 *
 * {@example common/ngComponentOutlet/ts/module.ts region='NgModuleFactoryExample'}
 *
 * @experimental
 */
@Directive({ selector: '[jyComponentOutlet]' })
export class JYComponentOutlet implements OnChanges, OnDestroy {
    @Input() jyComponentOutlet: Type<any>;
    @Input() jyComponentOutletInjector: Injector;
    @Input() jyComponentOutletContent: any[][];
    @Input() jyComponentOutletContext: any;
    @Input() jyComponentOutletNgModuleFactory: NgModuleFactory<any>;

    private _componentRef: ComponentRef<any> = null;
    private _moduleRef: NgModuleRef<any> = null;

    constructor(private _viewContainerRef: ViewContainerRef) { }

    ngOnChanges(changes: SimpleChanges) {
        if (this._componentRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._componentRef.hostView));
        }
        this._viewContainerRef.clear();
        this._componentRef = null;

        if (this.jyComponentOutlet) {
            let injector = this.jyComponentOutletInjector || this._viewContainerRef.parentInjector;

            if ((changes as any).ngComponentOutletNgModuleFactory) {
                if (this._moduleRef) this._moduleRef.destroy();
                if (this.jyComponentOutletNgModuleFactory) {
                    this._moduleRef = this.jyComponentOutletNgModuleFactory.create(injector);
                } else {
                    this._moduleRef = null;
                }
            }
            if (this._moduleRef) {
                injector = this._moduleRef.injector;
            }

            let componentFactory =
                injector.get(ComponentFactoryResolver).resolveComponentFactory(this.jyComponentOutlet);

            this._componentRef = this._viewContainerRef.createComponent(
                componentFactory, this._viewContainerRef.length, injector, this.jyComponentOutletContent);

        }

        if (this.jyComponentOutlet && this.jyComponentOutletContext) {
            let parseObject = this.jyComponentOutletContext;
            if (isFunction(parseObject)) {
                parseObject = parseObject();
            }
            if (parseObject && parseObject.parent && parseObject.componentRefs) {
                let compRefs = parseObject.componentRefs;
                if (!!!compRefs.find((ref: any) => ref === this._componentRef)) { compRefs.push(this._componentRef); }
            }
            if (parseObject.componentRef) {
                Object.assign(parseObject.componentRef.instance, parseObject);
                this._viewContainerRef.insert((parseObject.componentRef as ComponentRef<any>).hostView);
            }
            Object.assign(this._componentRef.instance, parseObject);
        }
    }
    ngOnDestroy() {
        if (this._moduleRef) this._moduleRef.destroy();
    }


}