import { NgModule, Component, Input, Output, EventEmitter, trigger, state, transition, style, animate, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockableUI } from '../common/api';

@Component({
    selector: 'x-fieldset',
    templateUrl: './fieldset.html',
    animations: [
        trigger('fieldsetContent', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class Fieldset implements BlockableUI {

    @Input() legend: string;

    @Input() toggleable: boolean;

    @Input() collapsed: boolean = false;

    @Output() onBeforeToggle: EventEmitter<any> = new EventEmitter();

    @Output() onAfterToggle: EventEmitter<any> = new EventEmitter();

    @Input() style: any;

    @Input() styleClass: string

    public animating: boolean;

    constructor(private el: ElementRef) { }

    toggle(event: Event) {
        if (this.toggleable) {
            this.animating = true;
            this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });

            if (this.collapsed)
                this.expand(event);
            else
                this.collapse(event);

            this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });

            //TODO: Use onDone of animate callback instead with RC6
            setTimeout(() => {
                this.animating = false;
            }, 400);
        }
    }

    expand(event: any) {
        this.collapsed = false;
    }

    collapse(event: any) {
        this.collapsed = true;
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

}

@NgModule({
    imports: [CommonModule],
    exports: [Fieldset],
    declarations: [Fieldset]
})
export class FieldsetModule { }