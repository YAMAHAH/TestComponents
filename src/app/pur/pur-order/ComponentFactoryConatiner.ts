import { ComponentBase } from './ComponentBase';
import { OnInit, OnDestroy, ComponentFactoryResolver, ViewContainerRef, Type, ComponentRef, Injector, AfterViewInit, ViewChild } from '@angular/core';
import { IComponentFactoryContainer } from '../../basic/IComponentFactoryContainer';
import { IComponentBase } from '../../basic/IComponentBase';
import { IPageModel } from '../../basic/IFormModel';
import { IAction } from '../../Models/IAction';
import { PageModelExtras } from '../../basic/PageModelExtras';
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
import { IComponentType } from '../../basic/IComponentType';

export abstract class ComponentFactoryConatiner extends ComponentBase
    implements OnInit, OnDestroy, IComponentFactoryContainer {
    public viewContainerRef: ViewContainerRef;
    public componentFactoryResolver: ComponentFactoryResolver;
    groupTitle: string;
    principalPageModels: IPageModel[] = [];
    dependentPageModels: IPageModel[] = [];
    @ViewChild(NavTreeViewComponent) navTreeView: NavTreeViewComponent;
    createGroup(pageModelExtras?: PageModelExtras): IPageModel {
        let len = this.principalPageModels.length + 1;
        let groupPageModel: IPageModel = {
            formType: FormTypeEnum.group,
            title: this.title + "分组-" + len.toString(10),
            active: false,
            childs: [],
            componentFactoryRef: this,
            parent: this.pageModel,
            resolve: this.appStore.handleResolve(pageModelExtras && pageModelExtras.resolve),
            showType: pageModelExtras && pageModelExtras.showType || this.appStore.showType
        };
        this.pageModel.childs.push(groupPageModel);
        let groupNode = new NavTreeNode(UUID.uuid(8, 10), this.title + "分组-" + len.toString(10), '/skdd', 'sndwd', 0);
        groupNode.isGroup = true;
        groupNode.tag = groupPageModel;
        if (pageModelExtras && pageModelExtras.hasOwnProperty('visibleInNavTree') && !pageModelExtras.visibleInNavTree)
            groupNode.showNode = false;
        else groupNode.showNode = true;

        groupPageModel.tag = groupNode;

        this.navTreeView.addNode(groupNode);
        if (pageModelExtras && !!pageModelExtras.godFather) {
            this.addDependentPageModel(groupPageModel);//新增加内容,运行不正常
        }
        this.addPrincipalPageModel(groupPageModel);

        this.setCurrent(groupPageModel);
        return groupPageModel;
    }
    protected addPrincipalPageModel(pageModel: IPageModel) {
        if (pageModel) {
            this.principalPageModels.push(pageModel);
        }
    }
    protected addDependentPageModel(pageModel: IPageModel) {
        if (pageModel) {
            this.dependentPageModels.push(pageModel);
        }
    }

    createList(groupPageModel: IPageModel, pageModelExtras?: PageModelExtras): IPageModel {
        let len = this.principalPageModels.length + 1;
        let listPageModel: IPageModel = {
            formType: FormTypeEnum.list,
            title: this.title + "清单-" + len.toString(10),
            active: true,
            parent: groupPageModel,
            componentFactoryRef: this,
            childs: [],
            resolve: this.appStore.handleResolve(pageModelExtras && pageModelExtras.resolve),
            showType: pageModelExtras && pageModelExtras.showType || this.appStore.showType
        };

        let nd = new NavTreeNode(UUID.uuid(8, 10), this.title + "清单-" + len.toString(10), '/skdd', 'sndwd', 0);
        nd.tag = listPageModel;
        if (pageModelExtras && pageModelExtras.hasOwnProperty('visibleInNavTree') && !pageModelExtras.visibleInNavTree)
            nd.showNode = false;
        else nd.showNode = true;
        listPageModel.tag = nd;

        groupPageModel.tag.addNode(nd);
        groupPageModel.childs.push(listPageModel);
        if (pageModelExtras && pageModelExtras.godFather) {
            this.setGodFather(listPageModel, pageModelExtras.godFather);
        }
        this.setCurrent(listPageModel);
        return listPageModel;
    }
    createDetail(groupPageModel: IPageModel, pageModelExtras?: PageModelExtras): IPageModel {
        let editPageModel: IPageModel = {
            formType: FormTypeEnum.detail,
            key: UUID.uuid(8, 10),
            title: UUID.uuid(8, 10),
            active: false,
            tag: null,
            componentFactoryRef: this,
            parent: groupPageModel,
            resolve: this.appStore.handleResolve(pageModelExtras && pageModelExtras.resolve),
            showType: pageModelExtras && pageModelExtras.showType || this.appStore.showType,
            childs: []
        };

        groupPageModel.childs.push(editPageModel);

        let ndKey = UUID.uuid(8, 10);
        let newNode = new NavTreeNode(ndKey, ndKey, '/skdd', 'sndwd', 0);
        newNode.tag = editPageModel;
        if (pageModelExtras && pageModelExtras.hasOwnProperty('visibleInNavTree') && !pageModelExtras.visibleInNavTree)
            newNode.showNode = false;
        else newNode.showNode = true;
        editPageModel.tag = newNode;

        let parentNode = groupPageModel.tag as NavTreeNode;
        if (parentNode) {
            parentNode.addNode(newNode);
        }
        if (pageModelExtras && pageModelExtras.godFather) {
            this.setGodFather(editPageModel, pageModelExtras.godFather);
        }
        this.setCurrent(editPageModel);
        return editPageModel;
    }
    /**
     * 设置干爹
     * @param child 
     * @param godFather 
     */
    setGodFather(child: IPageModel, godFather: IPageModel): IPageModel {
        if (godFather) {
            godFather.childs.push(child);
            child.godFather = godFather;
            if (child.tag) {
                //设置关联的结点在导航树不可见,关闭TAB时也要考虑这种情况
                let nd = child.tag as NavTreeNode;
                nd.showNode = false;
                nd.getParents().forEach(val => val.showNode = false);
            }
            //创建依赖引用结点,添加到导航树中
            let dependNode = new NavTreeNode(child.key, child.title, '/', '', 0);
            dependNode.tag = child;
            dependNode.isDependRef = true;

            child.extras = dependNode;
            let parentNode = godFather.tag as NavTreeNode;
            if (parentNode) {
                parentNode.addNode(dependNode);
                godFather.componentFactoryRef.navTreeView.setCurrent(dependNode);
                godFather.componentFactoryRef.changeDetectorRef.markForCheck();
            }
        }
        return child;
    }

    createGroupList(pageModelExtras?: PageModelExtras): IPageModel {
        let group = this.createGroup(pageModelExtras);
        return this.createList(group, pageModelExtras);
    }
    createGroupDetail(pageModelExtras?: PageModelExtras): IPageModel {
        let group = this.createGroup(pageModelExtras);
        return this.createDetail(group, pageModelExtras);
    }

    protected taskId: any;
    /**
     * 移除儿子
     * 同时从干爹列表中移除
     * @param pageModel 
     */
    removePageModel(pageModel: IPageModel): void {
        if (!!!pageModel) return;
        let pageNodes = this.navTreeView.toList().filter((nd) => nd.isGroup == false);
        let pageIdx = pageNodes.findIndex(nd => nd.tag == pageModel);
        let detailIdx;
        if (pageIdx > -1) {
            this.selectNextVisiblePage(pageModel);
            //如果有干爹,也要从干爹的列表中删除
            this.removePageModelFromGodFather(pageModel);
            let nd = pageNodes[pageIdx];
            let curPageParent: IPageModel = nd.tag.parent;
            if (curPageParent) { //parent如果有父结点则从父结点中删除
                detailIdx = curPageParent.childs.findIndex((mx: any) => mx == nd.tag);
                if (detailIdx > -1) {
                    let delItem2 = curPageParent.childs.splice(detailIdx, 1)[0];
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
     * @param pageModel 
     */
    removePageModelFromGodFather(pageModel: IPageModel) {
        if (pageModel && pageModel.godFather) {
            let idx = pageModel.godFather.childs.findIndex((value) => value === pageModel);
            if (idx > -1) {
                pageModel.godFather.childs.splice(idx, 1);
            }
            let godFatherNode: NavTreeNode = pageModel.godFather.tag;
            let nodeIdx = godFatherNode && godFatherNode.childs.findIndex(child => child === pageModel.extras);
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
        if (notExistInDepends && this.current && !!!this.current.godFather && this.current.showType == ShowTypeEnum.tab) {
            this.current.active = false;
        } else if (this.current)
            this.current.active = true;

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

    setCurrentTreeNode(formModel: IPageModel) {
        if (formModel) {
            if (!!!formModel.godFather && formModel.componentFactoryRef) {
                formModel.componentFactoryRef.navTreeView.setCurrent(formModel.tag);
                formModel.componentFactoryRef.changeDetectorRef.markForCheck();
            } else {
                let godFather = formModel.godFather;
                if (godFather && godFather.componentFactoryRef) {
                    godFather.componentFactoryRef.navTreeView.setCurrent(formModel.extras);
                    godFather.componentFactoryRef.changeDetectorRef.markForCheck();
                }
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

    closePage(pageModel: IPageModel) {
        //根据model关闭,关闭前检查,等待关闭前处理函数
        return new Promise(async resolve => {
            let event = { cancel: true, sender: pageModel };
            if (pageModel) {
                let destroyFn;
                if (pageModel.closeBeforeCheckFn && isFunction(pageModel.closeBeforeCheckFn)) {
                    destroyFn = await pageModel.closeBeforeCheckFn(event);
                }
                if (event.cancel) {
                    await this.closeChildPage(pageModel);
                    if (pageModel && pageModel.modalRef && pageModel.modalRef.instance)
                        pageModel.modalRef.instance.forceClose(null);
                    if (isFunction(pageModel.closeAfterFn)) pageModel.closeAfterFn();
                    //从窗口中操作
                    pageModel.componentFactoryRef.removePageModel(pageModel);
                }
                if (isFunction(destroyFn)) destroyFn();
            }
            resolve(event.cancel);
        });
    }
    private async closeChildPage(pageModel: IPageModel) {
        return new Promise(resolve => {
            if (pageModel && pageModel.childs) {
                let childPages = pageModel.childs.filter(page => !!!page.godFather);
                Observable.from(childPages)
                    .flatMap(page => {
                        if (page && page.modalRef && page.modalRef.instance) {
                            return Observable.fromPromise(page.modalRef.instance.forceClose(null));
                        } else if (page) {
                            return Observable.fromPromise(this.closePage(page));
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
        let pageNodeIdx = pageNodes.findIndex(nd => nd.tag == pageModel); //|| nd.extras == pageModel
        let notExistInDepends = this.getDependentPageModels().findIndex(val => val == pageModel) < 0;
        let pageNodeFilterFn = (nd: NavTreeNode) =>
            (nd.tag && !nd.tag.modalRef) ||
            nd.tag.modalRef && nd.tag.modalRef.instance.modalWindowState !== FormStateEnum.Minimized; // ||
        // (nd.extras && !nd.extras.modalRef) ||
        // nd.extras.modalRef && nd.extras.modalRef.instance.modalWindowState !== FormStateEnum.Minimized;

        if (pageNodeIdx > -1) {
            let last = pageNodes.slice(0, pageNodeIdx).filter(pageNodeFilterFn).pop();
            let first = pageNodes.slice(pageNodeIdx + 1).filter(pageNodeFilterFn).shift();
            let nextPage = last || first;
            if (nextPage && notExistInDepends) {
                this.setCurrent(nextPage.tag); //|| nextPage.extras
                return;
            }
            if (!!!nextPage) { //nextPage = undefined时,表示已经没有可显示的页
                this.setCurrent(null);
                return;
            }
        }
        if (pageModel && pageModel.godFather) {
            pageModel.godFather.componentFactoryRef.selectNextVisiblePage(pageModel);
        } else
            this.setCurrent(null);
    }

    createListComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createEditComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createQueryComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createContainerComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
    }
    createComponentRef<T extends IComponentBase>(componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
        return this.componentReducer(componentType, pageModel) as any;
    }
    componentReducer<T extends IComponentBase>(componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T> {
        throw new Error("Method not implemented.");
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
    private createDefaultPageModel(pageModelExtras?: PageModelExtras) {
        let len = this.principalPageModels.length + 1;
        let title = UUID.uuid(8, 10).toString();
        let groupPageModel: IPageModel = {
            formType: FormTypeEnum.group,
            title: title + '默认组',
            active: false,
            childs: [],
            componentFactoryRef: this,
            parent: this.pageModel,
            resolve: this.appStore.handleResolve(pageModelExtras && pageModelExtras.resolve) || {},
            showType: pageModelExtras && pageModelExtras.showType || ShowTypeEnum.tab
        };
        this.pageModel.childs.push(groupPageModel);
        let groupNode = new NavTreeNode(UUID.uuid(8, 10), title + '默认组', '/skdd', 'sndwd', 0);
        groupNode.isGroup = true;
        groupNode.showNode = false;
        groupNode.tag = groupPageModel;
        groupPageModel.tag = groupNode;

        let pageList: IPageModel = {
            formType: FormTypeEnum.list,
            title: title,
            active: true,
            parent: groupPageModel,
            componentFactoryRef: this,
            childs: [],
            resolve: this.appStore.handleResolve(pageModelExtras && pageModelExtras.resolve) || {},
            showType: pageModelExtras && pageModelExtras.showType || ShowTypeEnum.tab
        };

        let nd = new NavTreeNode(UUID.uuid(8, 10), title, '/skdd', 'sndwd', 0);
        nd.tag = pageList;
        nd.showNode = false;
        pageList.tag = nd;

        groupNode.addNode(nd);
        groupPageModel.childs.push(pageList);
        this.navTreeView.addNode(groupNode);
        //添加依赖页面
        this.addDependentPageModel(groupPageModel);
        this.setCurrent(groupPageModel);
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
    async registerFactory(componentFactoryType: IComponentFactoryType): Promise<void> {
        return new Promise<void>(resolve => {
            this.activeRouter.queryParams
                .map(params => params['taskId'])
                .subscribe(param => {
                    if (this.pageModel) {
                        this.pageModel.key = this.taskId = param;
                    }
                    this.componentFactoryDestroyFn = this.appStore.registerComponentFactoryRef(componentFactoryType);
                }).unsubscribe();
        });

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

