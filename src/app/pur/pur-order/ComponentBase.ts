import { IComponentBase } from '../../basic/IComponentBase';
import { IFormModel } from '../../basic/IFormModel';
import { FormOptions } from '../../components/form/FormOptions';
import { EventEmitter, OnInit, OnDestroy, Injector, ComponentFactoryResolver, ViewContainerRef, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { NavTreeNode } from '../../components/nav-tree-view/nav-tree-node';
import { AppStoreService } from '../../services/app.store.service';
import { ActivatedRoute } from '@angular/router';
import { isFunction } from '../../common/toasty/toasty.utils';
import { Observable } from 'rxjs/Observable';
import { IComponentFactoryType } from '../../basic/IComponentFactoryType';

export abstract class ComponentBase implements OnInit, OnDestroy, IComponentBase {
    getComponentFactoryType(): IComponentFactoryType {
        throw new Error("Method not implemented.");
    }
    @Input() title: string;
    formModel: IFormModel;
    setOtherParent(godFather: IFormModel): IFormModel {
        if (godFather) {
            godFather.childs.push(this.formModel);
            this.formModel.godFather = godFather;
            if (this.formModel.tag) {
                //设置关联的结点在导航树不可见,关闭TAB时也要考虑这种情况
                let nd = this.formModel.tag as NavTreeNode;
                nd.showNode = false;
                nd.getParents().forEach(val => val.showNode = false);
            }
        }
        return this.formModel;
    }
    show(modalOptions?: FormOptions) {
        return this.appStore.taskManager.show(this.formModel, modalOptions);
    }

    showModal(modalOptions?: FormOptions) {
        return this.appStore.taskManager.showModal(this.formModel, modalOptions);
    }
    closeBeforeCheckFn: Function;
    closeAfterFn: Function;
    modalResult: EventEmitter<any>;
    context: any;
    tag: any;

    ngOnInit() {

    }

    ngOnDestroy() {

    }
    protected appStore: AppStoreService;
    protected elementRef: ElementRef;
    protected viewContainerRef: ViewContainerRef;
    protected componentFactoryResolver: ComponentFactoryResolver;
    protected activeRouter: ActivatedRoute;
    protected changeDetectorRef: ChangeDetectorRef
    constructor(protected injector: Injector) {
        this.appStore = injector.get(AppStoreService);
        this.elementRef = injector.get(ElementRef);
        this.viewContainerRef = injector.get(ViewContainerRef);
        this.componentFactoryResolver = injector.get(ComponentFactoryResolver);
        this.activeRouter = injector.get(ActivatedRoute);
        this.changeDetectorRef = injector.get(ChangeDetectorRef);
    }
}

