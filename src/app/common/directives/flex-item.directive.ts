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

type FlexItemAlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

@Directive({
    selector: '[fxItem]'
})
export class FlexItemDirective implements OnChanges, OnInit, DoCheck, OnDestroy {

    private sizeDataMap: Map<string, FlexItem> = new Map<string, FlexItem>();
    ngOnDestroy(): void {
        this._fxStyleInstance = null;
        this.xsMediaQueryList.removeListener(this.xsMediaQueryHandler);
        this.smMediaQueryList.removeListener(this.smMediaQueryHandler);
        this.mdMediaQueryList.removeListener(this.mdMediaQueryHandler);
        this.lgMediaQueryList.removeListener(this.lgMediaQueryHandler);
        this.xlMediaQueryList.removeListener(this.xlMediaQueryHandler);
    }
    private _fxStyleInstance: FxStyle;
    ngDoCheck(): void {
        this._fxStyleInstance.ngDoCheck();
    }
    ngOnInit(): void {
        this.getMediaQueryList();
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
        if ((this.fill || this._flexContainer.fxFill) && this._flexContainer && (this._flexContainer.direction === 'column' || this._flexContainer.direction === 'column-reverse'))
            return '100%';
    }

    @HostBinding('style.min-height')
    get minHeight() {
        if ((this.fill || this._flexContainer.fxFill) && this._flexContainer && (this._flexContainer.direction === 'row' || this._flexContainer.direction === 'row-reverse'))
            return '100%';
    }
    @HostBinding('style.width')
    get fillWidth() {
        if ((this.fill || this._flexContainer.fxFill) && this._flexContainer && (this._flexContainer.direction === 'column' || this._flexContainer.direction === 'column-reverse'))
            return '100%';
        if ((this.fxItemWidth || this._flexContainer.fxHeight) && this.span <= 0)
            return this.fxItemWidth || this._flexContainer.fxWidth;
    }
    @HostBinding('style.height')
    get fillHeight() {
        if ((this.fill || this._flexContainer.fxFill) && this._flexContainer && (this._flexContainer.direction === 'row' || this._flexContainer.direction === 'row-reverse'))
            return '100%';
        if ((this.fxItemHeight || this._flexContainer.fxHeight) && this.span <= 0)
            return this.fxItemHeight || this._flexContainer.fxHeight;
    }

    // const FLEX_FILL_CSS = {
    //     'margin': 0,
    //     'width': '100%',
    //     'height': '100%',
    //     'min-width': '100%',
    //     'min-height': '100%'
    //   };1 0 0
    private _xs: FlexItem;
    @Input('fxItem.xs') //>=480px
    get xs(): FlexItem {
        return this.sizeDataMap.get('xs'); //   this._xs;
    }
    set xs(value: FlexItem) {
        this.deviceSetterHandler('xs', value);
    }
    @Input('fxItem.gt-xs') //>=480px
    get gtxs(): FlexItem {
        return this.sizeDataMap.get('gt-xs'); //   this._xs;
    }
    set gtxs(value: FlexItem) {
        this.deviceSetterHandler('gt-xs', value);
    }
    @Input('fxItem.lt-sm')
    get ltsm(): FlexItem {
        return this.sizeDataMap.get('lt-sm');
    }
    set ltsm(value: FlexItem) {
        this.deviceSetterHandler('lt-sm', value);
    }
    private _sm: FlexItem;
    @Input('fxItem.sm') //>=768px 
    get sm(): FlexItem {
        return this.sizeDataMap.get('sm'); //this._sm;
    }
    set sm(value: FlexItem) {
        this.deviceSetterHandler('sm', value);
    }

    @Input('fxItem.gt-sm')
    get gtsm(): FlexItem {
        return this.sizeDataMap.get('gt-sm');
    }
    set gtsm(value: FlexItem) {
        this.deviceSetterHandler('gt-sm', value);
    }

    deviceSetterHandler(key: string, newValue: FlexItem) {
        if (newValue) {
            let srcObj = newValue['data'] || newValue;
            if (!this.sizeDataMap.has(key))
                this.sizeDataMap.set(key, new FlexItem());
            let oldValue2 = this.sizeDataMap.get(key);
            Object.assign(oldValue2, srcObj);
            if (!(srcObj instanceof FlexItem))
                Object.setPrototypeOf(srcObj, Object.getPrototypeOf(oldValue2));

            this.createTargetProxy(srcObj,
                (propKey, val) => {
                    oldValue2[propKey] = val;
                }, () => {
                    this.itemHandler();
                });
        }
    }
    @Input('fxItem.lt-md') //>=992px;
    get ltmd(): FlexItem {
        return this.sizeDataMap.get('lt-md'); //this._md;
    }
    set ltmd(value: FlexItem) {
        this.deviceSetterHandler('lt-md', value);
    }
    private _md: FlexItem;
    @Input('fxItem.md') //>=992px;
    get md(): FlexItem {
        return this.sizeDataMap.get('md'); //this._md;
    }
    set md(value: FlexItem) {
        this.deviceSetterHandler('md', value);
    }
    @Input('fxItem.gt-md') //>=992px;
    get gtmd(): FlexItem {
        return this.sizeDataMap.get('gt-md'); //this._md;
    }
    set gtmd(value: FlexItem) {
        this.deviceSetterHandler('gt-md', value);
    }
    @Input('fxItem.lt-lg') // >=1200px
    get ltlg(): FlexItem {
        return this.sizeDataMap.get('lt-lg'); //this._lg;
    }
    set ltlg(value: FlexItem) {
        this.deviceSetterHandler('lt-lg', value);
    }
    private _lg: FlexItem;
    @Input('fxItem.lg') // >=1200px
    get lg(): FlexItem {
        return this.sizeDataMap.get('lg'); //this._lg;
    }
    set lg(value: FlexItem) {
        this.deviceSetterHandler('lg', value);
    }
    @Input('fxItem.gt-lg') // >=1200px
    get gtlg(): FlexItem {
        return this.sizeDataMap.get('gt-lg'); //this._lg;
    }
    set gtlg(value: FlexItem) {
        this.deviceSetterHandler('gt-lg', value);
    }
    @Input('fxItem.lt-xl')
    get ltxl(): FlexItem //>=1600px
    {
        return this.sizeDataMap.get('lt-xl'); //this._xl;
    }
    set ltxl(value: FlexItem) {
        this.deviceSetterHandler('ltxl', value);
    }
    @Input('fxItem.xl')
    get xl(): FlexItem //>=1600px
    {
        return this.sizeDataMap.get('xl'); //this._xl;
    }
    set xl(value: FlexItem) {
        this.deviceSetterHandler('xl', value);
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
        private renderer: Renderer2) {
        if (this._hostFlexContainer != this._flexContainer) {
            this._isFlexContainer = true;
        }
        this.createHostProxy(this, null,
            () => {
                this.itemHandler();
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
        beforeAction?: (propKey?: PropertyKey, value?: any) => void,
        afterAction?: (propKey?: PropertyKey, value?: any) => void) {
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
                            if (beforeAction) beforeAction(propertyKey, value);
                            let res = Reflect.set(target, propertyKey, value, receiver);
                            console.log(`绑定对象属性值变化: key: ${propertyKey} value: ${JSON.stringify(value)} `);
                            if (afterAction) afterAction(propertyKey, value);
                            return res;
                        } else {
                            let res = Reflect.set(target, propertyKey, value, receiver);
                            return res;
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
        beforeAction?: (propKey?: PropertyKey, value?: any) => void,
        afterAction?: (propKey?: PropertyKey, value?: any) => void) {
        let handler = () => {
            let listenProps = [
                "xs", 'gtxs',
                'ltsm', "sm", 'gtsm',
                'ltmd', "md", 'gtmd',
                'ltlg', "lg", 'gtlg',
                'ltxl', "xl"
            ];
            return {
                set: function (target: any, propertyKey: PropertyKey, value: any, receiver?: any) {
                    if (typeof propertyKey === 'string') {
                        let findIndex = listenProps.contains(propertyKey);
                        if (findIndex) {
                            if (beforeAction) beforeAction(propertyKey, value);
                            let res = Reflect.set(target, propertyKey, value, receiver);
                            console.log(`绑定对象变化: key: ${propertyKey} value: ${JSON.stringify(value)} `);
                            if (afterAction) afterAction(propertyKey, value);
                            return res;
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
                    // 处理排序
                    this.itemOrderProcess();
                    //处理偏移
                    this.itemOffsetProcess();
                    //处理主轴大小
                    this.itemFlexProcess();
                    //处理显示
                    this.itemShowHideProcess();
                    // //样式类处理
                    // this.itemClassProcess();
                    // //样式处理
                    // this.itemStyleProcess();
                }

            }

        }

    }

    itemHandler() {
        // 处理排序
        this.itemOrderProcess();
        //处理偏移
        this.itemOffsetProcess();
        //处理主轴大小
        this.itemFlexProcess();
        //处理显示
        this.itemShowHideProcess();
        //样式类处理
        this.itemClassProcess();
        //样式处理
        this.itemStyleProcess();
    }
    //ngOnChanges ngOnint ngDoCheck ngAfterContentInit ngAfterContentChecked ngAfterViewInit ngAfterViewChecked ngOnDestroy
    itemOrderProcess() {
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

    getMediaQueryData(actionFn: (item: FlexItem) => boolean, autoBreak: boolean = true) {
        for (let index = 0; index < this.mediaList.length; index++) {
            let itemKey = this.mediaList[index];
            let itemEntry = this.sizeDataMap.get(itemKey);
            if (itemEntry && actionFn) {
                if (actionFn(itemEntry) && autoBreak) break;
            }
        }
    }
    xsMediaQueryHandler = (mql: MediaQueryList): void => {
        if (mql.matches) {
            this.mediaList = [];
            this.mediaList.push('xs', 'lt-sm', 'lt-md', 'lt-lg', 'lt-xl');
            this.itemHandler();
        }
    }
    smMediaQueryHandler = (mql: MediaQueryList): void => {
        if (mql.matches) {
            this.mediaList = [];
            this.mediaList.push('sm', 'gt-xs', 'lt-md', 'lt-lg', 'lt-xl');
            this.itemHandler();
        }
    }
    mdMediaQueryHandler = (mql: MediaQueryList): void => {
        if (mql.matches) {
            this.mediaList = [];
            this.mediaList.push('md', 'gt-xs', 'gt-sm', 'lt-lg', 'lt-xl');
            this.itemHandler();
        }
    }
    lgMediaQueryHandler = (mql: MediaQueryList): void => {
        if (mql.matches) {
            this.mediaList = [];
            this.mediaList.push('lg', 'gt-xs', 'gt-sm', 'gt-md', 'lt-xl');
            this.itemHandler();
        }
    }
    xlMediaQueryHandler = (mql: MediaQueryList): void => {
        if (mql.matches) {
            this.mediaList = [];
            this.mediaList.push('xl', 'gt-xs', 'gt-sm', 'gt-md', 'gt-lg');
            this.itemHandler();
        }
    }
    protected xsMediaQueryList: MediaQueryList;
    protected smMediaQueryList: MediaQueryList
    protected mdMediaQueryList: MediaQueryList;
    protected lgMediaQueryList: MediaQueryList;
    protected xlMediaQueryList: MediaQueryList;
    getMediaQueryList() {
        // let inputMap: string[] = [];
        // let screenWidth = screen.width;

        this.xsMediaQueryList = window.matchMedia("(min-width: 0px) and (max-width:599px)");
        this.xsMediaQueryHandler(this.xsMediaQueryList);
        this.xsMediaQueryList.addListener(this.xsMediaQueryHandler);

        this.smMediaQueryList = window.matchMedia("(min-width: 600px) and (max-width:959px)");
        this.smMediaQueryHandler(this.smMediaQueryList);
        this.smMediaQueryList.addListener(this.smMediaQueryHandler);

        this.mdMediaQueryList = window.matchMedia("(min-width: 1920px) and (max-width:5000px)");
        this.mdMediaQueryHandler(this.mdMediaQueryList);
        this.mdMediaQueryList.addListener(this.mdMediaQueryHandler);

        this.lgMediaQueryList = window.matchMedia("(min-width: 1280px) and (max-width:1919px)");
        this.lgMediaQueryHandler(this.lgMediaQueryList);
        this.lgMediaQueryList.addListener(this.lgMediaQueryHandler);

        this.xlMediaQueryList = window.matchMedia("(min-width: 1920px) and (max-width:5000px)");
        this.xlMediaQueryHandler(this.xlMediaQueryList);
        this.xlMediaQueryList.addListener(this.xlMediaQueryHandler);
        // if (screenWidth >= 0 && screenWidth <= 599)
        //     inputMap.push('xs', 'lt-sm', 'lt-md', 'lt-lg', 'lt-xl');
        // else if (screenWidth >= 600 && screenWidth <= 959)
        //     inputMap.push('sm', 'gt-xs', 'lt-md', 'lt-lg', 'lt-xl');
        // else if (screenWidth >= 960 && screenWidth <= 1279)
        //     inputMap.push('md', 'gt-xs', 'gt-sm', 'lt-lg', 'lt-xl');
        // else if (screenWidth >= 1280 && screenWidth <= 1919)
        //     inputMap.push('lg', 'gt-xs', 'gt-sm', 'gt-md', 'lt-xl');
        // else if (screenWidth >= 1920 && screenWidth <= 5000)
        //     inputMap.push('xl', 'gt-xs', 'gt-sm', 'gt-md', 'gt-lg');
        // return inputMap;
    }

    itemOffsetProcess() {
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

    itemFlexProcess() {
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

    //*     <some-element [ngClass]="'first second'">...</some-element>
    //*
    // *     <some-element [ngClass]="['first', 'second']">...</some-element>
    // *
    // *     <some-element [ngClass]="{'first': true, 'second': true, 'third': false}">...</some-element>
    // *
    // *     <some-element [ngClass]="stringExp|arrayExp|objExp">...</some-element>
    // *
    // *     <some-element [ngClass]="{'class1 class2 class3' : true}">...</some-element>
    delClasses: string[] = [];
    mediaList: string[] = [];
    itemClassProcess() {
        let currClass = "";
        this.delClasses = [];
        let mediaList = this.mediaList;
        for (let index = 0; index < mediaList.length; index++) {
            let mediaVal = mediaList[index];
            let entry = this.sizeDataMap.get(mediaVal);
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
    /**
     * [fxItemStyle] = "{color:$thider,'font-size':$font-size}"
     * [fxItemStyle] = "color:blue;'font-size':18px;"
     * 
     */
    itemStyleProcess() {
        let currStyle: NgStyleMap;
        let mediaList = this.mediaList.reverse();
        for (let index = 0; index < mediaList.length; index++) {
            let mediaVal = mediaList[index];
            let entry = this.sizeDataMap.get(mediaVal);
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
    private _setStyle(nameAndUnit: string, value: string | number | null | undefined): void {
        const [name, unit] = nameAndUnit.split('.');
        value = value != null && unit ? `${value}${unit}` : value;
        this.renderer.setStyle(this.elementRef.nativeElement, name, value as string);
    }
    itemShowHideProcess() {
        let currShow: boolean = this.show;
        // if (screen.width >= 480 && this.xs && this.xs.show != undefined)
        //     currShow = !!this.xs.show;
        // if (screen.width >= 768 && this.sm && this.sm.show != undefined)
        //     currShow = !!this.sm.show;
        // if (screen.width >= 992 && this.md && this.md.show != undefined)
        //     currShow = !!this.md.show;
        // if (screen.width >= 1200 && this.lg && this.lg.show != undefined)
        //     currShow = !!this.lg.show;
        // if (screen.width >= 1600 && this.xl && this.xl.show != undefined) {
        //     currShow = !!this.xl.show;
        // }
        // for (let index = 0; index < this.mediaList.length; index++) {
        //     let itemKey = this.mediaList[index];
        //     let itemEntry = this.sizeDataMap.get(itemKey);
        //     if (itemEntry && itemEntry.show != undefined) {
        //         currShow = currShow || !!itemEntry.show;
        //     }
        // }
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