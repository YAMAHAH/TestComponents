import { NgModule, Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter, Inject, forwardRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../common/api';
import { Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomHandler } from '../../common/dom/domhandler';
import { ContextMenuSub } from './ContextMenuSub';


@Component({
    selector: 'gx-contextMenu',
    templateUrl: './contextMenu.html',
    providers: [DomHandler]
})
export class ContextMenu implements AfterViewInit, OnDestroy {

    @Input() model: MenuItem[];

    @Input() global: boolean;
    @Input() target: any;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() appendTo: any;

    @ViewChild('container') containerViewChild: ElementRef;

    container: HTMLDivElement;

    visible: boolean;

    documentClickListener: any;

    documentRightClickListener: any;
    rightClickListener: any;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer2) { }

    ngAfterViewInit() {
        this.container = <HTMLDivElement>this.containerViewChild.nativeElement;


        if (this.global) {
            this.documentRightClickListener = this.renderer.listen('document', 'contextmenu', (event: any) => {
                this.show(event);
                event.preventDefault();
            });
        } else if (this.target) {
            this.rightClickListener = this.renderer.listen(this.target, 'contextmenu', (event: any) => {
                this.show(event);
                event.preventDefault();
                event.stopPropagation();
            });
        }

        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                this.domHandler.appendChild(this.container, this.appendTo);
        }
    }

    detailData: any;
    show(event?: MouseEvent, data?: any) {
        this.detailData = data || {};
        this.position(event);
        this.visible = true;
        this.domHandler.fadeIn(this.container, 250);
        this.bindDocumentClickListener();

        if (event) {
            event.preventDefault();
        }
    }

    hide() {
        this.visible = false;
        this.unbindDocumentClickListener();
    }

    toggle(event?: MouseEvent, data?: any) {
        if (this.visible)
            this.hide();
        else
            this.show(event, data);
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

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', (event: any) => {
                if (this.visible && event.button !== 2) {
                    this.hide();
                }
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    ngOnDestroy() {
        this.unbindDocumentClickListener();

        if (this.rightClickListener) {
            this.rightClickListener();
        }

        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    }

}

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [ContextMenu],
    declarations: [ContextMenu, ContextMenuSub]
})
export class ContextMenuModule { }