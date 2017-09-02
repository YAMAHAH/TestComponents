import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
// import { UrlResolver } from '@angular/compiler';
import 'rxjs/add/observable/timer';
// let css: string = require('./news.css');

@Component({
    selector: 'auxnews',
    styleUrls: ['./news.css'],
    template: `
        <ul><li *ngFor = "let i of [1,2,3]">{{i}}</li></ul>
        <h2 style = "display:block">Aux news page for AOT {{test$ | async}}</h2>
    `
})
export class AuxNewsComponent implements OnInit {
    test$: Observable<number>;
    constructor(public activateRouter: ActivatedRoute) {
        this.test$ = Observable.timer(1000, 1000);
    }

    ngOnInit() {

    }
}

