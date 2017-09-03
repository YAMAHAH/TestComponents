import { NgModule, Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, Renderer, HostListener, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../common/api';
import { Router } from '@angular/router';
import { DomHandler } from '../../common/dom/domhandler';

@Component({
    selector: 'x-menu',
    templateUrl: './menu.html',
    providers: [DomHandler],
    host: { '(window:resize)': 'onResize($event)' }
})
export class Menu implements AfterViewInit, OnDestroy {

    @Input() model: MenuItem[];

    @Input() popup: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() appendTo: any;

    @ViewChild('container') containerViewChild: ElementRef;

    container: HTMLDivElement;

    documentClickListener: any;

    preventDocumentDefault: any;

    onResizeTarget: any;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, public router: Router) { }

    ngAfterViewInit() {
        this.container = <HTMLDivElement>this.containerViewChild.nativeElement;

        if (this.popup) {
            if (this.appendTo) {
                if (this.appendTo === 'body')
                    document.body.appendChild(this.el.nativeElement);
                else
                    this.domHandler.appendChild(this.el.nativeElement, this.appendTo);
            }

            this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
                if (!this.preventDocumentDefault) {
                    this.hide();
                }
                this.preventDocumentDefault = false;
            });
        }
    }

    toggle(event: any) {
        if (this.container.offsetParent)
            this.hide();
        else
            this.show(event);

        this.preventDocumentDefault = true;
    }

    onResize(event: any) {
        if (this.onResizeTarget && this.container.offsetParent) {
            this.domHandler.absolutePosition(this.container, this.onResizeTarget);
        }
    }

    show(event: any) {
        let target = event.currentTarget;
        this.onResizeTarget = event.currentTarget;
        this.container.style.display = 'block';
        this.domHandler.absolutePosition(this.container, target);
        this.domHandler.fadeIn(this.container, 250);
    }

    hide() {
        this.container.style.display = 'none';
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

        if (this.popup) {
            this.hide();
        }

        if (item.routerLink) {
            this.router.navigate(item.routerLink);
        }
    }

    ngOnDestroy() {
        if (this.popup) {
            if (this.documentClickListener) {
                this.documentClickListener();
            }

            if (this.appendTo) {
                this.el.nativeElement.appendChild(this.container);
            }
        }

        if (this.model) {
            for (let item of this.model) {
                this.unsubscribe(item);
            }
        }
    }

    hasSubMenu(): boolean {
        if (this.model) {
            for (var item of this.model) {
                if (item.items) {
                    return true;
                }
            }
        }
        return false;
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
}

@NgModule({
    imports: [CommonModule],
    exports: [Menu],
    declarations: [Menu]
})
export class MenuModule { }