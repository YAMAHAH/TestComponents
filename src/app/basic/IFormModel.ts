import { ComponentRef } from '@angular/core';
import { FormTypeEnum } from './FormTypeEnum';
import { NavTreeViewComponent } from '../components/nav-tree-view/nav-tree-view.component';
import { ShowTypeEnum } from './show-type-enum';
import { IComponentFactoryContainer } from './IComponentFactoryContainer';
import { Form } from '../components/form/form';
export interface IFormModel {
    /**
     * 主键
     */
    key?: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 活动
     */
    active: boolean;
    /** 
     * 父亲
     */
    parent?: IFormModel;
    /**
     * 干爹
     */
    godFather?: IFormModel;
    /**
     * 儿子
     */
    childs?: IFormModel[];
    /**
     * 层次
     */
    level?: number;
    /**
     * 附加数据对象
     */
    tag?: any;
    /**
     * 元素引用
     */
    elementRef?: any;
    elementComponentRef?: any;
    /**
     * 弹窗实例引用
     */
    modalRef?: ComponentRef<Form>;
    /**
     * 组件工厂引用
     */
    componentFactoryRef?: IComponentFactoryContainer;
    /**
     * 组件引用
     */
    componentRef?: ComponentRef<any>;
    /**
     * 关闭前检查回调
     */
    closeBeforeCheckFn?: Function;
    /**
     * 关闭后回调
     */
    closeAfterFn?: Function;
    /**
     * 页面类型
     */
    formType?: FormTypeEnum;
    /**
     * 页面显示类型
     */
    showType?: ShowTypeEnum;
    /**
     * 数据提供解析
     */
    resolve?: any;
}