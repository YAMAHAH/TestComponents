import { Component, OnInit, ContentChildren, QueryList, ViewChildren } from '@angular/core';
import { PrimeTemplate } from "../common/shared/shared";
import { SelectItem } from '../components/common/api';

@Component({
    moduleId: module.id,
    selector: 'cellEditor',
    template: `
           <jy-dropdown [(ngModel)]="rowData[col.field]" [options]="brands" [autoWidth]="false" [style]="{'width':'100%'}" required="true"></jy-dropdown>
    `
})
export class CellEditorComponent implements OnInit {
    // <jy-dropdown [(ngModel)]="rowData[col.field]" [options]="brands" [autoWidth]="false" [style]="{'width':'100%'}" required="true"></jy-dropdown> <jy-calendar [(ngModel)]="rowData[col.field]"></jy-calendar>(keydown)="dt.onCellEditorKeydown($event, col, rowData, colIndex)" <input type="text" jyInputText [(ngModel)]="rowData[col.field]" required="true"  /> 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'
    brands: SelectItem[] = [
        { label: 'Audi', value: 'Audi' },
        { label: 'BMW', value: 'BMW' },
        { label: 'Fiat', value: 'Fiat' },
        { label: 'Ford', value: 'Ford' },
        { label: 'Honda', value: 'Honda' },
        { label: 'Jaguar', value: 'Jaguar' },
        { label: 'Mercedes', value: 'Mercedes' },
        { label: 'Renault', value: 'Renault' },
        { label: 'Volvo', value: 'Volvo' },
        { label: 'VW', value: 'VW' }
    ];
    col: any = { field: '' };
    rowData: any;
    rowIndex: any;

    constructor() { }

    ngOnInit() {

    }

}