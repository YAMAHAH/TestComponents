import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ComponentRef, EventEmitter, Type, ComponentFactoryResolver, Injector, ViewContainerRef, Input } from '@angular/core';
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

@Component({
    selector: 'x-pur-order',
    templateUrl: './pur-order.component.html',
    styles: ['.el-hide{display:none;} .el-flex-show{ display:flex;flex:1 0 100%;}']
})
export class PurOrderComponent implements OnInit, OnDestroy, IComponentFactoryContainer {
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
    @Input() title: string = "采购订单Container";
    @Input() groupTitle: string = "采购订单分组";
    modalResult: EventEmitter<any>;
    context: any;
    tag: any;
    constructor(
        private appStore: AppStoreService,
        private elementRef: ElementRef,
        public viewContainerRef: ViewContainerRef,
        public componentFactoryResolver: ComponentFactoryResolver,
        private activeRouter: ActivatedRoute) {
        this.formModel = {
            title: '采购订单分组',
            active: true,
            componentFactoryRef: this,
            showType: ShowTypeEnum.showForm
        };

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
    formModel: IFormModel;
    taskId: any;
    childFormLists: IFormModel[] = [];

    get formGroups() {
        return this.childFormLists;
    }
    getDetails(grp: IFormModel) {
        return grp.childs.filter(child => child.formType === FormTypeEnum.detail);
    }
    getLists(grp: IFormModel) {
        return grp.childs.filter(child => child.formType === FormTypeEnum.list);
    }
    @ViewChild(NavTreeViewComponent) navTreeView: NavTreeViewComponent;
    componentFactoryDestroyFn: () => void;
    ngOnInit() {
        this.setupElStyle();

        // this.addNewPurList(null);
        this.formModel.closeAfterFn = this.closeAfterFn;
        this.formModel.elementRef = this.elementRef.nativeElement;

        // this.formModel.treeView = this.navTreeView;

        // let appTabSetActions = new AppTaskBarActions;
        // this.appStore.dispatch(appTabSetActions.showFormAction({
        //     sender: appTabSetActions.key,
        //     state: this.formModel
        // }));
        // this.appStore.taskManager.show(this.formModel);
    }

    ngOnDestroy() {
        this.appStore.delete(this.purOrderActions.key);
        if (this.componentFactoryDestroyFn) this.componentFactoryDestroyFn();
        this.formModel = null;
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
    current: IFormModel;

    setCurrent(formModel: IFormModel) {
        //如果是组,直接返回
        if (formModel && formModel.formType == FormTypeEnum.group) return;
        if (!formModel) {
            this.current = null;
            this.navTreeView && this.navTreeView.setCurrent(null);
            return;
        }
        if (this.current) {
            this.current.active = false; //true
        }
        formModel.active = true;
        this.current = formModel;
        if (this.current && this.current.modalRef) {
            this.current.modalRef.instance.moveOnTop();
            this.current.modalRef.instance.visible = true;
            this.current.modalRef.instance.restore(null);
        }
        this.navTreeView.setCurrent(formModel.tag);
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
    childFormInstances: IFormModel[] = [];
    getComponentRef<T extends IComponentBase>(componentType: Type<T>, formModel?: IFormModel): ComponentRef<T> {
        const rootContainer = this.viewContainerRef; // this.appStore.taskManager.hostFactoryContainer.viewContainerRef;
        if (!rootContainer) {
            throw new Error('Should setup ViewContainerRef on modal options or config service!');
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        const injector: Injector = rootContainer.parentInjector;

        const componentRef = rootContainer.createComponent(componentFactory, rootContainer.length, injector);
        let componentInstance = componentRef.instance;
        let newFormModel = formModel ? formModel : this.createGroupListInfo();
        componentInstance.formModel = newFormModel;
        // componentInstance['purOrderService'] = 
        newFormModel.componentRef = componentRef;

        return componentRef;
    }

    public createGroupListInfo(extras?: FormExtras) {
        let len = this.childFormLists.length + 1;
        let title = UUID.uuid(8, 10).toString();
        let formGroupModel: IFormModel = {
            formType: FormTypeEnum.group,
            title: title + '默认组',
            active: false,
            childs: [],
            componentFactoryRef: this,
            parent: this.formModel,
            resolve: this.appStore.handleResolve(extras && extras.resolve) || {},
            showType: extras && extras.showType || ShowTypeEnum.tab
        };
        // formGroup.showType = ShowTypeEnum.showForm;
        let groupNode = new NavTreeNode(UUID.uuid(8, 10), title + '默认组', '/skdd', 'sndwd', 0);
        groupNode.isGroup = true;
        groupNode.tag = formGroupModel;
        formGroupModel.tag = groupNode;

        let formModelList: IFormModel = {
            formType: FormTypeEnum.list,
            title: title,
            active: true,
            parent: formGroupModel,
            componentFactoryRef: this,
            childs: [],
            resolve: this.appStore.handleResolve(extras && extras.resolve) || {},
            showType: extras && extras.showType || ShowTypeEnum.tab
        };
        // purOrderList.showType = ShowTypeEnum.showForm;

        let nd = new NavTreeNode(UUID.uuid(8, 10), title, '/skdd', 'sndwd', 0);
        nd.tag = formModelList;
        formModelList.tag = nd;

        groupNode.addNode(nd);
        formGroupModel.childs.push(formModelList);
        this.navTreeView.addNode(groupNode);
        this.childFormInstances.push(formGroupModel);
        this.setCurrent(formGroupModel);
        return formModelList;
    }
    createGroup(extras?: FormExtras) {
        let len = this.childFormLists.length + 1;
        let formGroup: IFormModel = { //PurList
            formType: FormTypeEnum.group,
            title: "采购订单分组-" + len.toString(10),
            active: false,
            childs: [],
            componentFactoryRef: this,
            parent: this.formModel,
            resolve: this.appStore.handleResolve(extras && extras.resolve),
            showType: extras && extras.showType || this.appStore.showType
        };

        let groupNode = new NavTreeNode(UUID.uuid(8, 10), "采购订单分组-" + len.toString(10), '/skdd', 'sndwd', 0);
        groupNode.isGroup = true;
        groupNode.tag = formGroup;
        formGroup.tag = groupNode;

        this.navTreeView.addNode(groupNode);
        this.addFormList(formGroup);
        this.setCurrent(formGroup);
        return formGroup;
    }

    createList(groupFormModel: IFormModel, extras?: FormExtras) {
        let len = this.childFormLists.length + 1;
        let purOrderList: IFormModel = { //PurList
            formType: FormTypeEnum.list,
            title: "采购订单清单-" + len.toString(10),
            active: true,
            parent: groupFormModel,
            componentFactoryRef: this,
            childs: [],
            resolve: this.appStore.handleResolve(extras && extras.resolve),
            showType: extras && extras.showType || this.appStore.showType
        };

        let nd = new NavTreeNode(UUID.uuid(8, 10), "采购订单清单-" + len.toString(10), '/skdd', 'sndwd', 0);
        nd.tag = purOrderList;
        purOrderList.tag = nd;

        groupFormModel.tag.addNode(nd); //childs.push(nd);
        groupFormModel.childs.push(purOrderList);

        this.setCurrent(purOrderList); //purOrderList
        return purOrderList;
    }
    createDetail(groupFormModel: IFormModel, extras?: FormExtras) {
        let detail: IFormModel = {
            formType: FormTypeEnum.detail,
            key: UUID.uuid(8, 10),
            title: UUID.uuid(8, 10),
            active: false,
            tag: null,
            componentFactoryRef: this,
            parent: groupFormModel,
            resolve: this.appStore.handleResolve(extras && extras.resolve),
            showType: extras && extras.showType || this.appStore.showType
        };

        groupFormModel.childs.push(detail);

        let ndKey = UUID.uuid(8, 10);
        let nd = new NavTreeNode(ndKey, ndKey, '/skdd', 'sndwd', 0);
        nd.tag = detail;
        detail.tag = nd;

        let node = groupFormModel.tag as NavTreeNode;
        if (node) {
            node.addNode(nd);
        }
        this.setCurrent(detail);
        return detail;
    }
    createGroupDetail(formExtras?: FormExtras) {
        let group = this.createGroup(formExtras);
        return this.createDetail(group, formExtras);
    }
    createGroupList(extras?: FormExtras) {
        let group = this.createGroup(extras);
        return this.createList(group, extras);
    }
    show(modalOptions?: FormOptions): any {
        this.appStore.taskManager.show(this.formModel, modalOptions);
    }
    showModal(modalOptions?: FormOptions): any {
        this.appStore.taskManager.showModal(this.formModel, modalOptions);
    }

    deleteCurrent() {
        if (this.current) {
            this.removeFormModel(this.current);
        }
    }

    addFormList(formList: IFormModel) { //PurList
        if (formList) {
            this.childFormLists.push(formList);
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
        //  if (this.formModel) {

        this.appStore.taskManager.closeTaskGroup(() => this.formModel.key);
        //  this.formModel = null;
        //}
        // let taskGroupActions = new AppTaskBarActions();
        // this.appStore.dispatch(taskGroupActions.closeTaskGroupAction({ state: { key: this.purOrderActions.key } }));
    };

    async closeAllForm(action: IAction) {
        let nodeLists = this.navTreeView.toList().filter((nd) => nd.isGroup == false && nd.level > -1 && !!!nd.tag.godFather);
        Observable.from(nodeLists).flatMap(form => {
            if (form && form.tag && form.tag.modalRef && form.tag.modalRef.instance) {
                return Observable.fromPromise(form.tag.modalRef.instance.forceClose(null));
            }
            else {
                return Observable.fromPromise(this.closePage(form.tag));
            }
        }).concat(Observable.of(this.formModel).flatMap(form => {
            if (form && form.modalRef && form.modalRef.instance) {
                return Observable.fromPromise(form.modalRef.instance.forceClose(null));
            } else {
                return Observable.fromPromise(this.closePage(form));
            }
        })).every((val: boolean) => val === true).distinctUntilChanged().subscribe((res: boolean) => {
            let result = { processFinish: true, result: res };
            if (this.childFormInstances.length > 0) {
                result.result = false;
            }
            if (action.data.sender) action.data.sender.next(result);
        });
    }

    selectNextForm(formModel: IFormModel) {
        let nodeLists = this.navTreeView.toList().filter((nd) => nd.isGroup == false);
        let idx = nodeLists.findIndex(nd => nd.tag == formModel);
        if (idx > -1) {
            if (nodeLists[idx - 1]) {
                this.setCurrent(nodeLists[idx - 1].tag);
            } else if (nodeLists[idx + 1]) {
                this.setCurrent(nodeLists[idx + 1].tag);
            }
        }
    }

    selectNextVisibleForm(formModel: IFormModel) {
        let nodeLists = this.navTreeView.toList().filter((nd) => nd.isGroup == false && nd.level > -1);
        let idx = nodeLists.findIndex(nd => nd.tag == formModel);
        if (idx > -1) {
            let partFormList = nodeLists.slice(0, idx).filter(nd => {
                return (nd.tag && !nd.tag.modalRef) ||
                    nd.tag.modalRef && nd.tag.modalRef.instance.modalWindowState !== FormStateEnum.Minimized
            });
            if (partFormList[partFormList.length - 1]) {
                this.setCurrent(partFormList[partFormList.length - 1].tag);
            } else {
                partFormList = nodeLists.slice(idx + 1).filter(nd => {
                    return (nd.tag && !nd.tag.modalRef) ||
                        nd.tag.modalRef && nd.tag.modalRef.instance.modalWindowState !== FormStateEnum.Minimized
                });
                if (partFormList[0]) {
                    this.setCurrent(partFormList[0].tag);
                } else {
                    this.setCurrent(null);
                }
            }
        } else {
            this.setCurrent(null);
        }
    }

    removeFormModel(formModel: IFormModel) {
        let nodeLists = this.navTreeView.toList().filter((nd) => nd.isGroup == false);
        let idx = nodeLists.findIndex(nd => nd.tag == formModel);
        let detailIdx;
        if (idx > -1) {
            if (nodeLists[idx - 1]) {
                this.setCurrent(nodeLists[idx - 1].tag);
            } else if (nodeLists[idx + 1]) {
                this.setCurrent(nodeLists[idx + 1].tag);
            }
            let nd = nodeLists[idx];
            let curformParent: IFormModel = nd.tag.parent;
            if (curformParent) { //parent
                detailIdx = curformParent.childs.findIndex((mx: any) => mx == nd.tag);
                if (detailIdx > -1) {
                    let delItem2 = curformParent.childs.splice(detailIdx, 1)[0];
                    if (delItem2.componentRef) {
                        delItem2.componentRef.destroy();
                    }
                }
            } else { //leaf
                detailIdx = this.childFormLists.findIndex(pl => pl == nd.tag);
                if (detailIdx > -1) this.childFormLists.splice(detailIdx, 1);
                //
                detailIdx = this.childFormInstances.findIndex(pl => pl == nd.tag);
                if (detailIdx > -1) {
                    let delItem = this.childFormInstances.splice(detailIdx, 1)[0];
                    if (delItem.componentRef) {
                        delItem.componentRef.destroy();
                    }
                }
            }
            if (nd.parent && nd.level > -1) { //tree
                nd.parent.childs.splice(nd.parent.childs.findIndex(child => child == nd), 1);
                if (nd.parent && nd.parent.isGroup && nd.parent.childs.length == 0) {
                    if (nd.parent.parent) {
                        nd.parent.parent.childs.splice(nd.parent.parent.childs.findIndex(child => child === nd.parent), 1);
                    } else {
                        nd.parent = null;
                    }
                    let nodeIdx = this.childFormLists.findIndex(pl => pl === nd.parent.tag);
                    if (nodeIdx > -1) this.childFormLists.splice(nodeIdx, 1);
                    nodeIdx = this.childFormInstances.findIndex(pl => pl === nd.parent.tag);
                    if (nodeIdx > -1) {
                        let delItem2 = this.childFormInstances.splice(nodeIdx, 1)[0];
                        if (delItem2.componentRef) {
                            delItem2.componentRef.destroy();
                        }
                    }
                    if (this.childFormLists.length == 0 && this.childFormInstances.length == 0) {
                        //send task closeTask
                        this.appStore.taskManager.closeTaskGroup(this.taskId);
                        // let taskGroupActions = new AppTaskBarActions();
                        // this.appStore.dispatch(taskGroupActions.closeTaskGroupAction({ state: { key: this.purOrderActions.key } }));
                    }
                    if (this.childFormLists.length == 0 && this.childFormInstances.length > 0) {
                        this.appStore.taskManager.hideTaskGroup(this.taskId);
                    }
                }
            }
        }

    }
    onItemClick(navNode: NavTreeNode) {
        this.setCurrent(navNode.tag);
    }

    async onItemCloseClick(navNode: NavTreeNode) {
        let formModel: IFormModel = navNode.tag;
        //根据model关闭,关闭前检查,等待关闭前处理函数
        await this.closePage(formModel);
    }

    async closePage(formModel: IFormModel) {
        //根据model关闭,关闭前检查,等待关闭前处理函数
        return new Promise(async resolve => {
            let event = { cancel: true, sender: formModel };
            if (formModel) {
                let destroyFn;
                if (formModel.closeBeforeCheckFn && isFunction(formModel.closeBeforeCheckFn)) {
                    destroyFn = await formModel.closeBeforeCheckFn(event);
                }
                if (event.cancel) {
                    await this.closeChildPage(formModel);
                    this.removeFormModel(formModel);
                }
                if (isFunction(destroyFn)) destroyFn();
            }
            resolve(event.cancel);
        });
    }
    async closeChildPage(formModel: IFormModel) {
        console.log(formModel.childs);
        return new Promise(resolve => {
            if (formModel && formModel.childs) {
                Observable.from(formModel.childs)
                    .flatMap(form => {
                        if (form) {
                            return Observable.fromPromise(this.closePage(form));
                        } else if (form && form.tag && form.tag.modalRef && form.tag.modalRef.instance) {
                            return Observable.fromPromise(form.tag.modalRef.instance.forceClose(null));
                        }
                        else {
                            return Observable.of(true);
                        }
                    })
                    .every((val: boolean) => val === true)
                    .subscribe(res => {
                        resolve(res);
                    });
            } else {
                resolve(true);
            }
        });
    }

    setChildActiveState(pl: IFormModel, state: boolean) { //PurList
        pl.active = state;
        pl.childs.forEach(dl => dl.active = state);
    }


}

