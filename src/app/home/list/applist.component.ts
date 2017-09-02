import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'applist',
    template: `
        <h2>App list page</h2>
         <router-outlet></router-outlet>
        <router-outlet name = "bottom"></router-outlet>
    `
})
export class AppListComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}