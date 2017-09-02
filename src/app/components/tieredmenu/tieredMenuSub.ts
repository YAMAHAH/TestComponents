import { EventEmitter, Input, Component } from '@angular/core';
import { MenuItem } from '../common/api';
import { DomHandler } from '../../common/dom/domhandler';
import { Router } from '@angular/router';
@Component({
    selector: 'p-tieredMenuSub',
    templateUrl: './tieredMenuSub.html',
    providers: [DomHandler]
})
export class TieredMenuSub {

    @Input() item: MenuItem;

    @Input() root: boolean;

    constructor(public domHandler: DomHandler, public router: Router, public location: Location) { }

    activeItem: Element;

    onItemMouseEnter(event: Event, item: HTMLElement, menuitem: MenuItem) {
        if (menuitem.disabled) {
            return;
        }

        this.activeItem = item;
        let nextElement: HTMLElement = <HTMLElement>item.children[0].nextElementSibling;
        if (nextElement) {
            let sublist: HTMLElement = <HTMLElement>nextElement.children[0];
            sublist.style.zIndex = String(++DomHandler.zindex);

            sublist.style.top = '0px';
            sublist.style.left = this.domHandler.getOuterWidth(item.children[0]) + 'px';
        }
    }

    onItemMouseLeave(event: Event) {
        this.activeItem = null;
    }

    itemClick(event: Event, item: MenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return true;
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
    }

    listClick(event: Event) {
        this.activeItem = null;
    }
}