import { Component, Input, Inject, forwardRef, EventEmitter } from '@angular/core';
import { DomHandler } from '../../common/dom/domhandler';
import { MenuItem } from '../common/api';
import { Router } from '@angular/router';
import { ContextMenu } from './contextmenu';
@Component({
    selector: 'gx-contextMenuSub',
    templateUrl: './contextMenuSub.html',
    providers: [DomHandler]
})
export class ContextMenuSub {

    @Input() item: MenuItem;

    @Input() root: boolean;
    @Input() data: any;

    constructor(public domHandler: DomHandler,
        @Inject(forwardRef(() => ContextMenu)) public contextMenu: ContextMenu) { }

    activeItem: any;

    containerLeft: any;

    onItemMouseEnter(event: any, item: any, menuitem: MenuItem) {
        if (menuitem.disabled) {
            return;
        }

        this.activeItem = item;
        let nextElement = item.children[0].nextElementSibling;
        if (nextElement) {
            let sublist = nextElement.children[0];
            sublist.style.zIndex = ++DomHandler.zindex;
            this.position(sublist, item);
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
            item.command({
                originalEvent: event,
                item: item,
                data: this.data
            });
        }
    }

    listClick(event: any) {
        this.activeItem = null;
    }

    position(sublist: any, item: any) {
        this.containerLeft = this.domHandler.getOffset(item.parentElement)
        let viewport = this.domHandler.getViewport();
        let sublistWidth = sublist.offsetParent ? sublist.offsetWidth : this.domHandler.getHiddenElementOuterWidth(sublist);
        let itemOuterWidth = this.domHandler.getOuterWidth(item.children[0]);

        sublist.style.top = '0px';

        if ((parseInt(this.containerLeft.left) + itemOuterWidth + sublistWidth) > (viewport.width - this.calculateScrollbarWidth())) {
            sublist.style.left = -sublistWidth + 'px';
        }
        else {
            sublist.style.left = itemOuterWidth + 'px';
        }
    }

    calculateScrollbarWidth(): number {
        let scrollDiv = document.createElement("div");
        scrollDiv.className = "ui-scrollbar-measure";
        document.body.appendChild(scrollDiv);

        let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);

        return scrollbarWidth;
    }
}
