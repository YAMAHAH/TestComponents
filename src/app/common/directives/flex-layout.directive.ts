import { Directive, Input, ElementRef, OnChanges, Renderer2, SimpleChanges, SimpleChange, OnInit, OnDestroy } from '@angular/core';
import { NgStyleType } from '../../untils/style-transforms';
import { FlexDirection, FlexWrap, FlexJustifyContent, FlexAlignItems, FlexLayoutItem } from '../../Models/flex-layout-item';
import { Subscription } from 'rxjs/Subscription';
import { MediaMonitor } from '../../services/mediaquery/media-monitor';
import { AppStoreService } from '../../services/app.store.service';

type EventArgs = { target: any, propertyKey?: PropertyKey, currentValue?: any, oldValue?: any };

@Directive({
    selector: '[fxLayout],fxLayout'
})
export class FlexLayoutDirective implements OnChanges, OnInit, OnDestroy {
    ngOnDestroy(): void {
        this.mediaMonitorSubscribtion.unsubscribe();
    }
    private mediaMonitorSubscribtion: Subscription;
    activeMedials: string[] = [];
    ngOnInit(): void {
        this.mediaMonitorSubscribtion = this.mediaMonitor.observe()
            .filter(c => c.matches)
            .distinctUntilChanged()
            .subscribe(c => {
                this.activeMedials = this.globalService
                    .activeBreakPoints.map(bp => bp.alias) || [];
                this._updateWithValue();
            });
    }
    private changeKeys: string[] = [
        'direction', 'wrap', 'justifyContent', 'alignItems', 'alignContent',
        'gridColumns', 'gutter'
    ];
    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                let name: string;
                let value: SimpleChange = changes[key];
                if (this.changeKeys.contains(key)) {
                    let eventArgs: EventArgs = {
                        target: this,
                        propertyKey: key,
                        currentValue: value.currentValue,
                        oldValue: value.previousValue
                    };
                    this._updateWithValue(eventArgs);
                }
            }
        }
    }
    constructor(private elementRef: ElementRef,
        private mediaMonitor: MediaMonitor,
        private globalService: AppStoreService,
        private renderer: Renderer2) {
        this.createHostProxy(this, null,
            () => {
                this._updateWithValue();
            });
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'flex');
    }
    private responsiveDataMap: Map<string, FlexLayoutItem> = new Map<string, FlexLayoutItem>();
    getMediaQueryData(actionFn: (item: FlexLayoutItem) => boolean, autoBreak: boolean = true) {
        for (let index = 0; index < this.activeMedials.length; index++) {
            let itemKey = this.activeMedials[index];
            let itemEntry = this.responsiveDataMap.get(itemKey);
            if (itemEntry && actionFn) {
                if (actionFn(itemEntry) && autoBreak) break;
            }
        }
    }
    private createTargetProxy(target: any,
        beforeAction?: (eventArgs?: EventArgs) => void,
        afterAction?: (eventArgs?: EventArgs) => void) {
        let handler = () => {
            let _self = this;
            let listenProps = [
                "wrap", "direction", "fill", "width", "justifyContent", "alignItems",
                "height", "gap", "style", "class", "alignContent", 'gutter', 'gridColumns'
            ];
            return {
                set: function (target: any, propertyKey: PropertyKey, value: any, receiver?: any) {
                    if (typeof propertyKey === 'string') {
                        let findIndex = listenProps.contains(propertyKey);
                        if (findIndex) {
                            let oldValue = target[propertyKey];
                            let eArgs = { target, propertyKey, currentValue: value, oldValue };
                            if (oldValue != value) {
                                if (beforeAction) beforeAction(eArgs);
                                let res = Reflect.set(target, propertyKey, value, receiver);
                                console.log(`绑定对象属性值变化: key: ${propertyKey} value: ${JSON.stringify(value)} `);
                                if (afterAction) afterAction(eArgs);
                                return res;
                            }
                        } else {
                            return Reflect.set(target, propertyKey, value, receiver);
                        }
                    } else {
                        return Reflect.set(target, propertyKey, value, receiver);
                    }
                }
            };
        };
        let proxy = new Proxy(Object.getPrototypeOf(target), handler());
        Object.setPrototypeOf(target, proxy);
        return proxy;
    }
    private createHostProxy(target: any,
        beforeAction?: (eventArgs?: EventArgs) => void,
        afterAction?: (eventArgs?: EventArgs) => void) {
        let handler = () => {
            let listenProps = [
                "xs", 'gtxs',
                'ltsm', "sm", 'gtsm',
                'ltmd', "md", 'gtmd',
                'ltlg', "lg", 'gtlg',
                'ltxl', "xl"
            ];
            return {
                get: function (target: any, propertyKey: PropertyKey, receiver: any) {
                    return Reflect.get(target, propertyKey, receiver);
                },
                set: function (target: any, propertyKey: PropertyKey, value: any, receiver?: any) {
                    if (typeof propertyKey === 'string') {
                        let findIndex = listenProps.contains(propertyKey);
                        if (findIndex) {
                            let oldValue = target[propertyKey];
                            let eArgs = { target, propertyKey, currentValue: value, oldValue };
                            if (oldValue != value) {
                                if (beforeAction) beforeAction(eArgs);
                                let res = Reflect.set(target, propertyKey, value, receiver);
                                console.log(`绑定对象变化: key: ${propertyKey} value: ${JSON.stringify(value)} `);
                                if (afterAction) afterAction(eArgs);
                                return res;
                            }
                        }
                        else {
                            return Reflect.set(target, propertyKey, value, receiver);
                        }
                    } else {
                        return Reflect.set(target, propertyKey, value, receiver);
                    }
                }
            };
        };
        let proxy = new Proxy(Object.getPrototypeOf(target), handler());
        Object.setPrototypeOf(target, proxy);
        return proxy;
    }
    mediaItemSetterHandler(key: string, newValue: FlexLayoutItem) {
        if (newValue) {
            let srcObj = newValue['data'] || newValue;
            if (!this.responsiveDataMap.has(key))
                this.responsiveDataMap.set(key, new FlexLayoutItem());
            let oldValue = this.responsiveDataMap.get(key);
            Object.assign(oldValue, srcObj);
            if (!(srcObj instanceof FlexLayoutItem))
                Object.setPrototypeOf(srcObj, Object.getPrototypeOf(oldValue));

            this.createTargetProxy(srcObj,
                (e) => {
                    oldValue[e.propertyKey] = e.currentValue;
                }, (e) => {
                    this._updateWithValue(e);
                });
        }
    }

    fxLayoutDirectionProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'direction' || !!!event) {
            let name = 'flex-direction';
            let currValue = this.direction;
            this.getMediaQueryData(item => {
                if (item.direction) {
                    currValue = item.direction;
                    return true;
                }
            });
            let srcStyleValue = this.targetEl.style.flexDirection;
            if (this.hasDefaultOrEqual(srcStyleValue, currValue, 'row')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
        }
    }
    fxLayoutWrapProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'wrap' || !!!event) {
            let name = 'flex-wrap';
            let currValue = this.wrap;
            this.getMediaQueryData(item => {
                if (item.wrap) {
                    currValue = item.wrap;
                    return true;
                }
            });
            let srcStyleValue = this.targetEl.style.flexWrap;
            if (this.hasDefaultOrEqual(srcStyleValue, currValue, 'nowrap')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
        }
    }
    fxLayoutJustifyContentProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'justifyContent' || !!!event) {
            let name = 'justify-content';
            let currValue = this.justifyContent;
            this.getMediaQueryData(item => {
                if (item.justifyContent) {
                    currValue = item.justifyContent;
                    return true;
                }
            });
            let srcStyle = this.targetEl.style.justifyContent;
            if (this.hasDefaultOrEqual(srcStyle, currValue, 'flex-start')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
        }
    }
    fxLayoutFlowProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'flow' || !!!event) {
            let name = 'flex-flow';
            let currValue = this.flow;
            this.getMediaQueryData(item => {
                if (item.flow) {
                    currValue = item.flow;
                    return true;
                }
            });
            let srcStyleValue = this.targetEl.style.flexFlow;
            if (this.hasDefaultOrEqual(srcStyleValue, currValue, 'row nowrap')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
        }
    }
    fxLayoutAlignItemsProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'alignItems' || !!!event) {
            let name = 'align-items';
            let currValue = this.alignItems;
            this.getMediaQueryData(item => {
                if (item.alignItems) {
                    currValue = item.alignItems;
                    return true;
                }
            });
            let srcStyleValue = this.targetEl.style.alignItems;
            if (this.hasDefaultOrEqual(srcStyleValue, currValue, 'stretch')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
        }
    }
    private hasDefaultOrEqual(srcValue: any, currValue: any, defaultValue: any) {
        if (srcValue === '' && (currValue && currValue.trim() === defaultValue || currValue == undefined || currValue == null || currValue == '')) return true;
        if (srcValue === currValue) return true;
        return false;
    }
    fxLayoutAlignContentProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'alignContent' || !!!event) {
            let name = 'align-content';
            let currValue = this.alignContent;
            this.getMediaQueryData(item => {
                if (item.alignContent) {
                    currValue = item.alignContent;
                    return true;
                }
            });
            let srcValue = this.targetEl.style.alignContent;
            if (this.hasDefaultOrEqual(srcValue, currValue, 'stretch')) return;
            this.renderer.setStyle(this.targetEl, name, currValue);
        }
    }
    getCurrentDirection() {
        let currDir = this.direction;
        this.getMediaQueryData(item => {
            if (item.direction) {
                currDir = item.direction;
                return true;
            }
        });
        return currDir;
    }
    fxLayoutGutterProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'gutter' || !!!event) {
            let currGutter = this.getItemGutter(event);
            let currDir = this.getCurrentDirection();
            if (['row', 'row-reverse'].contains(currDir)) {
                this.renderer.setStyle(this.targetEl, 'margin-left', `-${currGutter / 2}px`);
                this.renderer.setStyle(this.targetEl, 'margin-right', `-${currGutter / 2}px`);
            } else if (['column', 'column-reverse'].contains(currDir)) {
                this.renderer.setStyle(this.targetEl, 'margin-top', `-${currGutter / 2}px`);
                this.renderer.setStyle(this.targetEl, 'margin-bottom', `-${currGutter / 2}px`);
            }
        }
    }

    _updateWithValue(event?: EventArgs) {
        this.fxLayoutDirectionProcess(event);
        this.fxLayoutWrapProcess(event);
        this.fxLayoutFlowProcess(event);
        this.fxLayoutJustifyContentProcess(event);
        this.fxLayoutAlignItemsProcess(event);
        this.fxLayoutAlignContentProcess(event);
        this.fxLayoutGutterProcess(event);
        this.getItemGap(event);
        this.getItemFill(event);
        this.getItemWidth(event);
        this.getItemHeight(event);
        this.getItemGridColumns(event);
    }
    private getItemGutter(event?: EventArgs) {
        if (event && event.propertyKey === 'gutter' || !!!event) {
            let currGutter = this.gutter;
            this.getMediaQueryData(item => {
                if (item.gutter) {
                    currGutter = item.gutter;
                    return true;
                }
            });
            this._itemGutter = currGutter;
            return currGutter;
        }
    }
    private getItemGap(event?: EventArgs) {
        if (event && event.propertyKey === 'gap' || !!!event) {
            let currGap = this.gap;
            this.getMediaQueryData(item => {
                if (item.gap) {
                    currGap = item.gap;
                    return true;
                }
            });
            this._itemGap = currGap;
            return currGap;
        }
    }
    private getItemWidth(event?: EventArgs) {
        if (event && event.propertyKey === 'width' || !!!event) {
            let currWidth = this.width;
            this.getMediaQueryData(item => {
                if (item.width) {
                    currWidth = item.width;
                    return true;
                }
            });
            this._itemWidth = currWidth;
            return currWidth;
        }
    }
    private getItemHeight(event?: EventArgs) {
        if (event && event.propertyKey === 'height' || !!!event) {
            let currHeight = this.height;
            this.getMediaQueryData(item => {
                if (item.height) {
                    currHeight = item.height;
                    return true;
                }
            });
            this._itemHeight = currHeight;
            return currHeight;
        }
    }
    private getItemFill(event?: EventArgs) {
        if (event && event.propertyKey === 'fill' || !!!event) {
            let currFill = this.fill;
            this.getMediaQueryData(item => {
                if (item.fill) {
                    currFill = item.fill;
                    return true;
                }
            });
            this._itemFill = currFill;
            return currFill;
        }
    }
    private getItemGridColumns(event?: EventArgs) {
        if (event && event.propertyKey === 'gridColumns' || !!!event) {
            let currGridcols = this.gridColumns;
            this.getMediaQueryData(item => {
                if (item.gridColumns) {
                    currGridcols = item.gridColumns;
                    return true;
                }
            });
            this._itemGridColumns = currGridcols;
            return currGridcols;
        }
    }
    private get targetEl() {
        return this.elementRef && this.elementRef.nativeElement;
    }
    private _flexDirection: FlexDirection;
    @Input('fxLayout')
    get direction(): FlexDirection {
        return this._flexDirection || 'row';
    };
    set direction(value: FlexDirection) {
        this._flexDirection = value;
    }
    private _itemGutter: number;
    get itemGutter() {
        return this._itemGutter;
    }
    private _itemGap: number;
    get itemGap() {
        return this._itemGap;
    }
    private _itemFill: boolean;
    get itemFill() {
        return this._itemFill;
    }
    private _itemWidth: string;
    get itemWidth() {
        return this._itemWidth;
    }
    private _itemHeight: string;
    get itemHeight() {
        return this._itemHeight;
    }
    private _itemGridColumns: number;
    get itemGridColumns() {
        return this._itemGridColumns;
    }
    @Input('fxFlow') flow: string;
    @Input('fxWrap') wrap: FlexWrap = 'nowrap';

    @Input('fxAlignMain') justifyContent: FlexJustifyContent = 'flex-start';

    @Input('fxAlignCross') alignItems: FlexAlignItems = 'stretch';

    @Input('fxAlignContent') alignContent: FlexAlignItems = 'stretch';
    @Input() gridColumns: number = 24;

    @Input('fxGutter') gutter: number;

    setStyle() {
        if (this.direction === 'row' || this.direction === 'row-reverse') {
            this.renderer.setStyle(this.elementRef.nativeElement, 'margin-left', `-${this.gutter / 2}px`);
            this.renderer.setStyle(this.elementRef.nativeElement, 'margin-right', `-${this.gutter / 2}px`);
        } else if (this.direction === 'column' || this.direction === 'column-reverse') {
            this.renderer.setStyle(this.elementRef.nativeElement, 'margin-top', `-${this.gutter / 2}px`);
            this.renderer.setStyle(this.elementRef.nativeElement, 'margin-bottom', `-${this.gutter / 2}px`);
        }
    }
    @Input('fxGap') gap: number = 0;
    private _fill: boolean = false;
    @Input('fxFill')
    get fill(): boolean {
        return this._fill;
    }
    set fill(value: boolean) {
        this._fill = (value === null || value === undefined || value || '' + value === '') ? true : value;
    }
    @Input('fxWidth') width: string;
    @Input('fxHeight') height: string;
    @Input('fxClass') class: string | string[] | object;
    @Input('fxStyle') style: NgStyleType = '';
    private _forceFlex: boolean = false;
    @Input()
    get fxForceFlex(): boolean {
        return this._forceFlex;
    }
    set fxForceFlex(value: boolean) {
        this._forceFlex = (value === null || value === undefined || value || '' + value === '') ? true : value;
    }

    @Input('fxLayout.xs')
    get xs(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('xs');
        else return null;
    }
    set xs(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('xs', value);
    }
    @Input('fxLayout.gt-xs')
    get gtxs(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-xs');
        else return null;
    }
    set gtxs(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('gt-xs', value);
    }
    @Input('fxLayout.lt-sm')
    get ltsm(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-sm');
        else return null;
    }
    set ltsm(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('lt-sm', value);
    }

    @Input('fxLayout.sm')
    get sm(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('sm');
        else return null;
    }
    set sm(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('sm', value);
    }

    @Input('fxLayout.gt-sm')
    get gtsm(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-sm');
        else return null;
    }
    set gtsm(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('gt-sm', value);
    }

    @Input('fxLayout.lt-md')
    get ltmd(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-md');
        else return null;
    }
    set ltmd(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('lt-md', value);
    }
    @Input('fxLayout.md')
    get md(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('md');
        else return null;
    }
    set md(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('md', value);
    }
    @Input('fxLayout.gt-md')
    get gtmd(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-md');
        else return null;
    }
    set gtmd(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('gt-md', value);
    }
    @Input('fxLayout.lt-lg')
    get ltlg(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-lg');
        else return null;
    }
    set ltlg(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('lt-lg', value);
    }
    @Input('fxLayout.lg')
    get lg(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lg');
        else return null;
    }
    set lg(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('lg', value);
    }
    @Input('fxLayout.gt-lg')
    get gtlg(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-lg');
        else return null;
    }
    set gtlg(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('gt-lg', value);
    }
    @Input('fxLayout.lt-xl')
    get ltxl(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-xl');
        else return null;
    }
    set ltxl(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('ltxl', value);
    }
    @Input('fxLayout.xl')
    get xl(): FlexLayoutItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('xl');
        else return null;
    }
    set xl(value: FlexLayoutItem) {
        this.mediaItemSetterHandler('xl', value);
    }
}