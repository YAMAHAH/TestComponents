import { ComponentRef } from '@angular/core';
import { FormTypeEnum } from './FormTypeEnum';
import { NavTreeViewComponent } from '../components/nav-tree-view/nav-tree-view.component';
import { ShowTypeEnum } from './show-type-enum';
import { IComponentFactoryContainer } from './IComponentFactoryContainer';
import { Form } from '../components/form/form';
export interface IFormModel {
    key?: string;
    title: string;
    active: boolean;
    parent?: IFormModel;
    godFather?: IFormModel;
    childs?: IFormModel[];
    level?: number;
    tag?: any;
    elementRef?: any;
    elementComponentRef?: any;
    modalRef?: ComponentRef<Form>;
    componentFactoryRef?: IComponentFactoryContainer;
    componentRef?: ComponentRef<any>;
    closeBeforeCheckFn?: Function;
    closeAfterFn?: Function;
   // treeView?: NavTreeViewComponent;
    formType?: FormTypeEnum;
    showType?: ShowTypeEnum;
    resolve?: any; //解析数据
}