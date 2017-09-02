import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DesktopItem } from '../../Models/desktop-Item';


@Component({
    selector: 'x-pc-index',
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.css']
})
export class IndexComponent implements OnDestroy {
    ngOnDestroy(): void {
        // this.childRouterOutlet$.unsubscribe();
        // this.instances.splice(0, this.instances.length);
    }

    constructor() {
    }
    childRouterOutlet$: EventEmitter<any> = new EventEmitter<any>();

    instances: any[] = [];
    OnActivate(event: any) {
        this.instances.push(event);
        this.childRouterOutlet$.next(event);
    }
    OnDeActivate(event: any) {
        this.childRouterOutlet$.next(event);
        this.instances.splice(0, this.instances.length);
    }
}
