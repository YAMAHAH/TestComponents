import { Component, OnInit, Input } from '@angular/core';


@Component({
    selector: 'x-pur-detail',
    template: `
       <p>{{detail.key}}</p>
    `
})
export class PurDetailComponent implements OnInit {

    @Input() detail: any;
    constructor() {

    }
    ngOnInit() { }

}