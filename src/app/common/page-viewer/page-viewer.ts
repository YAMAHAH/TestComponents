import { Component, Input, ElementRef, ViewChild, ComponentRef, Type, EventEmitter, AfterViewInit, OnDestroy, Renderer2, Output, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { IPageModel } from '../../basic/IFormModel';
import { PageTypeEnum } from '../../basic/PageTypeEnum';
import { styleUntils } from '../../untils/style';

// '[style.display]': 'flex',
// '[style.flex]': "'1 0 auto'" 
@Component({
    moduleId: module.id,
    host: {
        '[class.el-hide]': '!visible',
        '[class.el-flex-show]': 'visible',
        '[class.flex-column-container-item]': 'true'
    },
    selector: 'x-page-viewer',
    templateUrl: 'page-viewer.html',
    styleUrls: ['page-viewer.css']
})
export class PageViewer implements AfterViewInit, AfterViewChecked, OnChanges, OnDestroy {
    @Input() pageModel: IPageModel;

    @Input() contentHeight: any;

    @Input() isForceAppend: boolean;
    @Input() append: any;
    @Input() appendTo: ElementRef | string;
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


    get enablePredicate() {
        return (value: any, index: number) => !!!this.isForceAppend;
    }

    shown: boolean;
    _visible: boolean;
    @Input() get visible(): boolean {
        return this._visible && this.pageModel && this.pageModel.active || this._visible && !!this.pageModel;
    }

    set visible(val: boolean) {
        this._visible = val;
        if (this._visible) {
            this.onBeforeShow.emit({});
            this.shown = true;
        }
    }

    constructor(private elementRef: ElementRef,
        protected renderer: Renderer2) { }
    ngAfterViewInit() {
        //设置host样式
        // this.setHostElementStyle();
        this._modalResult.subscribe((result: any) => {
            this._selectResult = result;
            if (result) this.hide(null);
        });
        if (!!!this.componentRef && (!!!this.pageModel || this.pageModel && !!!this.pageModel.componentRef) && this.append || this.isForceAppend && this.append) {
            console.log(this.pageModel.componentRef);
            this.appendParentNode = this.append.parentNode;
            this.renderer.appendChild(this.contentElementRef.nativeElement, this.append);
        }
        if (this.appendTo) {
            if (typeof (this.appendTo) === 'string') {
                if (this.appendTo === 'body')
                    document.body.appendChild(this.elementRef.nativeElement);
                else
                    this.renderer.appendChild(this.appendTo, this.elementRef.nativeElement);
            } else
                this.renderer.appendChild(this.appendTo.nativeElement, this.elementRef.nativeElement);
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

    styleClearFn: any;
    setHostElementStyle() {
        let elStyle = ` 
        x-page-viewer {
            display:flex;
            flex:1;
            flex-direction: column;
            width:100%
        }
        `;
        this.styleClearFn = styleUntils.setElementStyle(this.elementRef.nativeElement, elStyle);
    }

    close() {
        let a = [
            { sheng: "32", shi: "321", qu: "3211" },
            { sheng: "32", shi: "3212", qu: "3212" },
            { sheng: "33", shi: "331", qu: "3311" },
            { sheng: "33", shi: "332", qu: "3312" }
        ];
        let treeMaps = new Map<string, ITreeNode>();
        let allCities: ITreeNode[] = [];
        let sheng, shi, qu;
        a.forEach(v => {
            sheng = treeMaps.get(v.sheng);
            if (!treeMaps.has(v.sheng)) {
                sheng = new ITreeNode(v.sheng, v.sheng, 0);
                treeMaps[sheng.id] = sheng;
                allCities.push(sheng);
            }
            shi = treeMaps.get(v.shi);
            if (!treeMaps.has(v.sheng)) {
                shi = new ITreeNode(v.shi, v.shi, 1);
                treeMaps[shi.id] = shi;
                sheng.childrens.push(shi);
            }
            qu = treeMaps.get(v.qu);
            if (!treeMaps.has(v.qu)) {
                qu = new ITreeNode(v.qu, v.qu, 2);
                treeMaps[qu.id] = qu;
                shi.childrens.push(qu);
            }
        });
        return allCities;
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
            this.append.visible = false;
        }
        if (this.pageModel && this.pageModel.componentFactoryRef) {
            if (this.pageModel.formType == PageTypeEnum.container)
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
                this.appendParentNode.appendChild(this.append);
            }
            this.append.visible = true;
        }
        if (this.appendTo) {
            if (typeof (this.appendTo) === 'string') {
                if (this.appendTo === 'body')
                    document.body.removeChild(this.elementRef.nativeElement);
                else
                    this.renderer.removeChild(this.appendTo, this.elementRef.nativeElement);
            } else
                this.renderer.removeChild(this.appendTo.nativeElement, this.elementRef.nativeElement);
        }
    }
    /**
     * 恢复引用父结点的内容,并隐藏本页的隐藏
     */
    restoreParentContent() {
        if (this.append) {
            if (this.appendParentNode) {
                this.appendParentNode.appendChild(this.append);
            }
            this.append.visible = true;
        }
        this.visible = false;
    }
    /**
     * 销毁函数,自动生成
     */
    dispose: () => void;
}
export class ITreeNode {
    constructor(public id: string, public name: string, public level: number) {

    }
    childrens: ITreeNode[] = [];
}