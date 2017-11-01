import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavTabModel } from './NavTabModel';

@Component({
    moduleId: module.id,
    selector: 'gx-nav-tab',
    templateUrl: 'nav-tab.component.html'
})
export class NavTabComponent implements OnInit, AfterViewInit {

    @ViewChild('tabtitle') titleEl: ElementRef;
    @ViewChild('tabfavicon') faviconEl: ElementRef;
    @Input() tabModel: NavTabModel;

    constructor() { }
    ngOnInit() { }
    ngAfterViewInit() {
        (this.titleEl.nativeElement as Element).textContent = this.tabModel.title;
        (this.faviconEl.nativeElement as HTMLStyleElement).style.backgroundImage = `url('${this.tabModel.favicon}')`;
    }

}