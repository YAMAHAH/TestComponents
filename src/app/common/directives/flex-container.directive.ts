import { Directive, Input, ElementRef, OnChanges, Renderer2, SimpleChanges, SimpleChange } from '@angular/core';


type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
type FlexJustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
type FlexAlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

@Directive({
    selector: '[x-flex-container],x-flex-container'
})
export class FlexContainerDirective implements OnChanges {
    private display = 'flex';

    @Input('x-flex-container') direction: FlexDirection = 'row';

    @Input() wrap: FlexWrap = 'nowrap';

    @Input() justifyContent: FlexJustifyContent = 'flex-start';

    @Input() alignItems: FlexAlignItems = 'stretch';

    @Input() alignContent: FlexAlignItems = 'stretch';
    gridColumns: number = 24;
    private _gutter: number = 0;
    @Input('x-gutter')
    get gutter(): number {
        return this._gutter;
    };

    set gutter(value: number) {
        this._gutter = value;
        this.setStyle();
    }

    setStyle() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'margin-left', `-${this._gutter / 2}px`);
        this.renderer.setStyle(this.elementRef.nativeElement, 'margin-right', `-${this._gutter / 2}px`);
    }
    constructor(private elementRef: ElementRef,
        private renderer: Renderer2) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'flex');
    }
    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                let name: string;
                let value: SimpleChange = changes[key];
                switch (key) {
                    case 'direction':
                        name = 'flex-direction';
                        break;
                    case 'wrap':
                        name = 'flex-wrap';
                        break;
                    case 'justifyContent':
                        name = 'justify-content';
                        break;
                    case 'alignItems':
                        name = 'align-items';
                        break;
                    case 'alignContent':
                        name = 'align-content';
                        break;
                    default:
                        break;
                }
                this.renderer.setStyle(this.elementRef.nativeElement, name, value.currentValue);
            }
            // let flexStyle = {
            //     'display': this.display,
            //     'flex-direction': this.direction || 'row',
            //     'flex-wrap': this.wrap || 'nowrap',
            //     'justify-content': this.justifyContent || 'flex- start',
            //     'align-items': this.alignItems || 'flex-start',
            //     'align-content': this.alignContent || 'flex-start'
            // };
        }
    }
}