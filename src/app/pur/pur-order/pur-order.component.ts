import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ComponentRef, EventEmitter, Type, ComponentFactoryResolver, Injector, ViewContainerRef, Input, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { AppStoreService } from '../../services/app.store.service';
import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';
import { styleUntils } from '../../untils/style';
import { ISubject, IAction } from '../../Models/IAction';
import { PurOrderActions, AddPurOrderAction, RemovePurOrderAction } from '../../actions/pur/pur-order-actions';
import { AddAction, RemoveAction, SetCurrentAction, GetformModelArrayAction, CloseTaskGroupAction, ComponentFactoryType, PurComponentFactoryType } from '../../actions/actions-base';
import { UUID } from '../../untils/uuid';
import { purList } from '../../static-news.1/pur.component';
import { TabModel } from '../../common/chrome-tabs/chrome-tabs.component';
import { ActivatedRoute } from '@angular/router';
import { IComponentBase } from '../../basic/IComponentBase';
import { FormExtras } from '../../basic/FormExtras';
import { FormTypeEnum } from '../../basic/FormTypeEnum';
import { ShowTypeEnum } from '../../basic/show-type-enum';
import { FormOptions } from '../../components/form/FormOptions';
import { NavTreeViewComponent } from '../../components/nav-tree-view/nav-tree-view.component';
import { NavTreeNode } from '../../components/nav-tree-view/nav-tree-node';
import { FormStateEnum } from '../../components/form/FormStateEnum';
import { IComponentFactoryContainer } from '../../basic/IComponentFactoryContainer';
import { IFormModel } from '../../basic/IFormModel';
import { isFunction } from '../../common/toasty/toasty.utils';
import { ComponentFactoryConatiner } from './ComponentFactoryConatiner';

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
        this.formModel = {
            title: '采购订单分组',
            active: true,
            componentFactoryRef: this,
            showType: ShowTypeEnum.showForm
        };
        // this.registerFactory(new PurComponentFactoryType(this.formModel.key, this));
        this.activeRouter.queryParams
            .map(params => params['taskId'])
            .subscribe(param => {
                if (this.formModel) {
                    this.formModel.key = this.taskId = param;
                }
                this.componentFactoryDestroyFn = this.appStore.registerComponentFactoryRef(new PurComponentFactoryType(this.formModel.key, this));
            }).unsubscribe();
        this.reducer();
    }

    getComponentFactoryType() {
        return new PurComponentFactoryType(this.formModel.key, this)
    }
    get formGroups() {
        return this.childFormLists;
    }
    getDetails(grp: IFormModel) {
        return grp.childs.filter(child => child.formType === FormTypeEnum.detail);
    }
    getLists(grp: IFormModel) {
        return grp.childs.filter(child => child.formType === FormTypeEnum.list);
    }


    ngOnInit() {
        super.ngOnInit();
        this.setupElStyle();
        this.formModel.closeAfterFn = this.closeAfterFn;
        this.formModel.elementRef = this.elementRef.nativeElement;
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.appStore.delete(this.purOrderActions.key);
        // if (this.componentFactoryDestroyFn) this.componentFactoryDestroyFn();
        // this.formModel = null;
    }

    setupElStyle() {
        let styleHtml = ` 
        x-pur-order {
            display: flex;
            flex: 1 0 auto;
        }`;
        styleUntils.setupStyleEl(this.elementRef.nativeElement, styleHtml);
    }

    getClass(listModel: IFormModel) { //PurList
        if (!listModel) return {};
        return {
            "el-hide": !listModel.active,
            "el-flex-show": listModel.active
        };
    }

    getDetailClass(detail: IFormModel) { //PurDetail
        if (!detail) return;
        return {
            "el-hide": !detail.active,
            "el-flex-show": detail.active
        }
    }

    purOrder: ISubject;
    purOrderActions = new PurOrderActions();
    async reducer() {
        this.purOrder = this.appStore.select(this.formModel.key);
        this.purOrder.subject.subscribe(act => {
            switch (true) {
                case act instanceof AddPurOrderAction:
                    this.addFormList(act.data.state);
                    break;
                case act instanceof RemovePurOrderAction:
                    this.removeFormModel(act.data.state);
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
                        act.data.sender.next(this.childFormLists);
                    }
                    break;
                case act instanceof CloseTaskGroupAction:
                    this.closeAllForm(act);
                    break;
                default:
                    break;
            }
        });
    }

    deleteCurrent() {
        if (this.current) {
            this.removeFormModel(this.current);
        }
    }

    closeBeforeCheckFn: Function = async (event: any) => {
        return new Promise<any>(resolve => {
            return resolve(true);
        });
    }
    /**
     * close self sucessful callback
     */
    closeAfterFn: Function = () => {
        this.appStore.taskManager.closeTaskGroup(() => this.formModel.key);
    };

    onItemClick(navNode: NavTreeNode) {
        this.setCurrent(navNode.tag);
    }

    async onItemCloseClick(navNode: NavTreeNode) {
        let formModel: IFormModel = navNode.tag;
        //根据model关闭,关闭前检查,等待关闭前处理函数
        await this.closePage(formModel);
    }

}

