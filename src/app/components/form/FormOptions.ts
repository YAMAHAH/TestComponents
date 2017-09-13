import { ViewContainerRef, Injector, Type, ComponentRef, EventEmitter } from '@angular/core';
import { IPageModel } from '../../basic/IFormModel';
import { FormTitleAlignEnum } from './FormTitleAlignEnum';
export class FormOptions {
    componentOutlets: Type<any>[] = [];//要创建的组件
    componentRef: ComponentRef<any>; //已经创建组件的引用实例
    resolve: any;
    visible: boolean = true;
    appendTo: any;// 容器添加到指定元素
    isForceAppend: boolean = false;

    append: any;//添加指定元素到内容区域
    appendComponentRef: any;//已渲染的组件引用
    style: any;
    styleClass: string;
    modal: boolean = true;
    backdrop: boolean = false;
    resizable: boolean = true;
    draggable: boolean = true;
    closeOnEscape: boolean = false;
    dismissableMask: boolean = false;
    responsive: boolean = true;
    header: string;
    showHeader: boolean = true;
    titleAlign: FormTitleAlignEnum = FormTitleAlignEnum.left;
    position: string = 'center-center';//默认位置
    posCss: string = "left:12px;top:12px;"; //自定义位置CSS
    minWidth: number = 150;
    minHeight: number = 150;
    width: any;
    height: any;
    contentHeight: any;
    rtl: boolean;
    closable: boolean = true;
    checkCloseBeforeFn: Function; //关闭前检查函数
    closeAfterCallBackFn: Function;//关闭后回调函数
    rootContainer: ViewContainerRef;
    injector: Injector;
    formModel: IPageModel;

}
