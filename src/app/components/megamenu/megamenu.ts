import { NgModule, Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, Renderer, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../common/api';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DomHandler } from '../../common/dom/domhandler';

@Component({
    selector: 'x-megaMenu',
    template: `
    `,
    providers: [DomHandler]
})
export class MegaMenu implements OnDestroy {

    @Input() model: MenuItem[];

    @Input() style: any;

    @Input() styleClass: string;

    @Input() orientation: string = 'horizontal';

    activeItem: any;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, public router: Router) { }

    onItemMouseEnter(event: any, item: any, menuitem: MenuItem) {
        if (menuitem.disabled) {
            return;
        }

        this.activeItem = item;
        let submenu = item.children[0].nextElementSibling;
        if (submenu) {
            submenu.style.zIndex = ++DomHandler.zindex;

            if (this.orientation === 'horizontal') {
                submenu.style.top = this.domHandler.getOuterHeight(item.children[0]) + 'px';
                submenu.style.left = '0px';
            }
            else if (this.orientation === 'vertical') {
                submenu.style.top = '0px';
                submenu.style.left = this.domHandler.getOuterWidth(item.children[0]) + 'px';
            }
        }
    }

    onItemMouseLeave(event: any, link: any) {
        this.activeItem = null;
    }

    itemClick(event: any, item: MenuItem) {
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

            item.eventEmitter.emit({
                originalEvent: event,
                item: item
            });
        }

        if (item.routerLink) {
            this.router.navigate(item.routerLink);
        }

        this.activeItem = null;
    }

    unsubscribe(item: any) {
        if (item.eventEmitter) {
            item.eventEmitter.unsubscribe();
        }

        if (item.items) {
            for (let childItem of item.items) {
                this.unsubscribe(childItem);
            }
        }
    }

    ngOnDestroy() {
        if (this.model) {
            for (let item of this.model) {
                this.unsubscribe(item);
            }
        }
    }

    getColumnClass(menuitem: MenuItem) {
        let length = menuitem.items ? menuitem.items.length : 0;
        let columnClass;
        switch (length) {
            case 2:
                columnClass = 'ui-g-6';
                break;

            case 3:
                columnClass = 'ui-g-4';
                break;

            case 4:
                columnClass = 'ui-g-3';
                break;

            case 6:
                columnClass = 'ui-g-2';
                break;

            default:
                columnClass = 'ui-g-12';
                break;
        }

        return columnClass;
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [MegaMenu],
    declarations: [MegaMenu]
})
export class MegaMenuModule { }