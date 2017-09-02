import { Component } from '@angular/core';
import { OnInit, ElementRef, NgModule } from '@angular/core';

// import * as d3 from 'd3';
import { select } from 'd3';

@Component({
    selector: 'd3-demo',
    template: ''
})
export class D3DemoComponent implements OnInit {
    constructor(private _elRef: ElementRef) {

    }

    ngOnInit() {
        console.log(this._elRef);
        let test = select(this._elRef.nativeElement);
        test.
            append('div')
            .html('d3 生成')
            .style("background-color", "#1be2a6")
    }

}
