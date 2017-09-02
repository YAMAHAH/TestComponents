import { IFormModel } from './IFormModel';
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
     * formModel决定组件
     */
    childFormLists: IFormModel[];
    /**
     * 组件决定formModel
     */
    childFormInstances: IFormModel[];
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
     * 选择下一个可见弹窗
     */
    selectNextVisibleForm(formModel: IFormModel): void;
    /**
     * 获取组件引用
     */
    getComponentRef<T extends IComponentBase>(componentType: Type<T>, formModel?: IFormModel): ComponentRef<T>;

    viewContainerRef: ViewContainerRef;
    componentFactoryResolver: ComponentFactoryResolver
}