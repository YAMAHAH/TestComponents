import { Component, OnInit, ContentChildren, QueryList, ViewChildren } from '@angular/core';
import { PrimeTemplate } from "../common/shared/shared";

@Component({
    moduleId: module.id,
    selector: 'datecolumnbody',
    template: `
     <span>{{rowData[col.field]}}年</span>
       
    `
})
export class DateColumnBodyComponent implements OnInit {
    col: any;
    rowData: any;
    rowIndex: any;
    // @ViewChildren(PrimeTemplate) templates: QueryList<any>;
    constructor() { }

    ngOnInit() {
    }

}