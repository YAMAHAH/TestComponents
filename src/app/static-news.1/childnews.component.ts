import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
@Component({
    selector: 'childnews',
    template: `
        <h2>ChildNewsComponent page {{test$ | async}}</h2>
    `
})
export class ChildNewsComponent implements OnInit {
    test$: Observable<number>;
    constructor() {
        this.test$ = Observable.timer(1000, 1000);
    }

    ngOnInit() { }

}