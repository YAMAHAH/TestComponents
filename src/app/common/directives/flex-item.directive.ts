import {
    Directive, Input, ElementRef, OnChanges, Renderer2, SimpleChanges,
    SimpleChange, HostBinding, Optional, Host, SkipSelf, ViewContainerRef, SecurityContext,
} from '@angular/core';
import { FlexLayoutDirective } from './flex-layout.directive';
import { NgStyleType, NgStyleSanitizer, NgStyleRawList, ngStyleUtils, NgStyleMap } from '../../untils/style-transforms';
import { DomSanitizer } from '@angular/platform-browser';
import { DomHandler } from "../dom/domhandler";
import { OnInit, KeyValueDiffers, DoCheck, OnDestroy, style } from '@angular/core';
import { FlexItem } from '../../Models/flex-item';
import { FxStyle } from './fxstyle';
import { MediaMonitor } from '../../services/mediaquery/media-monitor';
import { AppStoreService } from '../../services/app.store.service';
import { Subscription } from 'rxjs/Subscription';

type FlexItemAlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

type EventArgs = { target: any, propertyKey?: PropertyKey, currentValue?: any, oldValue?: any };

@Directive({
    selector: '[fxItem]'
})
export class FlexItemDirective implements OnChanges, OnInit, DoCheck, OnDestroy {

    private responsiveDataMap: Map<string, FlexItem>;
    ngOnDestroy(): void {
        this._fxStyleInstance = null;
        this.mediaMonitorSubscribtion.unsubscribe();
    }
    private _fxStyleInstance: FxStyle;
    ngDoCheck(): void {
        this._fxStyleInstance.ngDoCheck();
    }
    private mediaMonitorSubscribtion: Subscription;
    ngOnInit(): void {

        this.mediaMonitorSubscribtion = this.mediaMonitor.observe()
            .filter(c => c.matches)
            .distinctUntilChanged()
            .subscribe(c => {
                this._updateWithValue();
            });
    }

    @Input('fxItemOrder') order: number = 0;
    @Input('fxItemGrow') flexGrow: string = '0';
    @Input('fxItemShrink') flexShrink: string = '1';
    @Input('fxItemBasis') flexBasis: string = "auto";
    // 绝对Flex项目的宽度只基于flex属性(0)时会自动分配剩余空间)，而相对Flex项目的宽度基于内容大小(auto)
    @Input('fxItemAlign') alignSelf: FlexItemAlignSelf;
    @Input('fxItem') flex: string = '0 1 auto'; // auto:1 1 auto none: 0 0 auto; 1 0 0
    /**
     * 主轴跨距
     */
    @Input('fxItemSpan') span: number = 0;
    /**
     * 主轴偏移
     */
    @Input('fxItemOffset') offset: number;

    @HostBinding('style.padding-left.px')
    get paddingLeft() {
        if (this._flexContainer && (this._flexContainer.direction === 'row' || this._flexContainer.direction === 'row-reverse'))
            return this._flexContainer && this._flexContainer.gutter / 2;
    }

    @HostBinding('style.padding-right.px')
    get paddingRight() {
        if (this._flexContainer && (this._flexContainer.direction === 'row' || this._flexContainer.direction === 'row-reverse'))
            return this._flexContainer && this._flexContainer.gutter / 2;

    }

    @HostBinding('style.padding-top.px')
    get paddingTop() {
        if (this._flexContainer && (this._flexContainer.direction === 'column' || this._flexContainer.direction === 'column-reverse'))
            return this._flexContainer && this._flexContainer.gutter / 2;
    }

    @HostBinding('style.padding-bottom.px')
    get paddingBottom() {
        if (this._flexContainer && (this._flexContainer.direction === 'column' || this._flexContainer.direction === 'column-reverse'))
            return this._flexContainer && this._flexContainer.gutter / 2;
    }

    @HostBinding('style.margin-left.px')
    get marginLeft() {
        if (this._flexContainer && (this._flexContainer.direction === 'column' || this._flexContainer.direction === 'column-reverse'))
            return this._flexContainer && this._flexContainer.gap;
    }

    @HostBinding('style.margin-right.px')
    get marginRight() {
        if (this._flexContainer && (this._flexContainer.direction === 'column' || this._flexContainer.direction === 'column-reverse'))
            return this._flexContainer && this._flexContainer.gap;
    }

    @HostBinding('style.margin-top.px')
    get marginTop() {
        if (this._flexContainer && (this._flexContainer.direction === 'row' || this._flexContainer.direction === 'row-reverse'))
            return this._flexContainer && this._flexContainer.gap;
    }

    @HostBinding('style.margin-bottom.px')
    get marginBottom() {
        if (this._flexContainer && (this._flexContainer.direction === 'row' || this._flexContainer.direction === 'row-reverse'))
            return this._flexContainer && this._flexContainer.gap;
    }

    @HostBinding('style.min-width')
    get minWidth() {
        if ((this.fill || this._flexContainer && this._flexContainer.fxFill) && this._flexContainer && (this._flexContainer.direction === 'column' || this._flexContainer.direction === 'column-reverse'))
            return '100%';
    }

    @HostBinding('style.min-height')
    get minHeight() {
        if ((this.fill || this._flexContainer && this._flexContainer.fxFill) && this._flexContainer && (this._flexContainer.direction === 'row' || this._flexContainer.direction === 'row-reverse'))
            return '100%';
    }
    @HostBinding('style.width')
    get fillWidth() {
        if ((this.fill || this._flexContainer && this._flexContainer.fxFill) && this._flexContainer && (this._flexContainer.direction === 'column' || this._flexContainer.direction === 'column-reverse'))
            return '100%';
        if ((this.fxItemWidth || this._flexContainer && this._flexContainer.fxHeight) && this.span <= 0)
            return this.fxItemWidth || this._flexContainer.fxWidth;
    }
    @HostBinding('style.height')
    get fillHeight() {
        if ((this.fill || this._flexContainer && this._flexContainer.fxFill) && this._flexContainer && (this._flexContainer.direction === 'row' || this._flexContainer.direction === 'row-reverse'))
            return '100%';
        if ((this.fxItemHeight || this._flexContainer && this._flexContainer.fxHeight) && this.span <= 0)
            return this.fxItemHeight || this._flexContainer.fxHeight;
    }

    // const FLEX_FILL_CSS = {
    //     'margin': 0,
    //     'width': '100%',
    //     'height': '100%',
    //     'min-width': '100%',
    //     'min-height': '100%'
    //   };1 0 0

    @Input('fxItem.xs') //>=480px
    get xs(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('xs');
        else return null;
    }
    set xs(value: FlexItem) {
        this.mediaItemSetterHandler('xs', value);
    }
    @Input('fxItem.gt-xs') //>=480px
    get gtxs(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-xs');
        else return null;
    }
    set gtxs(value: FlexItem) {
        this.mediaItemSetterHandler('gt-xs', value);
    }
    @Input('fxItem.lt-sm')
    get ltsm(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-sm');
        else return null;
    }
    set ltsm(value: FlexItem) {
        this.mediaItemSetterHandler('lt-sm', value);
    }

    @Input('fxItem.sm') //>=768px 
    get sm(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('sm');
        else return null;
    }
    set sm(value: FlexItem) {
        this.mediaItemSetterHandler('sm', value);
    }

    @Input('fxItem.gt-sm')
    get gtsm(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-sm');
        else return null;
    }
    set gtsm(value: FlexItem) {
        this.mediaItemSetterHandler('gt-sm', value);
    }

    mediaItemSetterHandler(key: string, newValue: FlexItem) {
        if (newValue) {
            let srcObj = newValue['data'] || newValue;
            if (!this.responsiveDataMap.has(key))
                this.responsiveDataMap.set(key, new FlexItem());
            let oldValue = this.responsiveDataMap.get(key);
            Object.assign(oldValue, srcObj);
            if (!(srcObj instanceof FlexItem))
                Object.setPrototypeOf(srcObj, Object.getPrototypeOf(oldValue));

            this.createTargetProxy(srcObj,
                (e) => {
                    oldValue[e.propertyKey] = e.currentValue;
                }, (e) => {
                    this._updateWithValue(e);
                });
        }
    }
    @Input('fxItem.lt-md') //>=992px;
    get ltmd(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-md');
        else return null;
    }
    set ltmd(value: FlexItem) {
        this.mediaItemSetterHandler('lt-md', value);
    }
    @Input('fxItem.md') //>=992px;
    get md(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('md');
        else return null;
    }
    set md(value: FlexItem) {
        this.mediaItemSetterHandler('md', value);
    }
    @Input('fxItem.gt-md') //>=992px;
    get gtmd(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-md');
        else return null;
    }
    set gtmd(value: FlexItem) {
        this.mediaItemSetterHandler('gt-md', value);
    }
    @Input('fxItem.lt-lg') // >=1200px
    get ltlg(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-lg');
        else return null;
    }
    set ltlg(value: FlexItem) {
        this.mediaItemSetterHandler('lt-lg', value);
    }
    @Input('fxItem.lg') // >=1200px
    get lg(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lg');
        else return null;
    }
    set lg(value: FlexItem) {
        this.mediaItemSetterHandler('lg', value);
    }
    @Input('fxItem.gt-lg') // >=1200px
    get gtlg(): FlexItem {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('gt-lg');
        else return null;
    }
    set gtlg(value: FlexItem) {
        this.mediaItemSetterHandler('gt-lg', value);
    }
    @Input('fxItem.lt-xl')
    get ltxl(): FlexItem //>=1600px
    {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('lt-xl');
        else return null;
    }
    set ltxl(value: FlexItem) {
        this.mediaItemSetterHandler('ltxl', value);
    }
    @Input('fxItem.xl')
    get xl(): FlexItem //>=1600px
    {
        if (this.responsiveDataMap)
            return this.responsiveDataMap.get('xl');
        else return null;
    }
    set xl(value: FlexItem) {
        this.mediaItemSetterHandler('xl', value);
    }


    private _fill: boolean = false;
    @Input('fxItemFill')
    get fill(): boolean {
        return this._fill;
    }
    set fill(value: boolean) {
        this._fill = (value === null || value === undefined || value || '' + value === '') ? true : value;
    }

    @Input() fxItemHeight: string;
    @Input() fxItemWidth: string;
    private _show: boolean = true;
    @Input('fxItemShow')
    get show(): boolean {
        return this._show;
    }
    set show(value: boolean) {
        this._show = (value === null || value === undefined || value || '' + value === '') ? true : value;
    }

    private _fxItemClass: string | string[] | object;
    @Input()
    get fxItemClass(): string | string[] | object {
        return this._fxItemClass;
    }

    set fxItemClass(value: string | string[] | object) {
        this._fxItemClass = value;
    }
    @Input() fxItemStyle: NgStyleType;

    private _isFlexContainer: boolean = false;
    constructor(private elementRef: ElementRef,
        protected _sanitizer: DomSanitizer,
        protected domHandler: DomHandler,
        private _differs: KeyValueDiffers,
        @Optional() @SkipSelf() private _flexContainer: FlexLayoutDirective,
        @Optional() @Host() private _hostFlexContainer: FlexLayoutDirective,
        private mediaMonitor: MediaMonitor,
        private globalService: AppStoreService,
        private renderer: Renderer2) {

        this.responsiveDataMap = new Map<string, FlexItem>();
        if (this._hostFlexContainer != this._flexContainer) {
            this._isFlexContainer = true;
        }
        this.createHostProxy(this, null,
            () => {
                // this._updateWithValue();
            });

        this._fxStyleInstance = new FxStyle(this._differs, this.elementRef, this.renderer);
    }
    private _fxItemDisplay: string = 'block';
    @Input()
    get fxItemDisplay(): string {
        return this._fxItemDisplay;
    }
    set fxItemDisplay(value: string) {
        this._fxItemDisplay = value || 'block';
    }

    private createTargetProxy(target: any,
        beforeAction?: (eventArgs?: EventArgs) => void,
        afterAction?: (eventArgs?: EventArgs) => void) {
        let handler = () => {
            let _self = this;
            let listenProps = [
                "order", "offset", "span", "width",
                "height", "show", "style", "class",
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
    private sizeKeys: string[] = [
        'flex', 'order', 'offset', 'fxItemClass', 'fxItemStyle', 'span',
        'show'
    ];
    ngOnChanges(changes: SimpleChanges) {

        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {

                let name: string, styleValue: any;
                let value: SimpleChange = changes[key];
                switch (key) {
                    case 'flexGrow':
                        name = 'flex-grow';
                        break;
                    case 'flexShrink':
                        name = 'flex-shrink';
                        break;
                    case 'flexBasis':
                        name = 'flex-basis';
                        break;
                    case 'alignSelf':
                        name = 'align-self';
                        break;
                    case 'flex':
                        name = 'flex';
                        break;
                    default:
                        break;
                }
                name && this.renderer.setStyle(this.elementRef.nativeElement, name, value.currentValue);

                if (this.sizeKeys.contains(key)) {
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

    _updateWithValue(event?: EventArgs) {
        this.activeMedials = this.globalService.activeBreakPoints.map(bp => bp.alias) || [];
        // 处理排序
        this.itemOrderProcess(event);
        //处理偏移
        this.itemOffsetProcess(event);
        //处理主轴大小
        this.itemFlexProcess(event);
        //处理显示
        this.itemShowHideProcess(event);
        //样式类处理
        this.itemClassProcess(event);
        //样式处理
        this.itemStyleProcess(event);
    }

    //ngOnChanges ngOnint ngDoCheck ngAfterContentInit ngAfterContentChecked ngAfterViewInit ngAfterViewChecked ngOnDestroy
    itemOrderProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'order' || !!!event) {
            let name = 'order';
            let currOrder: number = this.order;
            this.getMediaQueryData(item => {
                if (item.order) {
                    currOrder = item.order;
                    return true;
                }
            });

            this.renderer.setStyle(this.elementRef.nativeElement, name, currOrder);
        }

    }

    getMediaQueryData(actionFn: (item: FlexItem) => boolean, autoBreak: boolean = true) {
        for (let index = 0; index < this.activeMedials.length; index++) {
            let itemKey = this.activeMedials[index];
            let itemEntry = this.responsiveDataMap.get(itemKey);
            if (itemEntry && actionFn) {
                if (actionFn(itemEntry) && autoBreak) break;
            }
        }
    }

    itemOffsetProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'offset' || !!!event) {
            let name = '';
            if (this._flexContainer.direction === 'row')
                name = 'margin-left';
            else if (this._flexContainer.direction === 'row-reverse')
                name = 'margin-right';
            else if (this._flexContainer.direction === 'column')
                name = 'margin-top';
            else if (this._flexContainer.direction === 'column-reverse')
                name = 'margin-bottom';
            let currOffset: number = this.offset;

            this.getMediaQueryData(entry => {
                if (entry && entry.offset) {
                    currOffset = entry.offset;
                    return true;
                } else return false;
            });
            this.renderer.setStyle(this.elementRef.nativeElement, name, (currOffset / this._flexContainer.gridColumns) * 100 + '%');
        }
    }

    itemFlexProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'span' || !!!event) {
            let name = 'flex'; //span ->width ->auto 
            let currSpan: number = this.span;

            this.getMediaQueryData(entry => {
                if (entry && entry.span) {
                    currSpan = entry.span;
                    return true;
                }
            });
            if (currSpan > this._flexContainer.gridColumns) currSpan = this._flexContainer.gridColumns;
            if (currSpan > 0)
                this.renderer.setStyle(this.elementRef.nativeElement, name, '0  0 ' + (currSpan / this._flexContainer.gridColumns) * 100 + '%');
            else
                this.renderer.setStyle(this.elementRef.nativeElement, name, 'none');

            if (this._isFlexContainer && !this._hostFlexContainer.fxforceDispaly)
                this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'flex');
            else
                this.renderer.setStyle(this.elementRef.nativeElement, 'display', this.fxItemDisplay);

            this.renderer.setStyle(this.elementRef.nativeElement, 'position', 'relative');
        }
    }
    oldClass = "";
    getElementClass(currClass: string, classData: any) {
        if (classData)
            if (Array.isArray(classData))
                currClass = (classData.join(' ') + " " + currClass).trim();
            else if (typeof classData === 'string')
                currClass = (classData + " " + currClass).trim();
            else {
                let addClasses: string[] = [];
                for (let key in classData) {
                    if (classData.hasOwnProperty(key)) {
                        if (classData[key])
                            addClasses.push(key);
                        else this.delClasses.push(key);
                    }
                }
                currClass = (addClasses.join(' ') + ' ' + currClass).trim();
            }
        return currClass;
    }
    delClasses: string[] = [];
    activeMedials: string[] = [];
    itemClassProcess(event?: EventArgs) {
        if (event && ['fxItemClass', 'class'].contains(event.propertyKey as string) || !!!event) {
            let currClass = "";
            this.delClasses = [];
            let mediaList = this.activeMedials;
            for (let index = 0; index < mediaList.length; index++) {
                let mediaVal = mediaList[index];
                let entry = this.responsiveDataMap.get(mediaVal);
                if (entry && entry.class)
                    currClass = this.getElementClass(currClass, entry.class);
            }

            currClass = this.getElementClass(currClass, this.fxItemClass);

            currClass = this.getElementClass(currClass, this._flexContainer.fxClass);

            if (currClass && currClass.length > 0) {
                currClass = currClass.replace(/^ +| +$/g, ""); //.split(/ +/g);
                this.domHandler.addMultipleClasses(this.elementRef.nativeElement, currClass);
            }
            if (this.delClasses.length > 0) {
                for (var index = 0; index < this.delClasses.length; index++) {
                    this.renderer.removeClass(this.elementRef.nativeElement, this.delClasses[index]);
                }
                this.delClasses = [];
            }
        }
    }
    /**
     * [fxItemStyle] = "{color:$thider,'font-size':$font-size}"
     * [fxItemStyle] = "color:blue;'font-size':18px;"
     * 
     */
    itemStyleProcess(event?: EventArgs) {
        if (event && ['fxItemStyle', 'style'].contains(event.propertyKey as string) || !!!event) {
            let currStyle: NgStyleMap;
            let mediaList = this.activeMedials.reverse();
            for (let index = 0; index < mediaList.length; index++) {
                let mediaVal = mediaList[index];
                let entry = this.responsiveDataMap.get(mediaVal);
                if (entry && entry.style)
                    if (currStyle)
                        currStyle = Object.assign(currStyle, this._buildStyleMap(entry.style));
                    else
                        currStyle = this._buildStyleMap(entry.style);
            }
            if (this.fxItemStyle)
                currStyle = Object.assign(this._buildStyleMap(this.fxItemStyle), currStyle);

            if (this._flexContainer.fxStyle)
                currStyle = Object.assign(this._buildStyleMap(this._flexContainer.fxStyle), currStyle);

            this._fxStyleInstance.ngStyle = currStyle;
        }
    }
    private _setStyle(nameAndUnit: string, value: string | number | null | undefined): void {
        const [name, unit] = nameAndUnit.split('.');
        value = value != null && unit ? `${value}${unit}` : value;
        this.renderer.setStyle(this.elementRef.nativeElement, name, value as string);
    }
    itemShowHideProcess(event?: EventArgs) {
        if (event && event.propertyKey === 'style' || !!!event) {
            let currShow: boolean = this.show;
            this.getMediaQueryData(item => {
                if (item.show != undefined) {
                    currShow = currShow || !!item.show;
                    return true;
                } else return false;
            }, false);

            if (currShow)
                if (this._isFlexContainer && !this._hostFlexContainer.fxforceDispaly)
                    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'flex');
                else
                    this.renderer.setStyle(this.elementRef.nativeElement, 'display', this.fxItemDisplay);
            else
                this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
        }
    }

    protected _buildStyleMap(styles: NgStyleType): NgStyleMap {
        let sanitizer: NgStyleSanitizer = (val: any) => {
            // Always safe-guard (aka sanitize) style property values
            return this._sanitizer.sanitize(SecurityContext.STYLE, val);
        };
        if (styles) {
            switch (ngStyleUtils.getType(styles)) {
                case 'string': return ngStyleUtils.buildMapFromList(ngStyleUtils.buildRawList(styles), sanitizer);
                case 'array': return ngStyleUtils.buildMapFromList(styles as NgStyleRawList, sanitizer);
                case 'set': return ngStyleUtils.buildMapFromSet(styles, sanitizer);
                default: return ngStyleUtils.buildMapFromSet(styles, sanitizer);
            }
        }
        return null;
    }

}