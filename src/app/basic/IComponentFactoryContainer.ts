import { IPageModel } from './IFormModel';
import { NavTreeViewComponent } from '../components/nav-tree-view/nav-tree-view.component';
import { IComponentBase } from './IComponentBase';
import { Type, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IAction } from '../Models/IAction';
import { FormExtras } from './FormExtras';
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
     * 创建组
     */
    createGroup(formExtras?: FormExtras): IPageModel;
    /**
     * 创建列表
     */
    createList(groupFormModel: IPageModel, formExtras?: FormExtras): IPageModel;
    /**
     * 创建明细
     */
    createDetail(groupPageModel: IPageModel, formExtras?: FormExtras): IPageModel;
    /**
     * 创建组和列表
     */
    createGroupList(formExtras?: FormExtras): IPageModel;
    /**
     * 创建一个组和明细
     */
    createGroupDetail(formExtras?: FormExtras): IPageModel;
    /**
     * 移除弹窗模型
     */
    removePageModel(pageModel: IPageModel): void;
    /**
     * 设置活动项
     */
    setCurrent(pageModel: IPageModel): void;
    /**
     * 关闭所有弹窗
     */
    closeAllPages(action: IAction): void;
    /**
    * 关闭页
    */
    closePage(pageModel: IPageModel): Promise<any>;
    /**
     * 选择下一个可见页面
     */
    selectNextVisiblePage(pageModel: IPageModel): void;
    /**
     * 获取组件引用
     */
    getComponentRef<T extends IComponentBase>(componentType: Type<T>, pageModel?: IPageModel): ComponentRef<T>;
    /**
     * 隐藏所有显示的窗口
     */
    hidePageModels(): void;
    /**
     * 显示所有隐藏的窗口
     */
    showPageModels(): void;
}