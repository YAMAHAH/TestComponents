import {
    Directive, Input, ElementRef, OnChanges, Renderer2, SimpleChanges,
    SimpleChange, HostBinding, Optional, Host, SkipSelf, ViewContainerRef, SecurityContext,
} from '@angular/core';
import { FlexLayoutDirective } from './flex-layout.directive';
import { tryGetValue } from '../../untils/type-checker';
import { NgStyleType, NgStyleSanitizer, NgStyleRawList, ngStyleUtils, NgStyleMap } from '../../untils/style-transforms';
import { DomSanitizer } from '@angular/platform-browser';
import { DomHandler } from "../dom/domhandler";
import { OnInit, KeyValueDiffers, DoCheck, OnDestroy } from '@angular/core';
import { flexItem } from '../../Models/flex-item';
import { FxStyle } from './fxstyle';

type FlexItemAlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

@Directive({
    selector: '[fxItem],fxItem'
})
export class FlexItemDirective implements OnChanges, OnInit, DoCheck, OnDestroy {
    ngOnDestroy(): void {
        this._fxStyleInstance = null;
    }
    private _fxStyleInstance: FxStyle;
    ngDoCheck(): void {
        this._fxStyleInstance.ngDoCheck();
    }
    ngOnInit(): void {
        //  settim(() => { this.lg && console.log(this.lg); console.log(this) }, 3000);
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
    //@Input('fxItem.xs') xs: flexItem; //480px
    private _xs: flexItem;
    @Input('fxItem.xs') //>=480px
    get xs(): flexItem {
        return this._xs;
    }
    set xs(value: flexItem) {
        if (value) {
            let srcObj = value['data'] || value;
            if (!this.xs)
                this._xs = new flexItem();

            Object.assign(this.xs, srcObj);
            if (!(srcObj instanceof flexItem))
                Object.setPrototypeOf(srcObj, Object.getPrototypeOf(this.xs));

            this.createTargetProxy(srcObj,
                (propKey, val) => {
                    this.xs[propKey] = val;
                }, () => {
                    this.itemHandler();
                });
        }
    }
    private _sm: flexItem;
    @Input('fxItem.sm') //>=768px 
    get sm(): flexItem {
        return this._sm;
    }
    set sm(value: flexItem) {
        if (value) {
            let srcObj = value['data'] || value;
            if (!this.sm)
                this._sm = new flexItem();

            Object.assign(this.sm, srcObj);
            if (!(srcObj instanceof flexItem))
                Object.setPrototypeOf(srcObj, Object.getPrototypeOf(this.sm));

            this.createTargetProxy(srcObj,
                (propKey, val) => {
                    this.sm[propKey] = val;
                }, () => {
                    this.itemHandler();
                });
        }
    }

    private _md: flexItem;
    @Input('fxItem.md') //>=992px;
    get md(): flexItem {
        return this._md;
    }
    set md(value: flexItem) {
        if (value) {
            let srcObj = value['data'] || value;
            if (!this.md)
                this._md = new flexItem();

            Object.assign(this.md, srcObj);
            if (!(srcObj instanceof flexItem))
                Object.setPrototypeOf(srcObj, Object.getPrototypeOf(this.md));

            this.createTargetProxy(srcObj,
                (propKey, val) => {
                    this.md[propKey] = val;
                }, () => {
                    this.itemHandler();
                });
        }
    }
    private _lg: flexItem;
    @Input('fxItem.lg') // >=1200px
    get lg(): flexItem {
        return this._lg;
    }
    set lg(value: flexItem) {
        if (value) {
            let srcObj = value['data'] || value;
            if (!this.lg)
                this._lg = new flexItem();

            Object.assign(this.lg, srcObj);
            if (!(srcObj instanceof flexItem))
                Object.setPrototypeOf(srcObj, Object.getPrototypeOf(this.lg));

            this.createTargetProxy(srcObj,
                (propKey, val) => {
                    this.lg[propKey] = val;
                }, () => {
                    this.itemHandler();
                });
        }
    }

    private _xl: flexItem;
    @Input('fxItem.xl')
    get xl(): flexItem //>=1600px
    {
        return this._xl;
    }
    set xl(value: flexItem) {
        if (value) {
            let srcObj = value['data'] || value;
            if (!this.xl)
                this._xl = new flexItem();

            Object.assign(this.xl, srcObj);
            if (!(srcObj instanceof flexItem))
                Object.setPrototypeOf(srcObj, Object.getPrototypeOf(this.xl));

            this.createTargetProxy(srcObj,
                (propKey, val) => {
                    this.xl[propKey] = val;
                }, () => {
                    this.itemHandler();
                });
        }
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

    createTargetProxy(target: any,
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
    createHostProxy(target: any,
        beforeAction?: (propKey?: PropertyKey, value?: any) => void,
        afterAction?: (propKey?: PropertyKey, value?: any) => void) {
        let handler = () => {
            let listenProps = [
                "lg", "xl", "xs", "sm", "md"
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
    ]; //, 'xs', 'sm', 'md', 'lg', 'xl'
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
                    //样式类处理
                    this.itemClassProcess();
                    //样式处理
                    this.itemStyleProcess();
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
        if (screen.width >= 480 && this.xs && this.xs.order)
            currOrder = this.xs.order;
        if (screen.width >= 768 && this.sm && this.sm.order)
            currOrder = this.sm.order;
        if (screen.width >= 992 && this.md && this.md.order)
            currOrder = this.md.order;
        if (screen.width >= 1200 && this.lg && this.lg.order)
            currOrder = this.lg.order;
        if (screen.width >= 1600 && this.xl && this.xl.order)
            currOrder = this.xl.order;
        this.renderer.setStyle(this.elementRef.nativeElement, name, currOrder);
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
        if (screen.width >= 480 && this.xs && this.xs.offset)
            currOffset = this.xs.offset;
        if (screen.width >= 768 && this.sm && this.sm.offset)
            currOffset = this.sm.offset;
        if (screen.width >= 992 && this.md && this.md.offset)
            currOffset = this.md.offset;
        if (screen.width >= 1200 && this.lg && this.lg.offset)
            currOffset = this.lg.offset;
        if (screen.width >= 1600 && this.xl && this.xl.offset)
            currOffset = this.xl.offset;
        this.renderer.setStyle(this.elementRef.nativeElement, name, (currOffset / this._flexContainer.gridColumns) * 100 + '%');
    }

    itemFlexProcess() {
        let name = 'flex'; //span ->width ->auto 
        let currSpan: number = this.span;
        if (screen.width >= 480 && this.xs && this.xs.span)
            currSpan = this.xs.span;
        if (screen.width >= 768 && this.sm && this.sm.span)
            currSpan = this.sm.span;
        if (screen.width >= 992 && this.md && this.md.span)
            currSpan = this.md.span;
        if (screen.width >= 1200 && this.lg && this.lg.span)
            currSpan = this.lg.span;
        if (screen.width >= 1600 && this.xl && this.xl.span)
            currSpan = this.xl.span;
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
    itemClassProcess() {
        let currClass = "";
        this.delClasses = [];
        if (screen.width >= 480 && this.xs && this.xs.class != undefined)
            currClass = this.getElementClass(currClass, this.xs.class);

        if (screen.width >= 768 && this.sm && this.sm.class != undefined)
            currClass = this.getElementClass(currClass, this.sm.class);

        if (screen.width >= 992 && this.md && this.md.class != undefined)
            currClass = this.getElementClass(currClass, this.md.class);

        if (screen.width >= 1200 && this.lg && this.lg.class != undefined)
            currClass = this.getElementClass(currClass, this.lg.class);

        if (screen.width >= 1600 && this.xl && this.xl.class != undefined)
            currClass = this.getElementClass(currClass, this.xl.class);

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
        if (screen.width >= 480 && this.xs && this.xs.style != undefined)
            currStyle = this._buildStyleMap(this.xs.style);
        if (screen.width >= 768 && this.sm && this.sm.style != undefined)
            currStyle = this._buildStyleMap(this.sm.style);
        if (screen.width >= 992 && this.md && this.md.style != undefined)
            currStyle = this._buildStyleMap(this.md.style);
        if (screen.width >= 1200 && this.lg && this.lg.style != undefined)
            currStyle = this._buildStyleMap(this.lg.style);
        if (screen.width >= 1600 && this.xl && this.xl.style != undefined) {
            currStyle = this._buildStyleMap(this.xl.style);
        }
        if (this.fxItemStyle)
            currStyle = Object.assign(this._buildStyleMap(this.fxItemStyle), currStyle);

        if (this._flexContainer.fxStyle)
            currStyle = Object.assign(this._buildStyleMap(this._flexContainer.fxStyle), currStyle);

        this._fxStyleInstance.ngStyle = currStyle;
        //let styleMap: NgStyleMap = this._buildStyleMap(currStyle);
        // for (let key in styleMap) {
        //     if (styleMap.hasOwnProperty(key)) {
        //         let value = styleMap[key];
        //         this._setStyle(key, value);
        //     }
        // }

    }
    private _setStyle(nameAndUnit: string, value: string | number | null | undefined): void {
        const [name, unit] = nameAndUnit.split('.');
        value = value != null && unit ? `${value}${unit}` : value;
        this.renderer.setStyle(this.elementRef.nativeElement, name, value as string);
    }
    itemShowHideProcess() {
        let currShow: boolean = this.show;
        if (screen.width >= 480 && this.xs && this.xs.show != undefined)
            currShow = !!this.xs.show;
        if (screen.width >= 768 && this.sm && this.sm.show != undefined)
            currShow = !!this.sm.show;
        if (screen.width >= 992 && this.md && this.md.show != undefined)
            currShow = !!this.md.show;
        if (screen.width >= 1200 && this.lg && this.lg.show != undefined)
            currShow = !!this.lg.show;
        if (screen.width >= 1600 && this.xl && this.xl.show != undefined) {
            currShow = !!this.xl.show;
        }
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