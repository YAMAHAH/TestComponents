import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'appdetail',
    template: `
        <h2>Appdetail page</h2>
    `
})
export class AppDetailComponent implements OnInit {
    constructor(public router: Router, public activetedRoute: ActivatedRoute) {
        console.log(this.activetedRoute.url);
        console.log(this.router);
        console.log(this.activetedRoute);
    }

    ngOnInit() { }

}