import { ViewContainerRef, Injector, Type, ComponentRef, EventEmitter, ElementRef } from '@angular/core';
import { IPageModel } from '../../basic/IFormModel';
import { IComponentBase } from '../../basic/IComponentBase';
export class PageViewerOptions {
    componentOutlets: Type<any>[] = [];//要创建的组件
    componentRef: ComponentRef<any>; //已经创建组件的引用实例
    resolve: any;
    visible: boolean = true;
    appendTo: ElementRef | string;// 容器添加到指定元素
    append: any;//添加指定元素到内容区域
    isForceAppend: boolean = false;
    appendComponentRef: IComponentBase;//已渲染的组件引用
    style: any;
    styleClass: string
    responsive: boolean = true;
    header: string;
    showHeader: boolean = true;
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
    pageModel: IPageModel;
}
