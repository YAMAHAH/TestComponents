import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ComponentRef, EventEmitter, Type, ComponentFactoryResolver, Injector, ViewContainerRef, Input, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { AppStoreService } from '../../services/app.store.service';
import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';
import { styleUntils } from '../../untils/style';
import { ISubject, IAction } from '../../Models/IAction';
import { PurOrderActions, AddPurOrderAction, RemovePurOrderAction } from '../../actions/pur/pur-order-actions';
import { AddAction, RemoveAction, SetCurrentAction, GetformModelArrayAction, CloseTaskGroupAction, ComponentFactoryType, PurComponentFactoryType, PurchaseListComponentType, PurchaseEditComponentType } from '../../actions/actions-base';
import { UUID } from '../../untils/uuid';
import { purList } from '../../static-news.1/pur.component';
import { TabModel } from '../../common/chrome-tabs/chrome-tabs.component';
import { ActivatedRoute } from '@angular/router';
import { IComponentBase } from '../../basic/IComponentBase';
import { PageModelExtras } from '../../basic/PageModelExtras';
import { FormTypeEnum } from '../../basic/FormTypeEnum';
import { ShowTypeEnum } from '../../basic/show-type-enum';
import { FormOptions } from '../../components/form/FormOptions';
import { NavTreeViewComponent } from '../../components/nav-tree-view/nav-tree-view.component';
import { NavTreeNode } from '../../components/nav-tree-view/nav-tree-node';
import { FormStateEnum } from '../../components/form/FormStateEnum';
import { IComponentFactoryContainer } from '../../basic/IComponentFactoryContainer';
import { IPageModel } from '../../basic/IFormModel';
import { isFunction } from '../../common/toasty/toasty.utils';
import { ComponentFactoryConatiner } from './ComponentFactoryConatiner';
import { PurListComponent } from './pur.list.component';
import { PurDetailComponent } from './pur.detail.component';
import { IComponentType } from '../../basic/IComponentType';

@Component({
    selector: 'x-pur-order',
    templateUrl: './pur-order.component.html',
    styles: ['.el-hide{display:none;} .el-flex-show{ display:flex;flex:1 0 100%;}']
})
export class PurOrderComponent extends ComponentFactoryConatiner implements OnInit, OnDestroy {
    @Input() title: string = "采购订单";
    @Input() groupTitle: string = "采购订单分组";
    constructor(
        protected injector: Injector,
        public viewContainerRef: ViewContainerRef
    ) {
        super(injector);
        this.pageModel = {
            title: '采购订单分组',
            active: true,
            componentFactoryRef: this,
            showType: ShowTypeEnum.showForm,
            childs: [],
            formType: FormTypeEnum.container
        };
        // this.registerFactory(new PurComponentFactoryType(this.formModel.key, this));
        this.activeRouter.queryParams
            .map(params => params['taskId'])
            .subscribe(param => {
                if (this.pageModel) {
                    this.pageModel.key = this.taskId = param;
                }
                this.componentFactoryDestroyFn = this.appStore.registerComponentFactoryRef(new PurComponentFactoryType(this.pageModel.key, this));
            }).unsubscribe();
        this.reducer();
    }
    get formGroups() {
        return this.principalPageModels;
    }
    getDetails(grp: IPageModel) {
        return grp.childs.filter(child => child.formType === FormTypeEnum.detail);
    }
    getLists(grp: IPageModel) {
        return grp.childs.filter(child => child.formType === FormTypeEnum.list);
    }


    ngOnInit() {
        super.ngOnInit();
        this.setupElStyle();
        this.pageModel.closeAfterFn = this.closeAfterFn;
        this.pageModel.elementRef = this.elementRef.nativeElement;
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.appStore.delete(this.purOrderActions.key);
    }

    setupElStyle() {
        let styleHtml = ` 
        x-pur-order {
            display: flex;
            flex: 1 0 auto;
        }`;
        styleUntils.setupStyleEl(this.elementRef.nativeElement, styleHtml);
    }

    getClass(listModel: IPageModel) { //PurList
        if (!listModel) return {};
        return {
            "el-hide": !listModel.active,
            "el-flex-show": listModel.active
        };
    }

    getDetailClass(detail: IPageModel) { //PurDetail
        if (!detail) return;
        return {
            "el-hide": !detail.active,
            "el-flex-show": detail.active
        }
    }

    createListComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        return this.getComponentRef(PurListComponent, pageModel) as any;
    }
    createEditComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        return this.getComponentRef(PurDetailComponent, pageModel) as any;
    }
    createQueryComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createContainerComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    componentReducer<T extends IComponentBase>(componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
        let compType = new componentType();
        switch (true) {
            case compType instanceof PurchaseListComponentType:
                return this.getComponentRef(PurListComponent, pageModel) as any;
            case compType instanceof PurchaseEditComponentType:
                return this.getComponentRef(PurDetailComponent, pageModel) as any;
            default:
                break;
        }
        return null;
    }

    purOrder: ISubject;
    purOrderActions = new PurOrderActions();
    async reducer() {
        this.purOrder = this.appStore.select(this.pageModel.key);
        this.purOrder.subject.subscribe(act => {
            switch (true) {
                case act instanceof AddPurOrderAction:
                    this.addPrincipalPageModel(act.data.state);
                    break;
                case act instanceof RemovePurOrderAction:
                    this.removePageModel(act.data.state);
                    break;
                case act instanceof AddAction:
                    this.createGroupList(act.data.state);
                    break;
                case act instanceof RemoveAction:
                    this.deleteCurrent();
                    break;
                case act instanceof SetCurrentAction:
                    this.setCurrent(act.data.state);
                    break;
                case act instanceof GetformModelArrayAction:
                    if (act.data.sender) {
                        act.data.sender.next(this.principalPageModels);
                    }
                    break;
                case act instanceof CloseTaskGroupAction:
                    this.closeAllPages(act);
                    break;
                default:
                    break;
            }
        });
    }

    deleteCurrent() {
        if (this.current) {
            this.removePageModel(this.current);
        }
    }

}

