import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[ad-host]'
})

export class HostViewContainerDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}