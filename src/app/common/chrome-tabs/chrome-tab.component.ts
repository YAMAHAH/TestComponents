import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { TabModel } from './chrome-tabs.component';

@Component({
    moduleId: module.id,
    selector: 'x-chrome-tab',
    templateUrl: 'chrome-tab.component.html',
    styleUrls: ['chrome-tab.css']
})
export class ChromeTabComponent implements OnInit, AfterViewInit {

    @ViewChild('tabtitle') titleEl: ElementRef;
    @ViewChild('tabfavicon') faviconEl: ElementRef;
    @Input() tabModel: TabModel;

    constructor() { }
    ngOnInit() { }
    ngAfterViewInit() {
        (this.titleEl.nativeElement as Element).textContent = this.tabModel.title;
        (this.faviconEl.nativeElement as HTMLStyleElement).style.backgroundImage = `url('${this.tabModel.favicon}')`;
    }
}