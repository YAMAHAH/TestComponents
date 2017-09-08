import { IComponentBase } from '../../basic/IComponentBase';
import { IPageModel } from '../../basic/IFormModel';
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
    @Input() pageModel: IPageModel;
    setOtherParent(godFather: IPageModel): IPageModel {
        if (godFather) {
            godFather.childs.push(this.pageModel);
            this.pageModel.godFather = godFather;
            if (this.pageModel.tag) {
                //设置关联的结点在导航树不可见,关闭TAB时也要考虑这种情况
                let nd = this.pageModel.tag as NavTreeNode;
                nd.showNode = false;
                nd.getParents().forEach(val => val.showNode = false);
            }
            //创建依赖引用结点,添加到导航树中
            let dependNode = new NavTreeNode(this.pageModel.key, this.pageModel.title, '/', '', 0);
            dependNode.tag = this.pageModel;
            dependNode.isDependRef = true;

            this.pageModel.extras = dependNode;
            let parentNode = godFather.tag as NavTreeNode;
            if (parentNode) {
                parentNode.addNode(dependNode);
                godFather.componentFactoryRef.navTreeView.setCurrent(dependNode);
                godFather.componentFactoryRef.changeDetectorRef.markForCheck();
            }
        }
        return this.pageModel;
    }
    show(modalOptions?: FormOptions) {
        if (this.pageModel) {
            this.pageModel.title = this.title;
            this.pageModel.elementRef = this.elementRef.nativeElement;
            this.pageModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
            this.pageModel.closeAfterFn = this.closeAfterFn;
        }
        return this.appStore.taskManager.show(this.pageModel, modalOptions);
    }

    showModal(modalOptions?: FormOptions) {
        if (this.pageModel) {
            this.pageModel.title = this.title;
            this.pageModel.elementRef = this.elementRef.nativeElement;
            this.pageModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
            this.pageModel.closeAfterFn = this.closeAfterFn;
        }
        return this.appStore.taskManager.showModal(this.pageModel, modalOptions);
    }

    closeBeforeCheckFn: Function = async (event: any) => {
        return new Promise<any>(resolve => {
            return resolve(true);
        });
    }
    closeAfterFn: Function;
    modalResult: EventEmitter<any>;
    context: any;
    tag: any;

    expandPageModel(root: IPageModel, callback: (comp: IPageModel) => void) {
        callback(root);
        root.childs.forEach(c => {
            this.expandPageModel(c, callback);
        });
    }
    /**
     * 向下搜索对象,找到返回,否则返回Null
     * @param startComp 
     * @param predicate 
     */
    searchDown(startComp: IPageModel, predicate: (comp: IPageModel) => boolean): IPageModel {
        let result: IPageModel = null;
        result = predicate(startComp) ? startComp : null || startComp.childs.filter(predicate)[0];
        if (result) return result;
        startComp.childs.forEach(element => {
            element.childs.forEach(element => {
                result = this.searchDown(element, predicate);
                if (result) return result;
            });
        });
        return result;
    }

    ngOnInit() {
        this.pageModel.globalManager = this.appStore;
    }

    ngOnDestroy() {

    }
    protected appStore: AppStoreService;
    /**
     * 组件的host元素引用,必须在派生类注入才有效
     */
    protected elementRef: ElementRef;
    /**
     * 组件的HOST视图引用,必须在派生类注入才有效
     */
    public viewContainerRef: ViewContainerRef;
    public componentFactoryResolver: ComponentFactoryResolver;
    public activeRouter: ActivatedRoute;
    public changeDetectorRef: ChangeDetectorRef;

    constructor(protected injector: Injector) {
        this.appStore = this.injector.get(AppStoreService);
        this.elementRef = this.injector.get(ElementRef);
        this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
        this.activeRouter = this.injector.get(ActivatedRoute);
        this.changeDetectorRef = this.injector.get(ChangeDetectorRef);
    }
}

