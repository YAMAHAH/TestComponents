import { Directive, Input, ElementRef, OnChanges, Renderer2, SimpleChanges, SimpleChange, HostBinding, Optional, Host } from '@angular/core';
import { FlexContainerDirective } from './flex-container.directive';

type FlexItemAlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
@Directive({
    selector: '[x-flex-item],x-flex-item'
})
export class FlexItemDirective implements OnChanges {

    @Input() order: number = 0;
    @Input() flexGrow: string = '0';
    @Input() flexShrink: string = '1';
    @Input() flexBasis: string = "auto";
    // 绝对Flex项目的宽度只基于flex属性(0)时会自动分配剩余空间)，而相对Flex项目的宽度基于内容大小(auto)
    @Input() alignSelf: FlexItemAlignSelf;
    @Input('x-flex-item') flex: string = '0 1 auto'; // auto:1 1 auto none: 0 0 auto;
    /**
     * 跨距
     */
    @Input('x-span') span: number;
    /**
     * 偏移
     */
    @Input('x-offset') offset: number;

    @HostBinding('style.padding-left.px')
    get paddingLeft() {
        console.log(this._flexContainer.gutter / 2);
        return this._flexContainer && this._flexContainer.gutter / 2;
    }

    @HostBinding('style.padding-right.px')
    get paddingRight() {
        return this._flexContainer && this._flexContainer.gutter / 2;
    }

    constructor(private elementRef: ElementRef,
        @Optional() @Host() private _flexContainer: FlexContainerDirective,
        private renderer: Renderer2) {
    }
    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            if (changes.hasOwnProperty(key)) {
                let name: string, styleValue: any;
                let value: SimpleChange = changes[key];

                switch (key) {
                    case 'order':
                        name = 'order';
                        break;
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
                if (key === 'offset') {
                    name = 'margin-left';
                    this.renderer.setStyle(this.elementRef.nativeElement, name, (this.offset / this._flexContainer.gridColumns) * 100 + '%');
                }
                if (key === 'span') {
                    // name = 'width';
                    // this.renderer.setStyle(this.elementRef.nativeElement, name, (this.span / this._flexContainer.gridColumns) + '%');
                    this.renderer.setStyle(this.elementRef.nativeElement, 'flex', '0  0 ' + (this.span / this._flexContainer.gridColumns) * 100 + '%');
                }

            }

        }
    }
}