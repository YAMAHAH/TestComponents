import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'x-iframe',
    templateUrl: 'iframe.component.html',
    styleUrls: ['iframe.component.css']
})
export class IframeComponent {
    @Input() src: string;

}
