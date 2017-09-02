import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home/home.service';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'list',
    template: `
        <h2>list page</h2>
        <h2>list page</h2>
        <h2>list page</h2>
        <h2>list page</h2>
        <h2>list page</h2>
        <h2>report | async | json</h2>
         <router-outlet></router-outlet>
         listrouter
        <router-outlet name = "bottom"></router-outlet>
        listrouter
    `
})
export class ListComponent implements OnInit {
    constructor(private homeService: HomeService) { }
    report: Observable<any>;
    ngOnInit() {

        this.report = this.homeService.getReport(6,6);
    }

}