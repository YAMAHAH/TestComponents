import {
    Directive, Input, ElementRef, OnChanges, Renderer2, SimpleChanges,
    SimpleChange, HostBinding, Optional, Host, SkipSelf, ViewContainerRef, SecurityContext,
} from '@angular/core';
import { FlexLayoutDirective } from './flex-layout.directive';
import { tryGetValue } from '../../untils/type-checker';
import { NgStyleType, NgStyleSanitizer, NgStyleRawList, ngStyleUtils } from '../../untils/style-transforms';
import { DomSanitizer } from '@angular/platform-browser';
import { DomHandler } from "../dom/domhandler";
import { OnInit } from '@angular/core';
import { flexItem } from '../../Models/flex-item';

type FlexItemAlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

@Directive({
    selector: '[fxItem],fxItem'
})
export class FlexItemDirective implements OnInit, OnChanges {
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
    @Input('fxItem.xs') xs: flexItem; //480px
    @Input('fxItem.sm') sm: flexItem; //>=768px 
    @Input('fxItem.md') md: flexItem;//>=992px;
    private _lg: flexItem;
    @Input('fxItem.lg') // >=1200px
    get lg(): flexItem {
        return this._lg;
    }
    set lg(value: flexItem) {
        if (value) {
            let srcObj = value['data'] || value;
            if (!this._lg) {
                this._lg = new flexItem();
                // this.createTargetProxy(this._lg);
            }
            // this._lg = Object.assign(this._lg, srcObj);
            if (!(srcObj instanceof flexItem)) {
                Object.setPrototypeOf(srcObj, Object.getPrototypeOf(this.lg));
            }
            this.createTargetProxy(srcObj,
                (propKey, val) => {
                    this._lg[propKey] = val;
                }, () => {
                    this.itemHandler();
                });
        }
    }
    @Input('fxItem.xl') xl: flexItem; //>=1600px


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
    @Input() fxItemStyle: string;

    private _isFlexContainer: boolean = false;
    constructor(private elementRef: ElementRef,
        protected _sanitizer: DomSanitizer,
        protected domHandler: DomHandler,
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
                            //console.log(`组件检测到了值变化: key: ${propertyKey} value: ${JSON.stringify(value)} `);
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
                            //console.log(`检测到了值变化1: key: ${propertyKey} value: ${JSON.stringify(value)} `);
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
    itemStyleProcess() {
        let currStyle = "";
        if (screen.width >= 480 && this.xs && this.xs.style != undefined)
            currStyle = this.xs.style;
        if (screen.width >= 768 && this.sm && this.sm.style != undefined)
            currStyle = this.sm.style;
        if (screen.width >= 992 && this.md && this.md.style != undefined)
            currStyle = this.md.style;
        if (screen.width >= 1200 && this.lg && this.lg.style != undefined)
            currStyle = this.lg.style;
        if (screen.width >= 1600 && this.xl && this.xl.style != undefined) {
            currStyle = this.xl.style;
        }
        if (this.fxItemStyle)
            currStyle = this.fxItemStyle + ';' + currStyle;

        if (this._flexContainer.fxStyle)
            currStyle = this._flexContainer.fxStyle + ';' + currStyle;
        let styleMap: any = this._buildStyleMap(currStyle);
        for (let key in styleMap) {
            if (styleMap.hasOwnProperty(key)) {
                let value = styleMap[key];
                this.renderer.setStyle(this.elementRef.nativeElement, key, value);
            }
        }

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

    protected _buildStyleMap(styles: NgStyleType) {
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
        return styles;
    }

}