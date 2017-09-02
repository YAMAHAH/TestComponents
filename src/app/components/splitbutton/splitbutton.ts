import { NgModule, Component, ElementRef, OnInit, OnDestroy, Input, Output, EventEmitter, ContentChildren, QueryList, Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../button/button';
import { Router } from '@angular/router';
import { DomHandler } from '../../common/dom/domhandler';
import { MenuItem } from '../common/api';

@Component({
    selector: 'x-splitButton',
    templateUrl: './splitbutton.html',
    providers: [DomHandler]
})
export class SplitButton implements OnInit, OnDestroy {

    @Input() model: MenuItem[];

    @Input() icon: string;

    @Input() iconPos: string = 'left';

    @Input() label: string;

    @Output() onClick: EventEmitter<any> = new EventEmitter();

    @Input() style: any;

    @Input() styleClass: string;

    @Input() menuStyle: any;

    @Input() menuStyleClass: string;

    @Input() disabled: boolean;

    @Input() tabindex: number;

    public menuVisible: boolean = false;

    public documentClickListener: any;

    constructor(public el: ElementRef,
        public domHandler: DomHandler,
        public renderer: Renderer,
        public router: Router) { }

    ngOnInit() {
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
            this.menuVisible = false;
        });
    }

    onDefaultButtonClick(event: Event) {
        this.onClick.emit(event);
    }

    itemClick(event: Event, item: MenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url || item.routerLink) {
            event.preventDefault();
        }

        if (item.command) {
            if (!item.eventEmitter) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }

            item.eventEmitter.emit(event);
        }

        this.menuVisible = false;

        if (item.routerLink) {
            this.router.navigate(item.routerLink);
        }
    }

    onDropdownClick(event: Event, menu: Element, container: Element) {
        this.menuVisible = !this.menuVisible;
        this.domHandler.relativePosition(menu, container);
        this.domHandler.fadeIn(menu, 25);
        event.stopPropagation();
    }

    ngOnDestroy() {
        this.documentClickListener();
    }
}

@NgModule({
    imports: [CommonModule, ButtonModule],
    exports: [SplitButton, ButtonModule],
    declarations: [SplitButton]
})
export class SplitButtonModule { }