import { Component, Input } from '@angular/core';

@Component({
    selector: 'x-desktop-layout-container',
    templateUrl: 'desktop-layout-container.html',
    styleUrls: ['desktop-layout-container.css']
})
export class DesktopLayoutContainerComponent {
    @Input() width: string = "20px";
    @Input() height: string = "20px";

}
