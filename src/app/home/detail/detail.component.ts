import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'detail',
    template: `
        <h2>detail page</h2>
    `
})
export class DetailComponent implements OnInit {
    constructor(public router: Router, public activetedRoute: ActivatedRoute) {
        // console.log(this.activetedRoute.url);
        // console.log(this.router);
        // console.log(this.activetedRoute);
    }

    ngOnInit() { }

}