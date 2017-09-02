import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CanComponentDeactivate } from './Icomponent-deactivate';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    constructor() { }
    canDeactivate(component: CanComponentDeactivate) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }
}