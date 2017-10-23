import { Directive, Input, ElementRef, OnChanges, Renderer2, SimpleChanges, SimpleChange } from '@angular/core';


type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
type FlexJustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
type FlexAlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

@Directive({
    selector: '[fxLayout],fxLayout'
})
export class FlexLayoutDirective implements OnChanges {

    private _flexDirection: FlexDirection;
    @Input('fxLayout')
    get direction(): FlexDirection {
        return this._flexDirection || 'row';
    };
    set direction(value: FlexDirection) {
        this._flexDirection = value;
    }

    @Input('fxWrap') wrap: FlexWrap = 'nowrap';

    @Input('fxJustify') justifyContent: FlexJustifyContent = 'flex-start';

    @Input('fxAlignItems') alignItems: FlexAlignItems = 'stretch';

    @Input('fxAlignContent') alignContent: FlexAlignItems = 'stretch';
    gridColumns: number = 24;
    private _gutter: number = 0;
    @Input('fxGutter')
    get gutter(): number {
        return this._gutter;
    };

    set gutter(value: number) {
        this._gutter = value;
        this.setStyle();
    }

    setStyle() {
        if (this.direction === 'row' || this.direction === 'row-reverse') {
            this.renderer.setStyle(this.elementRef.nativeElement, 'margin-left', `-${this._gutter / 2}px`);
            this.renderer.setStyle(this.elementRef.nativeElement, 'margin-right', `-${this._gutter / 2}px`);
        } else if (this.direction === 'column' || this.direction === 'column-reverse') {
            this.renderer.setStyle(this.elementRef.nativeElement, 'margin-top', `-${this._gutter / 2}px`);
            this.renderer.setStyle(this.elementRef.nativeElement, 'margin-bottom', `-${this._gutter / 2}px`);
        }
    }

    @Input('fxGap') gap: number = 0;
    private _fill: boolean = false;
    @Input()
    get fxFill(): boolean {
        return this._fill;
    }
    set fxFill(value: boolean) {
        this._fill = (value === null || value === undefined || value || '' + value === '') ? true : value;
    }
    constructor(private elementRef: ElementRef,
        private renderer: Renderer2) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'flex');
    }

    @Input() fxWidth: string;
    @Input() fxHeight: string;
    @Input() fxClass: string | string[] | object;
    @Input() fxStyle: string = '';
    private _forceDisplay: boolean = false;
    @Input()
    get fxforceDispaly(): boolean {
        return this._forceDisplay;
    }
    set fxforceDispaly(value: boolean) {
        this._forceDisplay = (value === null || value === undefined || value || '' + value === '') ? true : value;
    }
    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                let name: string;
                let value: SimpleChange = changes[key];
                switch (key) {
                    case 'direction':
                        name = 'flex-direction';
                        value = value.currentValue || 'row';
                        break;
                    case 'wrap':
                        name = 'flex-wrap';
                        value = value.currentValue || 'nowrap';
                        break;
                    case 'justifyContent':
                        name = 'justify-content';
                        value = value.currentValue || 'flex-start';
                        break;
                    case 'alignItems':
                        name = 'align-items';
                        value = value.currentValue || 'stretch';
                        break;
                    case 'alignContent':
                        name = 'align-content';
                        value = value.currentValue || 'stretch';
                        break;
                    default:
                        break;
                }
                name && this.renderer.setStyle(this.elementRef.nativeElement, name, value);
            }
        }
    }
}