import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'menu-item',
    templateUrl: 'menu-item.component.html',
    styleUrls: ['menu-item.component.scss']
})
export class MenuItemComponent {

    @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();

    onItemClick(event: any) {

    }
}
