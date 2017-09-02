import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'childnews',
    template: `
        {{paraId}}
        <h2>ChildNewsComponent page {{test$ | async}}</h2>
    `
})
export class ChildNewsComponent implements OnInit {
    test$: Observable<number>;
    paraId: string;
    constructor(private activeRoute: ActivatedRoute) {
        this.test$ = Observable.timer(1000, 1000);
    }

    ngOnInit() {
        this.activeRoute
            .params
            .map(p => p['id'])
            .subscribe(url => {
                if (url) this.paraId = decodeURIComponent(url);
            });
    }

}