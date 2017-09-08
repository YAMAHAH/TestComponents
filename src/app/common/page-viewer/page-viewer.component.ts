import { Component, Input, ElementRef, ViewChild, ComponentRef, Type, EventEmitter, AfterViewInit, OnDestroy, Renderer2, Output, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { IPageModel } from '../../basic/IFormModel';
import { DomHandler } from "@common/dom/domhandler";
import { FormTypeEnum } from '../../basic/FormTypeEnum';

@Component({
    moduleId: module.id,
    selector: 'page-viewer',
    templateUrl: 'page-viewer.component.html',
    styleUrls: ['page-viewer.component.scss']
})
export class PageViewerComponent implements AfterViewInit, AfterViewChecked, OnChanges, OnDestroy {
    @Input() pageModel: IPageModel;

    @Input() contentHeight: any;

    @Input() append: ElementRef;
    appendParentNode: HTMLElement;

    @ViewChild('content') contentElementRef: ElementRef;

    @Input() context: any = {};

    @Input() componentOutlets: Type<any>[] = [];

    @Input() componentRef: ComponentRef<any>;

    @Output() modalResult: EventEmitter<any> = new EventEmitter();
    @Output() onBeforeShow: EventEmitter<any> = new EventEmitter();

    @Output() onAfterShow: EventEmitter<any> = new EventEmitter();

    @Output() onBeforeHide: EventEmitter<any> = new EventEmitter();

    @Output() onAfterHide: EventEmitter<any> = new EventEmitter();

    @Output() visibleChange: EventEmitter<any> = new EventEmitter();
    _selectResult: any = { status: 'default', modalResult: null };
    _modalResult: EventEmitter<any> = new EventEmitter();
    compctx = () => {
        let self = this;
        return {
            parent: this,
            modalResult: this._modalResult,
            get context() { return self.context; }
        };
    }

    shown: boolean;
    _visible: boolean;
    @Input() get visible(): boolean {
        return this._visible;
    }

    set visible(val: boolean) {
        this._visible = val;

        if (this._visible) {
            this.onBeforeShow.emit({});
            this.shown = true;
        }
    }

    constructor(protected renderer: Renderer2, public domHandler: DomHandler) {

    }
    ngAfterViewInit() {
        this._modalResult.subscribe((result: any) => {
            this._selectResult = result;
            if (result) this.hide(null);
        });
        if (!!!this.componentRef && (!!!this.pageModel || this.pageModel && !!!this.pageModel.componentRef) && this.append) {
            this.appendParentNode = this.append.nativeElement.parentNode;
            this.renderer.appendChild(this.contentElementRef.nativeElement, this.append.nativeElement);
        }
    }
    ngAfterViewChecked() {
        if (this.shown) {
            this.show();
            this.onAfterShow.emit({});
            this.shown = false;
        }
    }
    ngOnChanges(changes: SimpleChanges): void {

    }

    close() {

    }
    show(): void {
        //完成检查后的逻辑处理
    }
    hide(event: Event) {
        if (event) event.preventDefault();

        this.onBeforeHide.emit(event);

        //充许关闭后才
        this.modalResult.emit(this._selectResult);

        this.visibleChange.emit(false);

        this.onAfterHide.emit(event);

        if (this.append) {
            this.append.nativeElement.visible = false;
        }
        if (this.pageModel && this.pageModel.componentFactoryRef) {
            if (this.pageModel.formType == FormTypeEnum.container)
                this.pageModel.globalManager &&
                    this.pageModel.globalManager.taskManager &&
                    this.pageModel.globalManager.taskManager.closeTaskGroup(() => this.pageModel.key);
            else
                this.pageModel.componentFactoryRef.removePageModel(this.pageModel);
        }

    }

    ngOnDestroy(): void {
        if (this.append) {
            if (this.appendParentNode) {
                this.appendParentNode.appendChild(this.append.nativeElement);
            }
            this.append.nativeElement.visible = true;
        }
    }



}
