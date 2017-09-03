import { NgModule, Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, Renderer, EventEmitter, Inject, forwardRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../common/api';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DomHandler } from '../../common/dom/domhandler';
import { ContextMenuSub } from './ContextMenuSub';


@Component({
    selector: 'x-contextMenu',
    templateUrl: './contextMenu.html',
    providers: [DomHandler]
})
export class ContextMenu implements AfterViewInit, OnDestroy {

    @Input() model: MenuItem[];

    @Input() global: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() appendTo: any;

    @ViewChild('container') containerViewChild: ElementRef;

    container: HTMLDivElement;

    visible: boolean;

    documentClickListener: any;

    documentRightClickListener: any;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) { }

    ngAfterViewInit() {
        this.container = <HTMLDivElement>this.containerViewChild.nativeElement;

        this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
            this.hide();
        });

        if (this.global) {
            this.documentRightClickListener = this.renderer.listenGlobal('body', 'contextmenu', (event:any) => {
                this.show(event);
                event.preventDefault();
            });
        }

        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                this.domHandler.appendChild(this.container, this.appendTo);
        }
    }

    show(event?: MouseEvent) {
        this.position(event);
        this.visible = true;
        this.domHandler.fadeIn(this.container, 250);

        if (event) {
            event.preventDefault();
        }
    }

    hide() {
        this.visible = false;
    }

    toggle(event?: MouseEvent) {
        if (this.visible)
            this.hide();
        else
            this.show(event);
    }

    position(event?: MouseEvent) {
        if (event) {
            let left = event.pageX;
            let top = event.pageY;
            let width = this.container.offsetParent ? this.container.offsetWidth : this.domHandler.getHiddenElementOuterWidth(this.container);
            let height = this.container.offsetParent ? this.container.offsetHeight : this.domHandler.getHiddenElementOuterHeight(this.container);
            let viewport = this.domHandler.getViewport();

            //flip
            if (left + width - document.body.scrollLeft > viewport.width) {
                left -= width;
            }

            //flip
            if (top + height - document.body.scrollTop > viewport.height) {
                top -= height;
            }

            //fit
            if (left < document.body.scrollLeft) {
                left = document.body.scrollLeft;
            }

            //fit
            if (top < document.body.scrollTop) {
                top = document.body.scrollTop;
            }

            this.container.style.left = left + 'px';
            this.container.style.top = top + 'px';
        }
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
        this.documentClickListener();

        if (this.global) {
            this.documentRightClickListener();
        }

        if (this.model) {
            for (let item of this.model) {
                this.unsubscribe(item);
            }
        }

        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    }

}

@NgModule({
    imports: [CommonModule],
    exports: [ContextMenu],
    declarations: [ContextMenu, ContextMenuSub]
})
export class ContextMenuModule { }