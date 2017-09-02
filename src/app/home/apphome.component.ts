import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
@Component({
    selector: 'apphome',
    template: `
        <h2>Apphome page{{test$ | async }}</h2>
        <router-outlet></router-outlet>
    <router-outlet name = "bottom"></router-outlet>
    `
})
export class AppHomeComponent implements OnInit {
    test$: Observable<number>;
    constructor() {
        this.test$ = Observable.timer(1000, 1000);
    }

    ngOnInit() { }

}