import { NgModule, Component, ElementRef, AfterViewInit, OnDestroy, Input, Output, Renderer, EventEmitter, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../common/api';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DomHandler } from '../../common/dom/domhandler';
import { TieredMenuSub } from './tieredMenuSub';



@Component({
    selector: 'x-tieredMenu',
    templateUrl:"./tieredmenu.html",
    providers: [DomHandler]
})
export class TieredMenu implements AfterViewInit, OnDestroy {

    @Input() model: MenuItem[];

    @Input() popup: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    container: any;

    documentClickListener: any;

    preventDocumentDefault: any;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer2) { }

    ngAfterViewInit() {
        this.container = this.el.nativeElement.children[0];

        if (this.popup) {
            this.documentClickListener = this.renderer.listen('body', 'click', () => {
                if (!this.preventDocumentDefault) {
                    this.hide();
                }
                this.preventDocumentDefault = false;
            });
        }
    }

    toggle(event: Event) {
        if (this.container.offsetParent)
            this.hide();
        else
            this.show(event);


    }

    show(event: Event) {
        this.preventDocumentDefault = true;
        this.container.style.display = 'block';
        this.domHandler.absolutePosition(this.container, event.target);
        this.domHandler.fadeIn(this.container, 250);
    }

    hide() {
        this.container.style.display = 'none';
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
        if (this.popup && this.documentClickListener) {
            this.documentClickListener();
        }

        if (this.model) {
            for (let item of this.model) {
                this.unsubscribe(item);
            }
        }
    }

}

@NgModule({
    imports: [CommonModule],
    exports: [TieredMenu],
    declarations: [TieredMenu, TieredMenuSub]
})
export class TieredMenuModule { }
