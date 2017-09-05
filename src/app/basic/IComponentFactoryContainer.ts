import { IFormModel } from './IFormModel';
import { NavTreeViewComponent } from '../components/nav-tree-view/nav-tree-view.component';
import { IComponentBase } from './IComponentBase';
import { Type, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IAction } from '../Models/IAction';
import { FormExtras } from './FormExtras';
export interface IComponentFactoryContainer {
    /**
     * 组的标题
     */
    groupTitle: string;
    /**
     * 主体页面打开的列表
     */
    principalPageModels: IFormModel[];
    /**
     * 依赖页面打开的列表
     */
    dependentPageModels: IFormModel[];
    /**
     * 导航树
     */
    navTreeView: NavTreeViewComponent;
    /**
     * 创建组
     */
    createGroup(formExtras?: FormExtras): IFormModel;
    /**
     * 创建列表
     */
    createList(groupFormModel: IFormModel, formExtras?: FormExtras): IFormModel;
    /**
     * 创建明细
     */
    createDetail(groupFormModel: IFormModel, formExtras?: FormExtras): IFormModel;
    /**
     * 创建组和列表
     */
    createGroupList(formExtras?: FormExtras): IFormModel;
    /**
     * 创建一个组和明细
     */
    createGroupDetail(formExtras?: FormExtras): IFormModel;
    /**
     * 移除弹窗模型
     */
    removeFormModel(formModel: IFormModel): void;
    /**
     * 设置活动项
     */
    setCurrent(formModel: IFormModel): void;
    /**
     * 关闭所有弹窗
     */
    closeAllForm(action: IAction): void;
    /**
    * 关闭页
    */
    closePage(formModel: IFormModel): Promise<any>;
    /**
     * 选择下一个可见弹窗
     */
    selectNextVisibleForm(formModel: IFormModel): void;
    /**
     * 获取组件引用
     */
    getComponentRef<T extends IComponentBase>(componentType: Type<T>, formModel?: IFormModel): ComponentRef<T>;
    /**
     * 隐藏所有显示的窗口
     */
    hidePageModels(): void;
    /**
     * 显示所有隐藏的窗口
     */
    showPageModels(): void;
    viewContainerRef: ViewContainerRef;
    componentFactoryResolver: ComponentFactoryResolver
}