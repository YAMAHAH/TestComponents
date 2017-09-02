import { NgModule, Component, ElementRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../common/api';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DomHandler } from '../../common/dom/domhandler';

@Component({
    selector: 'jy-tabMenu',
    templateUrl: './tabmenu.html',
    providers: [DomHandler]
})
export class TabMenu implements OnDestroy {

    @Input() model: MenuItem[];

    @Input() activeItem: MenuItem;

    @Input() popup: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    constructor(public router: Router) { }

    ngOnInit() {
        if (!this.activeItem && this.model && this.model.length) {
            this.activeItem = this.model[0];
        }
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

            item.eventEmitter.emit({
                originalEvent: event,
                item: item
            });
        }

        if (item.routerLink) {
            this.router.navigate(item.routerLink);
        }

        this.activeItem = item;
    }

    ngOnDestroy() {
        if (this.model) {
            for (let item of this.model) {
                this.unsubscribe(item);
            }
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

}

@NgModule({
    imports: [CommonModule],
    exports: [TabMenu],
    declarations: [TabMenu]
})
export class TabMenuModule { }