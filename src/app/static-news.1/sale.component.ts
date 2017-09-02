import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
@Component({
    selector: 'x-sale',
    template: `
       <p>客户订单组件</p>
    `
})
export class SaleComponent implements OnInit {
    test$: Observable<number>;
    constructor() {
        this.test$ = Observable.timer(1000, 1000).take(3);
    }
    // <h2>StaticNews.1 page for Jit {{test$ | async}}</h2>
    ngOnInit() { }

}