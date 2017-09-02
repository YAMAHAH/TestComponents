import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
@Component({
    selector: 'staticnews',
    template: `
       <router-outlet></router-outlet>
    `
})
export class StaticNews1Component implements OnInit {

    constructor() {

    }

    ngOnInit() { }

}