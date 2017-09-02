import { Component, OnInit, Input } from '@angular/core';
import { purList, purDetail } from './pur.component';
@Component({
    selector: 'x-pur-list',
    templateUrl: './pur.list.html',
    styles: [' .el-hide{display:none} .el-flex-show{ display:flex;flex:1 }']
})
export class PurListComponent implements OnInit {

    @Input() purList: purList;
    constructor() {
    }



    getClass(detail: purDetail) {
        return {
            "el-hide": !detail.active,
            "el-flex-show": detail.active
        }
    }



    ngOnInit() { }

}