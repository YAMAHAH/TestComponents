import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'homedetail',
    template: `
        <h2>Home detail page(bottom)</h2>
    `
})
export class HomeDetailComponent implements OnInit {
    constructor(public router: Router, public activetedRoute: ActivatedRoute) {
        // console.log(this.activetedRoute.url);
        // console.log(this.router);
        // console.log(this.activetedRoute);
    }

    ngOnInit() { }

}