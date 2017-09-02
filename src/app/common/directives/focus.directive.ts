import { Directive, Input, ElementRef, OnChanges } from '@angular/core';
@Directive({
    selector: '[focus]'
})
export class FocusDirective implements OnChanges {
    @Input() focus: boolean = true;
    constructor(private element: ElementRef) {

    }
    ngOnChanges() {
        this.element.nativeElement.focus();
    }
}