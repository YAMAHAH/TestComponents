import { ComponentBase } from './ComponentBase';
import { OnInit, OnDestroy, ComponentFactoryResolver, ViewContainerRef, Type, ComponentRef, Injector, AfterViewInit, ViewChild } from '@angular/core';
import { IComponentFactoryContainer } from '../../basic/IComponentFactoryContainer';
import { IComponentBase } from '../../basic/IComponentBase';
import { IPageModel } from '../../basic/IFormModel';
import { IAction } from '../../Models/IAction';
import { FormExtras } from '../../basic/FormExtras';
import { NavTreeViewComponent } from '../../components/nav-tree-view/nav-tree-view.component';
import { Base } from '../../common/base';
import { FormTypeEnum } from '../../basic/FormTypeEnum';
import { NavTreeNode } from '../../components/nav-tree-view/nav-tree-node';
import { UUID } from '../../untils/uuid';
import { ShowTypeEnum } from '../../basic/show-type-enum';
import { FormStateEnum } from '../../components/form/FormStateEnum';
import { Observable } from 'rxjs/Observable';
import { isFunction } from "util";
import { IComponentFactoryType } from '../../basic/IComponentFactoryType';

export abstract class ComponentFactoryConatiner extends ComponentBase
    implements OnInit, OnDestroy, IComponentFactoryContainer {
    public viewContainerRef: ViewContainerRef;
    public componentFactoryResolver: ComponentFactoryResolver;
    groupTitle: string;
    principalPageModels: IPageModel[] = [];
    dependentPageModels: IPageModel[] = [];
    @ViewChild(NavTreeViewComponent) navTreeView: NavTreeViewComponent;
    createGroup(formExtras?: FormExtras): IPageModel {
        let len = this.principalPageModels.length + 1;
        let formGroup: IPageModel = {
            formType: FormTypeEnum.group,
            title: this.title + "分组-" + len.toString(10),
            active: false,
            childs: [],
            componentFactoryRef: this,
            parent: this.pageModel,
            resolve: this.appStore.handleResolve(formExtras && formExtras.resolve),
            showType: formExtras && formExtras.showType || this.appStore.showType
        };
        this.pageModel.childs.push(formGroup);
        let groupNode = new NavTreeNode(UUID.uuid(8, 10), this.title + "分组-" + len.toString(10), '/skdd', 'sndwd', 0);
        groupNode.isGroup = true;
        groupNode.tag = formGroup;
        if (formExtras && !!formExtras.visibleInNavTree)
            groupNode.showNode = false;
        else groupNode.showNode = true;

        formGroup.tag = groupNode;

        this.navTreeView.addNode(groupNode);
        this.addPrincipalPageModel(formGroup);
        this.setCurrent(formGroup);
        return formGroup;
    }
    protected addPrincipalPageModel(formList: IPageModel) {
        if (formList) {
            this.principalPageModels.push(formList);
        }
    }
    createList(groupFormModel: IPageModel, formExtras?: FormExtras): IPageModel {
        let len = this.principalPageModels.length + 1;
        let pageList: IPageModel = {
            formType: FormTypeEnum.list,
            title: this.title + "清单-" + len.toString(10),
            active: true,
            parent: groupFormModel,
            componentFactoryRef: this,
            childs: [],
            resolve: this.appStore.handleResolve(formExtras && formExtras.resolve),
            showType: formExtras && formExtras.showType || this.appStore.showType
        };

        let nd = new NavTreeNode(UUID.uuid(8, 10), this.title + "清单-" + len.toString(10), '/skdd', 'sndwd', 0);
        nd.tag = pageList;
        if (formExtras && !!formExtras.visibleInNavTree)
            nd.showNode = false;
        else nd.showNode = true;
        pageList.tag = nd;

        groupFormModel.tag.addNode(nd);
        groupFormModel.childs.push(pageList);

        this.setCurrent(pageList);
        return pageList;
    }
    createDetail(groupFormModel: IPageModel, formExtras?: FormExtras): IPageModel {
        let detail: IPageModel = {
            formType: FormTypeEnum.detail,
            key: UUID.uuid(8, 10),
            title: UUID.uuid(8, 10),
            active: false,
            tag: null,
            componentFactoryRef: this,
            parent: groupFormModel,
            resolve: this.appStore.handleResolve(formExtras && formExtras.resolve),
            showType: formExtras && formExtras.showType || this.appStore.showType,
            childs: []
        };

        groupFormModel.childs.push(detail);

        let ndKey = UUID.uuid(8, 10);
        let nd = new NavTreeNode(ndKey, ndKey, '/skdd', 'sndwd', 0);
        nd.tag = detail;
        if (formExtras && !!formExtras.visibleInNavTree)
            nd.showNode = false;
        else nd.showNode = true;
        detail.tag = nd;

        let node = groupFormModel.tag as NavTreeNode;
        if (node) {
            node.addNode(nd);
        }
        this.setCurrent(detail);
        return detail;
    }
    createGroupList(formExtras?: FormExtras): IPageModel {
        let group = this.createGroup(formExtras);
        return this.createList(group, formExtras);
    }
    createGroupDetail(formExtras?: FormExtras): IPageModel {
        let group = this.createGroup(formExtras);
        return this.createDetail(group, formExtras);
    }

    protected taskId: any;
    /**
     * 移除儿子
     * 同时从干爹列表中移除
     * @param formModel 
     */
    removePageModel(formModel: IPageModel): void {
        if (!!!formModel) return;
        let nodeLists = this.navTreeView.toList().filter((nd) => nd.isGroup == false);
        let idx = nodeLists.findIndex(nd => nd.tag == formModel);
        let detailIdx;
        if (idx > -1) {
            this.selectNextVisiblePage(formModel);
            //如果有干爹,也要从干爹的列表中删除
            this.removePageModelFromGodFather(formModel);
            let nd = nodeLists[idx];
            let curformParent: IPageModel = nd.tag.parent;
            if (curformParent) { //parent如果有父结点则从父结点中删除
                detailIdx = curformParent.childs.findIndex((mx: any) => mx == nd.tag);
                if (detailIdx > -1) {
                    let delItem2 = curformParent.childs.splice(detailIdx, 1)[0];
                    if (delItem2.componentRef) {
                        delItem2.componentRef.destroy();
                    }
                }
            } else { //leaf没有父结点,直接删除
                detailIdx = this.principalPageModels.findIndex(pl => pl == nd.tag);
                if (detailIdx > -1) this.principalPageModels.splice(detailIdx, 1);
                //
                detailIdx = this.dependentPageModels.findIndex(pl => pl == nd.tag);
                if (detailIdx > -1) {
                    let delItem = this.dependentPageModels.splice(detailIdx, 1)[0];
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
                    let nodeIdx = this.principalPageModels.findIndex(pl => pl === nd.parent.tag);
                    if (nodeIdx > -1) this.principalPageModels.splice(nodeIdx, 1);
                    nodeIdx = this.dependentPageModels.findIndex(pl => pl === nd.parent.tag);
                    if (nodeIdx > -1) {
                        let delItem2 = this.dependentPageModels.splice(nodeIdx, 1)[0];
                        if (delItem2.componentRef) {
                            delItem2.componentRef.destroy();
                        }
                    }
                    if (this.principalPageModels.length == 0 && this.dependentPageModels.length == 0) {
                        this.appStore.taskManager.closeTaskGroup(this.taskId);
                    }
                    if (this.principalPageModels.length == 0 && this.dependentPageModels.length > 0) {
                        this.appStore.taskManager.hideTaskGroup(this.taskId);
                    }
                }
            }
        }
    }

    /**
     * 干爹列表中移除干儿子
     * @param formModel 
     */
    removePageModelFromGodFather(formModel: IPageModel) {
        if (formModel && formModel.godFather) {
            let idx = formModel.godFather.childs.findIndex((value) => value === formModel);
            if (idx > -1) {
                formModel.godFather.childs.splice(idx, 1);
            }
            let godFatherNode: NavTreeNode = formModel.godFather.tag;
            let nodeIdx = godFatherNode && godFatherNode.childs.findIndex(child => child === formModel.extras);
            if (nodeIdx > -1)
                godFatherNode && godFatherNode.childs.splice(nodeIdx, 1);
        }
    }
    current: IPageModel;
    setCurrent(pageModel: IPageModel): void {
        //如果是组,直接返回
        if (pageModel && pageModel.formType == FormTypeEnum.group) return;
        if (!pageModel) {
            this.current = null;
            this.navTreeView && this.navTreeView.setCurrent(null);
            return;
        }
        //获取依赖实体列表
        let dependModels: IPageModel[] = this.getDependentPageModels();
        //不存在于实体列表中
        let notExistInDepends = dependModels.indexOf(pageModel) < 0;
        if (notExistInDepends && this.current) {
            this.current.active = false;
        } else if (this.current) this.current.active = true;

        pageModel.active = true;
        this.current = pageModel;
        if (this.current && this.current.modalRef) {
            this.current.modalRef.instance.moveOnTop();
            this.current.modalRef.instance.visible = true;
            this.current.modalRef.instance.restore(null);
        }

        if (notExistInDepends && !!!pageModel.godFather) {
            this.navTreeView.setCurrent(pageModel.tag);
            this.changeDetectorRef.markForCheck();
        } else {
            let godFather = pageModel.godFather;
            if (godFather) {
                godFather.componentFactoryRef.navTreeView.setCurrent(pageModel.extras);
                godFather.componentFactoryRef.changeDetectorRef.markForCheck();
            }
        }


    }
    closeAllPages(action: IAction): void {
        let nodeLists = this.navTreeView.toList().filter((nd) => nd.isGroup == false && nd.level > -1 && !!!nd.tag.godFather);
        Observable.from(nodeLists).flatMap(form => {
            if (form && form.tag && form.tag.modalRef && form.tag.modalRef.instance) {
                return Observable.fromPromise(form.tag.modalRef.instance.forceClose(null));
            }
            else {
                return Observable.fromPromise(this.closePage(form.tag));
            }
        }).concat(Observable.of(this.pageModel).flatMap(form => {
            if (form && form.modalRef && form.modalRef.instance) {
                return Observable.fromPromise(form.modalRef.instance.forceClose(null));
            } else {
                return Observable.fromPromise(this.closePage(form));
            }
        })).every((val: boolean) => val === true).distinctUntilChanged().subscribe((res: boolean) => {
            let result = { processFinish: true, result: res };
            if (this.dependentPageModels.length > 0) {
                result.result = false;
            }
            if (action.data.sender) action.data.sender.next(result);
        });
    }

    closePage(formModel: IPageModel) {
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
                    if (formModel && formModel.modalRef && formModel.modalRef.instance)
                        formModel.modalRef.instance.forceClose(null);
                    if (isFunction(formModel.closeAfterFn)) formModel.closeAfterFn();
                    //从窗口中操作
                    formModel.componentFactoryRef.removePageModel(formModel);
                }
                if (isFunction(destroyFn)) destroyFn();
            }
            resolve(event.cancel);
        });
    }
    private async closeChildPage(formModel: IPageModel) {
        return new Promise(resolve => {
            if (formModel && formModel.childs) {
                Observable.from(formModel.childs)
                    .flatMap(form => {
                        if (form && form.modalRef && form.modalRef.instance) {
                            return Observable.fromPromise(form.modalRef.instance.forceClose(null));
                        } else if (form) {
                            return Observable.fromPromise(this.closePage(form));
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

    /**
     * 获取所有依赖页面模型
     */
    getDependentPageModels() {
        let dependModels: IPageModel[] = [];
        this.expandPageModel({ childs: this.dependentPageModels, title: "", active: false }, (p) => {
            if (p.formType != FormTypeEnum.group) dependModels.push(p);
        });
        return dependModels;
    }

    findPageModelRef() {
        let foundedModels: IPageModel[] = [];
        let dependModels: IPageModel[] = this.getDependentPageModels();

        this.expandPageModel(this.pageModel, (pageModel => {
            if (dependModels.indexOf(pageModel) < 0 &&
                pageModel.godFather != null &&
                pageModel.modalRef && pageModel.modalRef.instance &&
                pageModel.modalRef.instance.modalWindowState != 1)
                foundedModels.push(pageModel);
        }));
        return foundedModels;
    }
    hidePageModels() {
        //获取所有模式窗体
        let pageModels = this.findPageModelRef();
        pageModels.forEach(m => {
            m.modalRef.instance.visible = false;
        });
    }

    showPageModels() {
        let pageModels = this.findPageModelRef();
        pageModels.forEach(m => {
            m.modalRef.instance.visible = true;
        });
    }

    test() {
        // let pageNodes = this.navTreeView.toList().filter(nd => nd.isGroup == false && nd.level > -1);
        // let pageNodeIdx = pageNodes.findIndex(nd => nd.tag == pageModel || nd.extras == pageModel);
        // let notExistInDepends = this.getDependentPageModels().findIndex(val => val == pageModel) < 0;
        // let pageNodeFilterFn = (nd: NavTreeNode) => {
        //     return (nd.tag && !nd.tag.modalRef) ||
        //         nd.tag.modalRef && nd.tag.modalRef.instance.modalWindowState !== FormStateEnum.Minimized ||
        //         (nd.extras && !nd.extras.modalRef) ||
        //         nd.extras.modalRef && nd.extras.modalRef.instance.modalWindowState !== FormStateEnum.Minimized
        // }
        // if (pageNodeIdx > -1) {
        //     // let last = pageNodes.slice(0, pageNodeIdx).filter(pageNodeFilterFn).pop();
        //     // let first = pageNodes.slice(pageNodeIdx + 1).filter(pageNodeFilterFn).shift();
        //     let nextPage = pageNodes.slice(0, pageNodeIdx).filter(pageNodeFilterFn).pop() ||
        //         pageNodes.slice(pageNodeIdx + 1).filter(pageNodeFilterFn).shift();
        //     //let partPageNodes = pageNodes.slice(0, pageNodeIdx).filter(pageNodeFilterFn);
        //     // let nextPage = partPageNodes[partPageNodes.length - 1];

        //     // partPageNodes = pageNodes.slice(pageNodeIdx + 1).filter(pageNodeFilterFn);
        //     // nextPage = nextPage || partPageNodes[0];
        //     if (nextPage && notExistInDepends) {
        //         this.setCurrent(nextPage.tag || nextPage.extras);
        //         return;
        //     }
        //     //else {
        //     //     partPageNodes = pageNodes.slice(pageNodeIdx + 1).filter(pageNodeFilterFn);
        //     //     nextPage = partPageNodes[0];
        //     //     if (nextPage && notExistInDepends) {
        //     //         this.setCurrent(nextPage.tag || nextPage.extras);
        //     //         return;
        //     //     }
        //     // }
        // }
        // if (pageModel && pageModel.godFather) {
        //     pageModel.godFather.componentFactoryRef.selectNextVisiblePage(pageModel);
        // } else
        //     this.setCurrent(null);
    }
    selectNextVisiblePage(pageModel: IPageModel): void {
        let pageNodes = this.navTreeView.toList().filter(nd => nd.isGroup == false && nd.level > -1);
        let pageNodeIdx = pageNodes.findIndex(nd => nd.tag == pageModel || nd.extras == pageModel);
        let notExistInDepends = this.getDependentPageModels().findIndex(val => val == pageModel) < 0;
        let pageNodeFilterFn = (nd: NavTreeNode) =>
            (nd.tag && !nd.tag.modalRef) ||
            nd.tag.modalRef && nd.tag.modalRef.instance.modalWindowState !== FormStateEnum.Minimized ||
            (nd.extras && !nd.extras.modalRef) ||
            nd.extras.modalRef && nd.extras.modalRef.instance.modalWindowState !== FormStateEnum.Minimized;

        if (pageNodeIdx > -1) {
            let last = pageNodes.slice(0, pageNodeIdx).filter(pageNodeFilterFn).pop();
            let first = pageNodes.slice(pageNodeIdx + 1).filter(pageNodeFilterFn).shift();
            let nextPage = last || first;
            if (nextPage && notExistInDepends) {
                this.setCurrent(nextPage.tag || nextPage.extras);
                return;
            }
        }
        if (pageModel && pageModel.godFather) {
            pageModel.godFather.componentFactoryRef.selectNextVisiblePage(pageModel);
        } else
            this.setCurrent(null);
    }

    getComponentRef<T extends IComponentBase>(componentType: Type<T>, formModel?: IPageModel): ComponentRef<T> {
        const rootContainer = this.viewContainerRef ||
            this.appStore.taskManager.hostFactoryContainer.viewContainerRef;
        if (!rootContainer) {
            throw new Error('Should setup ViewContainerRef on modal options or config service!');
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        const injector: Injector = rootContainer.parentInjector;

        const componentRef = rootContainer.createComponent(componentFactory, rootContainer.length, injector);
        let componentInstance = componentRef.instance;
        let newFormModel = formModel ? formModel : this.createDefaultPageModel();
        componentInstance.pageModel = newFormModel;
        newFormModel.componentRef = componentRef;
        return componentRef;
    }
    private createDefaultPageModel(extras?: FormExtras) {
        let len = this.principalPageModels.length + 1;
        let title = UUID.uuid(8, 10).toString();
        let formGroupModel: IPageModel = {
            formType: FormTypeEnum.group,
            title: title + '默认组',
            active: false,
            childs: [],
            componentFactoryRef: this,
            parent: this.pageModel,
            resolve: this.appStore.handleResolve(extras && extras.resolve) || {},
            showType: extras && extras.showType || ShowTypeEnum.tab
        };
        this.pageModel.childs.push(formGroupModel);
        let groupNode = new NavTreeNode(UUID.uuid(8, 10), title + '默认组', '/skdd', 'sndwd', 0);
        groupNode.isGroup = true;
        groupNode.showNode = false;
        groupNode.tag = formGroupModel;
        formGroupModel.tag = groupNode;

        let pageList: IPageModel = {
            formType: FormTypeEnum.list,
            title: title,
            active: true,
            parent: formGroupModel,
            componentFactoryRef: this,
            childs: [],
            resolve: this.appStore.handleResolve(extras && extras.resolve) || {},
            showType: extras && extras.showType || ShowTypeEnum.tab
        };

        let nd = new NavTreeNode(UUID.uuid(8, 10), title, '/skdd', 'sndwd', 0);
        nd.tag = pageList;
        nd.showNode = false;
        pageList.tag = nd;

        groupNode.addNode(nd);
        formGroupModel.childs.push(pageList);
        this.navTreeView.addNode(groupNode);
        //添加依赖页面
        this.dependentPageModels.push(formGroupModel);
        this.setCurrent(formGroupModel);
        return pageList;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.componentFactoryDestroyFn) this.componentFactoryDestroyFn();
        this.pageModel = null;
    }
    ngOnInit(): void {
        super.ngOnInit();
    }
    protected componentFactoryDestroyFn: () => void;
    constructor(protected injector: Injector) {
        super(injector);
    }
    registerFactory(componentFactoryType: IComponentFactoryType) {
        this.activeRouter.queryParams
            .map(params => params['taskId'])
            .subscribe(param => {
                if (this.pageModel) {
                    this.pageModel.key = this.taskId = param;
                }
                this.componentFactoryDestroyFn = this.appStore.registerComponentFactoryRef(componentFactoryType);
            }).unsubscribe();
    }

    /**
     * 导航树项目单击事件默认实现
     * @param navNode 
     */
    onItemClick(navNode: NavTreeNode) {
        this.setCurrent(navNode.tag);
    }
    /**
     * 
     * @param navNode 导航树关闭按钮单击事件默认实现
     */
    async onItemCloseClick(navNode: NavTreeNode) {
        let formModel: IPageModel = navNode.tag;
        //根据model关闭,关闭前检查,等待关闭前处理函数
        await this.closePage(formModel);
    }

    /**
     * 组件关闭后回调函数默认实现
     * 
     */
    closeAfterFn: Function = () => {
        this.appStore.taskManager.closeTaskGroup(() => this.pageModel.key);
    };
}

