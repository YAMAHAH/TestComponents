import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DesktopItem } from '../../../Models/desktop-Item';

@Component({
    selector: 'x-desktop-item',
    templateUrl: 'desktop-item.component.html',
    styleUrls: ['desktop-item.component.css']
})
export class DesktopItemComponent {

    @Output() ItemClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() ItemDoubleClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() item: DesktopItem;
    onClick(event: Event, item: any) {
        this.ItemClick.emit({ event, item });
    }

    onDblClick(event: Event, item: any) {
        this.ItemDoubleClick.emit({ event, item });
    }

}
