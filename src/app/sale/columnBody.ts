import { Component, OnInit, ContentChildren, QueryList, ViewChildren } from '@angular/core';
import { PrimeTemplate } from "../common/shared/shared";

@Component({
    moduleId: module.id,
    selector: 'columnbody',
    template: `
     <span [style.color]="rowData[col.field]">{{rowData[col.field]}}</span>
    `
})
export class ColumnBodyComponent implements OnInit {
    //  <ng-template let-col let-car="rowData" pTemplate="body">
    //         <span [style.color]="car[col.field]">{{car[col.field]}}</span>
    //     </ng-template>
    col: any = { field: '' };
    rowData: any ;
    rowIndex: any;
    // @ViewChildren(PrimeTemplate) templates: QueryList<any>;
    constructor() { }

    ngOnInit() {
    }

}