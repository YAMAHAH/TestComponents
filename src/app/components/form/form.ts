import {
    NgModule, Component, ElementRef, AfterViewInit, AfterViewChecked,
    OnDestroy, Input, Output, EventEmitter, Renderer,
    ContentChild, ViewChild, trigger, state, style,
    transition, animate, Type, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header, UISharedModule } from '../../common/shared/shared';
import { styleUntils } from '../../untils/style';
import { Subscription } from 'rxjs/Subscription';

import { ComponentRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DomHandler } from '../../common/dom/domhandler';
import { IPageModel } from '../../basic/IFormModel';
import { isFunction } from '../../untils/type';
import { SizingPointEnum } from './SelectPointEnum';
import { FormStateEnum } from './FormStateEnum';
import { FormTitleAlignEnum } from './FormTitleAlignEnum';
import { FormTypeEnum } from '../../basic/FormTypeEnum';

@Component({
    selector: 'x-form',
    templateUrl: './form.html',
    styleUrls: ['./form.css'],
    animations: [
        trigger('dialogState', [
            state('hidden', style({
                opacity: 0
            })),
            state('visible', style({
                opacity: 1
            })),
            transition('visible => hidden', animate('400ms ease-in')),
            transition('hidden => visible', animate('400ms ease-out'))
        ])
    ],
    providers: [DomHandler]
})
export class Form implements AfterViewInit, AfterViewChecked, OnDestroy, OnChanges {
    static POSITIONS: Array<String> = ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'top-center', 'bottom-center', 'center-center', 'custom'];

    @Input() header: string;
    @Input() titleAlign: FormTitleAlignEnum = FormTitleAlignEnum.left;
    formTitleAlign = FormTitleAlignEnum;

    @Input() draggable: boolean = true;

    @Input() resizable: boolean = true;

    @Input() minWidth: number = 150;

    @Input() minHeight: number = 150;

    @Input() width: any;

    @Input() height: any;

    @Input() contentHeight: any;

    @Input() modal: boolean;
    @Input() backdrop: boolean = false;

    @Input() closeOnEscape: boolean = true;

    @Input() dismissableMask: boolean;

    @Input() rtl: boolean;

    @Input() closable: boolean = true;

    @Input() responsive: boolean;

    @Input() appendTo: any;
    @Input() append: any;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() showHeader: boolean = true;

    private _position: string | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top-center' | 'bottom-center' | 'center-center' | 'custom' = 'center-center';

    @Input() set position(value: string) {
        if (value) {
            let notFound = true;
            for (let i = 0; i < Form.POSITIONS.length; i++) {
                if (Form.POSITIONS[i] === value) {
                    notFound = false;
                    break;
                }
            }
            if (notFound) {
                // Position was wrong - clear it here to use the one from config.
                value = 'center-center' //this.config.position;
            }
        } else {
            value = 'center-center' //this.config.position;
        }
        this._position = value;
    }
    get position(): string {
        return this._position;
    }
    @Input() posCss: string = "bottom:12px;right:12px;";


    @ContentChild(Header) headerFacet: Header;

    @ViewChild('container') containerViewChild: ElementRef;

    @ViewChild('content') contentViewChild: ElementRef;

    @Output() onBeforeShow: EventEmitter<any> = new EventEmitter();

    @Output() onAfterShow: EventEmitter<any> = new EventEmitter();

    @Output() onBeforeHide: EventEmitter<any> = new EventEmitter();

    @Output() onAfterHide: EventEmitter<any> = new EventEmitter();

    @Output() visibleChange: EventEmitter<any> = new EventEmitter();

    @Output() modalResult: EventEmitter<any> = new EventEmitter();

    _modalResult: EventEmitter<any> = new EventEmitter();
    componentRefs: ComponentRef<any>[] = [];
    _visible: boolean;

    dragging: boolean;

    documentDragListener: Function;

    resizing: boolean;

    documentResizeListener: Function;

    documentResizeEndListener: Function;

    documentResponsiveListener: Function;

    documentEscapeListener: Function;

    maskClickListener: Function;

    lastPageX: number;

    lastPageY: number;

    mask: HTMLDivElement;

    shown: boolean;

    container: HTMLDivElement;

    contentContainer: HTMLDivElement;

    positionInitialized: boolean;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) { }

    @Input() get visible(): boolean {
        return this._visible;
    }

    set visible(val: boolean) {
        this._visible = val;

        if (this._visible) {
            this.onBeforeShow.emit({});
            this.shown = true;
        }
        if (this.modal && !this._visible) {
            this.disableModality();
        }
    }


    @Input() context: any = { target: 1358 };
    @Input() componentOutlets: Type<any>[] = [];
    @Input() checkCloseBeforeFn: Function = async (event: any) => new Promise<any>(resolve => {
        event.cancel = true;
        return resolve(event);
    });
    @Input() closeAfterCallBackFn: Function = null;
    @Input() componentRef: ComponentRef<any>;
    @Input() ngComponentOutlet: Type<any>;

    compctx = () => {
        let self = this;
        return {
            parent: this,
            modalResult: this._modalResult,
            get context() { return self.context; }
        };
    }
    show() {
        if (!this.positionInitialized) {
            switch (this.position) {
                case 'center-center':
                    this.center();
                    break;
                default:
                    break;
            }
            this.positionInitialized = true;
        }

        this.container.style.zIndex = String(++DomHandler.zindex);

        if (this.modal) {
            this.enableModality();
        }
    }
    _selectResult: any = { status: 'default', modalResult: null };
    appendParent: any;
    ngAfterViewInit() {
        this._modalResult.subscribe((result: any) => {
            this._selectResult = result;
            if (result) this.hide(null);
        });

        this.container = <HTMLDivElement>this.containerViewChild.nativeElement;
        this.contentContainer = <HTMLDivElement>this.contentViewChild.nativeElement;

        // if (this.draggable) {
        //     this.documentDragListener = this.renderer.listenGlobal('body', 'mousemove', (event: Event) => {
        //         this.onDrag(event);
        //     });
        // }

        // if (this.resizable) {
        //     this.documentResizeListener = this.renderer.listenGlobal('body', 'mousemove', (event: Event) => {
        //         this.onResize(event);
        //     });

        //     this.documentResizeEndListener = this.renderer.listenGlobal('body', 'mouseup', (event: Event) => {
        //         if (this.resizing) {
        //             if (this.delCustomStyleFn) {
        //                 this.delCustomStyleFn();
        //                 this.delCustomStyleFn = null;
        //             }
        //             this.resizing = false;
        //         }
        //         // if (this.documentDragListener) {
        //         //     this.documentDragListener();
        //         // }

        //         // if (this.documentResizeListener) {
        //         //     this.documentResizeListener();
        //         // }
        //     });
        // }

        if (this.responsive) {
            this.documentResponsiveListener = this.renderer.listenGlobal('window', 'resize', (event: Event) => {
                this.center();
            });
        }

        if (this.closeOnEscape && this.closable) {
            this.documentEscapeListener = this.renderer.listenGlobal('body', 'keydown', (event: any) => {
                if (event.which == 27) {
                    if (parseInt(this.container.style.zIndex) == DomHandler.zindex) {
                        this.hide(event);
                    }
                }
            });
        }

        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                this.domHandler.appendChild(this.container, this.appendTo);
        }

        if (!!!this.componentRef && (!!!this.formModel || this.formModel && !!!this.formModel.componentRef) && this.append) {
            this.appendParent = this.append.parentNode;
            this.domHandler.appendChild(this.append, this.contentContainer);
        }
    }

    ngAfterViewChecked() {
        if (this.resizing || this.dragging) return;
        if (this.shown) {
            this.show();
            this.onAfterShow.emit({});
            this.shown = false;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log(changes);
    }
    setupElPosStyles() {
        let styleHtml = ` 
        .dialog-position-custom {
          ${this.posCss}
        }`;
        return styleUntils.setElementStyle(this.container, styleHtml);
    }
    center() {
        let elementWidth = this.domHandler.getOuterWidth(this.container);
        let elementHeight = this.domHandler.getOuterHeight(this.container);
        if (elementWidth == 0 && elementHeight == 0) {
            this.container.style.visibility = 'hidden';
            this.container.style.display = 'block';
            elementWidth = this.domHandler.getOuterWidth(this.container);
            elementHeight = this.domHandler.getOuterHeight(this.container);
            this.container.style.display = 'none';
            this.container.style.visibility = 'visible';
        }
        let viewport = this.domHandler.getViewport();
        let x = (viewport.width - elementWidth) / 2;
        let y = (viewport.height - elementHeight) / 2;

        this.container.style.left = x + 'px';
        this.container.style.top = y + 'px';
    }

    enableModality() {
        if (!this.mask) {
            this.mask = document.createElement('div');
            this.mask.style.zIndex = String(parseInt(this.container.style.zIndex) - 1);
            this.domHandler.addMultipleClasses(this.mask, 'ui-widget-overlay ui-dialog-mask');
            if (!this.backdrop) {
                this.mask.style.opacity = '0';
            } else {
                this.mask.style.opacity = '0.5';
            }
            if (this.closable && this.dismissableMask) {
                this.maskClickListener = this.renderer.listen(this.mask, 'click', (event: any) => {
                    this.hide(event);
                });
            }

            document.body.appendChild(this.mask);
        }
    }

    disableModality() {
        if (this.mask) {
            document.body.removeChild(this.mask);
            this.mask = null;
        }
    }



    async closeBeforeCheck(event: any) {
        return await this.checkCloseBeforeFn(event);
    }
    @Input() formModel: IPageModel;
    async close(event: any) {
        let processState = await this.hide(event);
        this._modalResult.emit(null);
        return processState;
    }


    forceFn: Function = null;
    async forceClose(event: any) {
        this.forceFn = (event: any) => { event.cancel = true; }
        let processState = await this.hide(event);
        this._modalResult.emit(null);
        return processState;
    }

    async closeChild() {
        return new Promise(resolve => {
            if (this.formModel && this.formModel.childs) {
                Observable.from(this.formModel.childs).flatMap(form => {
                    if (form && form.modalRef) {
                        return Observable.fromPromise(form.modalRef.instance.forceClose(null));
                    } else {
                        return Observable.of(true);
                    }
                }).every((val: boolean) => val === true).subscribe((res: boolean) => {
                    resolve(res);
                });
            } else {
                resolve(true);
            }
        });

    }

    async hide(event: any) {
        if (event) event.preventDefault();
        let processStatus: boolean = false;
        if (event) {
            event.cancel = true;
            event.sender = this;
            this.onBeforeHide.emit(event);
        } else {
            event = { sender: this, cancel: true };
            this.onBeforeHide.emit(event);
        }
        let destroyFn = await this.closeBeforeCheck(event);
        if (isFunction(this.forceFn)) this.forceFn(event);
        if (event && event.cancel) {
            await this.closeChild();
            if (this.append) {
                this.append.visible = false;
            }
            this.visibleChange.emit(false);
            this.onAfterHide.emit(event);
            this.unbindMaskClickListener();
            this.modalResult.emit(this._selectResult);
            if (isFunction(this.closeAfterCallBackFn)) this.closeAfterCallBackFn();
            if (this.formModel && this.formModel.componentFactoryRef) {
                if (this.formModel.formType == FormTypeEnum.container)
                    this.formModel.globalManager &&
                        this.formModel.globalManager.taskManager &&
                        this.formModel.globalManager.taskManager.closeTaskGroup(() => this.formModel.key);
                else
                    this.formModel.componentFactoryRef.removePageModel(this.formModel);
            }

        }
        if (isFunction(destroyFn)) destroyFn();
        processStatus = true;
        this.forceFn = null;
        return processStatus;
    }

    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }

    moveOnTop() {
        this.container.style.zIndex = String(++DomHandler.zindex);
        this.container.style.cursor = 'default';
        if (this.formModel && this.formModel.componentFactoryRef)
            this.formModel.componentFactoryRef.setCurrentTreeNode(this.formModel);
    }

    setupElStyles() {
        let styleHtml = ` 
        body {
          -webkit-user-select:none;
          user-select:none;
        }`;
        return styleUntils.setElementStyle(document.body, styleHtml);
    }

    delCustomStyleFn: () => void;
    initDrag(event: any) {
        if (this.draggable) {

            this.documentDragListener = this.renderer.listenGlobal('body', 'mousemove', (event: Event) => {
                this.onDrag(event);
            });

            this.dragging = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
            this.delCustomStyleFn = this.setupElStyles();
        }
    }

    onDrag(event: any) {
        if (this.dragging) {
            let deltaX = event.pageX - this.lastPageX;
            let deltaY = event.pageY - this.lastPageY;
            let leftPos = parseInt(this.container.style.left);
            let topPos = parseInt(this.container.style.top);

            this.container.style.left = leftPos + deltaX + 'px';
            this.container.style.top = topPos + deltaY + 'px';

            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }

    endDrag(event: any) {
        if (this.draggable) {
            this.dragging = false;
            if (isFunction(this.delCustomStyleFn)) {
                this.delCustomStyleFn();
                this.delCustomStyleFn = null;
            }
            if (this.documentDragListener) {
                this.documentDragListener();
            }
        }
    }
    spEnum = SizingPointEnum;
    sizingPoint: SizingPointEnum = SizingPointEnum.none;
    initResize(event: any, selectPoint: SizingPointEnum) {
        if (this.resizable) {
            this.documentResizeListener = this.renderer.listenGlobal('body', 'mousemove', (event: Event) => {
                this.onResize(event);
            });

            this.documentResizeEndListener = this.renderer.listenGlobal('body', 'mouseup', (event: Event) => {
                if (this.resizing) {
                    if (this.delCustomStyleFn) {
                        this.delCustomStyleFn();
                        this.delCustomStyleFn = null;
                    }
                    this.resizing = false;
                }
                if (this.documentResizeListener && this.documentResizeEndListener) {
                    this.documentResizeListener();
                    this.documentResizeEndListener();
                }

            });

            if (!this.delCustomStyleFn) {
                this.delCustomStyleFn = this.setupElStyles();
            }
            this.resizing = true;
            this.sizingPoint = selectPoint;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }

    onResize(event: any) {
        if (this.resizing) {
            let wdir = 0, hdir = 0, xdir = 0, ydir = 0, deltaX = 0, deltaY = 0;
            deltaX = event.pageX - this.lastPageX;
            deltaY = event.pageY - this.lastPageY;
            switch (this.sizingPoint) {
                case SizingPointEnum.topCenter:
                    ydir += deltaY;
                    hdir -= deltaY;
                    break;
                case SizingPointEnum.rightTop:
                    wdir += deltaX;
                    ydir += deltaY;
                    hdir -= deltaY;
                    break;
                case SizingPointEnum.rightCenter:
                    wdir += deltaX;
                    break;
                case SizingPointEnum.rightBottom:
                    wdir += deltaX;
                    hdir += deltaY;
                    break;
                case SizingPointEnum.bottomCenter:
                    hdir += deltaY;
                    break;
                case SizingPointEnum.leftBottom:
                    xdir += deltaX;
                    wdir -= deltaX;
                    hdir += deltaY;
                    break;
                case SizingPointEnum.leftCenter:
                    xdir += deltaX;
                    wdir -= deltaX;
                    break;
                case SizingPointEnum.leftTop:
                    xdir += deltaX;
                    wdir -= deltaX;
                    ydir += deltaY;
                    hdir -= deltaY;
                    break;
                default:
                    break;
            }
            let containerWidth = this.domHandler.getOuterWidth(this.container);
            let containerHeight = this.domHandler.getOuterHeight(this.container);
            let contentHeight = this.domHandler.getOuterHeight(this.contentContainer);
            let newWidth = containerWidth + wdir;
            let newHeight = contentHeight + hdir;
            let leftPos = parseInt(this.container.style.left);
            let topPos = parseInt(this.container.style.top);

            if (newWidth > this.minWidth) {
                this.container.style.width = newWidth + 'px';
                this.container.style.left = leftPos + xdir + 'px';
            }

            if (newHeight > this.minHeight) {
                this.contentContainer.style.height = newHeight + 'px';
                this.container.style.height = containerHeight + hdir + 'px';
                this.container.style.top = topPos + ydir + 'px';
            }
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }

    mwState = FormStateEnum;
    modalWindowState: FormStateEnum = FormStateEnum.Normal;
    oldModalWindowState: FormStateEnum;
    minmizeBeforeRect = { left: '0', top: "0", width: "300", height: "300" };
    minimize(event: any) {
        if (event) event.preventDefault();
        // if (this.modalWindowState === ModalWindowState.Minimized) {
        //     this.modalWindowState = this.oldModalWindowState;
        //     this.container.style.width = this.minmizeBeforeRect.width;
        //     this.container.style.left = this.minmizeBeforeRect.left;
        //     this.container.style.height = this.minmizeBeforeRect.height;
        //     this.container.style.top = this.minmizeBeforeRect.top;
        //     this.contentContainer.style.height = this.minmizeBeforeRect.height;
        //     return;
        // }
        this.oldModalWindowState = this.modalWindowState;
        this.minmizeBeforeRect = this.domHandler.getRect(this.container);
        this.modalWindowState = FormStateEnum.Minimized;
        this.visibleChange.emit(false);
        this.visible = false;
        // if (this.formModel && this.formModel.parent && this.formModel.parent.componentFactoryRef) {
        //     // if (this.formModel.parent.componentRef.current === this.formModel) {
        //     this.formModel.parent.componentFactoryRef.selectNextVisibleForm(this.formModel);
        //     //}
        // }
        if (this.formModel && this.formModel.componentFactoryRef) {
            // if (this.formModel.parent.componentRef.current === this.formModel) {
            this.formModel.componentFactoryRef.selectNextVisiblePage(this.formModel);
            //}
        }
    }

    setSize(sizeRect: ClientRect) {
        this.container.style.width = sizeRect.width.toString() + 'px';
        this.container.style.left = sizeRect.left.toString() + 'px';
        this.container.style.height = sizeRect.height.toString() + 'px';
        this.container.style.top = sizeRect.top.toString() + 'px';
    }
    restore(event: any) {
        if (event) event.preventDefault();
        if (this.modalWindowState === FormStateEnum.Minimized) {
            this.modalWindowState = this.oldModalWindowState;
            // this.container.style.width = this.minmizeBeforeRect.width;
            // this.container.style.left = this.minmizeBeforeRect.left;
            // this.container.style.height = this.minmizeBeforeRect.height;
            // this.container.style.top = this.minmizeBeforeRect.top;
            // this.contentContainer.style.height = this.minmizeBeforeRect.height;
            return;
        }
    }
    maximize(event: any) {
        if (event) event.preventDefault();
        if (!this.resizable) return;
        if (this.modalWindowState === FormStateEnum.Maximized) {
            this.normal(event);
            return;
        };
        this.modalWindowState = FormStateEnum.Maximized;
        this.oldRect = this.container.getBoundingClientRect(); //this.domHandler.getRect(this.container);
        let containerWidth = this.domHandler.getOuterWidth(this.container);
        let containerHeight = this.domHandler.getOuterHeight(this.container);
        let viewPortSize = this.domHandler.getViewport();
        let leftPos = parseInt('0');
        let topPos = parseInt('0');

        this.container.style.width = viewPortSize.width + 'px';
        this.container.style.left = leftPos + 'px';

        this.contentContainer.style.height = viewPortSize.height + 'px';
        this.container.style.height = viewPortSize.height + 'px';
        this.container.style.top = topPos + 'px';

    }
    oldRect: ClientRect; //= { left: 0, top: 0, width: 300, height: 300 };
    normal(event: any) {
        if (event) event.preventDefault();
        if (this.modalWindowState === FormStateEnum.Normal) {
            this.maximize(event);
            return;
        }
        this.setSize(this.oldRect);
        // this.container.style.width = this.oldRect.width.toString() + 'px';
        // this.container.style.left = this.oldRect.left.toString() + 'px';
        // this.container.style.height = this.oldRect.height.toString() + 'px';
        // this.container.style.top = this.oldRect.top.toString() + 'px';

        this.contentContainer.style.height = this.oldRect.height.toString() + 'px';

        this.modalWindowState = FormStateEnum.Normal;
    }


    isFullScreen: boolean = false;
    fullScreen(event: any) {
        if (event) event.preventDefault();
        if (this.isFullScreen) {
            this.domHandler.exitFullScreen();
        } else {
            this.domHandler.launchFullScreen(document.documentElement);
        }
        this.isFullScreen = !this.isFullScreen;
    }

    ngOnDestroy() {
        this.disableModality();

        if (this.documentDragListener) {
            this.documentDragListener();
        }

        if (this.documentResizeListener) {
            this.documentResizeListener();

        }
        if (this.documentResizeEndListener) {

            this.documentResizeEndListener();
        }
        if (this.documentResizeListener && this.documentResizeEndListener) {
            this.documentResizeListener();
            this.documentResizeEndListener();
        }

        if (this.documentResponsiveListener) {
            this.documentResponsiveListener();
        }

        if (this.documentEscapeListener) {
            this.documentEscapeListener();
        }

        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }

        if (this.append) {
            if (this.appendParent) {
                this.appendParent.appendChild(this.append);
            }
            this.append.visible = true;
        }
        this.unbindMaskClickListener();

        // this._modalResult.unsubscribe();

    }

    // dragstart(event: DragEvent) {
    //     if (this.draggable) {
    //         this.dragging = true;
    //         this.lastPageX = event.pageX;
    //         this.lastPageY = event.pageY;
    //         this.delCustomStyleFn = this.setupElStyles();
    //         event.dataTransfer.setData("Text", "event.target");
    //     }
    // }

    // dragover(event: DragEvent) {
    //     event.preventDefault();
    // }

    // drag(event: DragEvent) {
    //     if (this.dragging) {
    //         event.preventDefault();
    //         let data = event.dataTransfer.getData("Text");
    //         let deltaX = event.pageX - this.lastPageX;
    //         let deltaY = event.pageY - this.lastPageY;
    //         let leftPos = parseInt(this.container.style.left);
    //         let topPos = parseInt(this.container.style.top);

    //         this.container.style.left = leftPos + deltaX + 'px';
    //         this.container.style.top = topPos + deltaY + 'px';

    //         this.lastPageX = event.pageX;
    //         this.lastPageY = event.pageY;
    //         this.dragging = false;
    //         this.delCustomStyleFn();
    //     }
    // }

}
