import { EventEmitter, ViewContainerRef, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { FormOptions } from '../components/form/FormOptions';
import { IPageModel } from './IFormModel';
import { IComponentFactoryType } from './IComponentFactoryType';
import { ActivatedRoute } from '@angular/router';
export interface IComponentBase {
    /**
     * 组件的标题
     */
    title: string;
    /**
     * 弹窗的数据模型
     */
    pageModel: IPageModel;
    /**
     * 设置关联容器
     */
    setOtherParent(godFather: IPageModel): IPageModel;
    /**
     * 显示弹窗
     */
    show(modalOptions?: FormOptions): any;
    /**
     * 显示模态弹窗
     */
    showModal(modalOptions?: FormOptions): any;

    getComponentFactoryType(): IComponentFactoryType;
    /**
     *  关闭前检查函数
     */
    closeBeforeCheckFn: Function;
    /**
     * 模式窗口关闭后运行的函数
     */
    closeAfterFn: Function;
    /**
     * 模式窗口返回的结果流
     */
    modalResult: EventEmitter<any>;
    /**
     * 数据上下文
     */
    context: any;
    /**
     * extral附加对象
     */
    tag: any;
    viewContainerRef: ViewContainerRef;
    componentFactoryResolver: ComponentFactoryResolver;
    activeRouter: ActivatedRoute;
    changeDetectorRef: ChangeDetectorRef;

}