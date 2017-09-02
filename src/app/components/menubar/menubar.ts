import { NgModule, Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, Renderer, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../common/api';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DomHandler } from '../../common/dom/domhandler';

@Component({
    selector: 'jy-menubarSub',
    templateUrl: './menubarSub.html',
    providers: [DomHandler]
})
export class MenubarSub {

    @Input() item: MenuItem;

    @Input() root: boolean;

    constructor(public domHandler: DomHandler, public router: Router) { }

    activeItem: any;

    onItemMouseEnter(event: any, item: any, menuitem: MenuItem) {
        if (menuitem.disabled) {
            return;
        }

        this.activeItem = item;
        let nextElement = item.children[0].nextElementSibling;
        if (nextElement) {
            let sublist = nextElement.children[0];
            sublist.style.zIndex = ++DomHandler.zindex;

            if (this.root) {
                sublist.style.top = this.domHandler.getOuterHeight(item.children[0]) + 'px';
                sublist.style.left = '0px'
            }
            else {
                sublist.style.top = '0px';
                sublist.style.left = this.domHandler.getOuterWidth(item.children[0]) + 'px';
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

    listClick(event: any) {
        this.activeItem = null;
    }

}

@Component({
    selector: 'jy-menubar',
    templateUrl: './menubar.html',
    providers: [DomHandler]
})
export class Menubar implements OnDestroy {

    @Input() model: MenuItem[];

    @Input() style: any;

    @Input() styleClass: string;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) { }

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
}

@NgModule({
    imports: [CommonModule],
    exports: [Menubar],
    declarations: [Menubar, MenubarSub]
})
export class MenubarModule { }