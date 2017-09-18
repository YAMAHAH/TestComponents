import { IPageModel } from './IFormModel';
import { NavTreeViewComponent } from '../components/nav-tree-view/nav-tree-view.component';
import { IComponentBase } from './IComponentBase';
import { Type, ComponentRef, ComponentFactoryResolver, ViewContainerRef, InjectionToken } from '@angular/core';
import { IAction } from '../Models/IAction';
import { PageModelExtras } from './PageModelExtras';
import { IComponentType } from './IComponentType';
import { HostViewContainerDirective } from '../common/directives/host.view.container';
export interface IComponentFactoryContainer extends IComponentBase {
    /**
     * 组的标题
     */
    groupTitle: string;
    /**
     * 主体页面打开的列表
     */
    principalPageModels: IPageModel[];
    /**
     * 依赖页面打开的列表
     */
    dependentPageModels: IPageModel[];
    /**
     * 导航树
     */
    navTreeView: NavTreeViewComponent;
    /**
     * 页面查看器渲染入口
     */
    pageViewerLocation: HostViewContainerDirective;
    /**
     * 创建组
     */
    createGroup(pageModelExtras?: PageModelExtras): IPageModel;
    /**
     * 创建列表
     */
    createList(groupFormModel: IPageModel, pageModelExtras?: PageModelExtras): IPageModel;
    /**
     * 创建明细
     */
    createDetail(groupPageModel: IPageModel, pageModelExtras?: PageModelExtras): IPageModel;
    /**
     * 创建组和列表
     */
    createGroupList(pageModelExtras?: PageModelExtras): IPageModel;
    /**
     * 创建一个组和明细
     */
    createGroupDetail(pageModelExtras?: PageModelExtras): IPageModel;
    /**
     * 移除弹窗模型
     */
    removePageModel(pageModel: IPageModel): void;
    /**
     * 设置活动项
     */
    setCurrent(pageModel: IPageModel): void;
    /**
     * 设置当前活动树结点
     */
    setCurrentTreeNode(formModel: IPageModel): void;
    /**
     * 关闭所有弹窗
     */
    closeAllPages(action: IAction): void;
    /**
    * 关闭页
    */
    closePage(pageModel: IPageModel): Promise<any>;
    /**
     * 关闭单个pageModel处理函数
     */
    closePageHandler(pageModel: IPageModel): Promise<boolean>;
    /**
     * 关闭子视图
     */
    closeChildViews(pageModel: IPageModel): Promise<void>;
    /**
     * 选择下一个可见页面
     */
    selectNextVisiblePage(pageModel: IPageModel): void;
    /**
     * 获取组件引用
     */
    getComponentRef<T extends IComponentBase>(componentType: Type<T>, pageModel?: IPageModel): ComponentRef<T>;
    /**
     * 获取服务
     */
    getService<T>(serviceType: Type<T> | InjectionToken<T>): T;
    /**
     * 创建列表类型的组件
     * 派生类必须实现
     */
    createListComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T>;
    /**
     * 创建编辑类型的组件
     * 派生类必须实现
     */
    createEditComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T>;
    /**
     * 创建查询类型的组件
     * 派生类必须实现
     */
    createQueryComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T>;
    /**
     *  创建容器类型的组件
     * 派生类必须实现
     */
    createContainerComponent<T extends IComponentBase>(pageModel?: IPageModel): ComponentRef<T>;
    /**
     * 根据组件类型创建组件引用
     */
    createComponentRef<T extends IComponentBase>(componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T>;
    /**
     * 根据组件类型决定创建组件的引用
     */
    componentReducer<T extends IComponentBase>(componentType: Type<IComponentType>, pageModel?: IPageModel): ComponentRef<T>;
    /**
     * 隐藏所有显示的窗口
     */
    hidePageModels(): void;
    /**
     * 显示所有隐藏的窗口
     */
    showPageModels(): void;
    /**
     * 切换到PageViewer视图
     */
    switchToPageViewer(pageModel: IPageModel): void;
    /**
     * 切换到pageForm视图
     */
    switchToPageForm(pageModel: IPageModel): void;
    /**
     * 切换到主视图,即第一次打开的视图
     */
    switchToMainView(pageModel: IPageModel): void;
}