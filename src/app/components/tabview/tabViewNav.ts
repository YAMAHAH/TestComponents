import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TabPanel } from './tabPanel';
@Component({
    selector: '[p-tabViewNav]',
    host: {
        '[class.ui-tabview-nav]': 'true',
        '[class.ui-helper-reset]': 'true',
        '[class.ui-helper-clearfix]': 'true',
        '[class.ui-widget-header]': 'true',
        '[class.ui-corner-all]': 'true'
    },
    templateUrl: './tabVIewNav.html'
})
export class TabViewNav {

    @Input() tabs: TabPanel[];

    @Input() orientation: string = 'top';

    @Output() onTabClick: EventEmitter<any> = new EventEmitter();

    @Output() onTabCloseClick: EventEmitter<any> = new EventEmitter();

    getDefaultHeaderClass(tab: TabPanel) {
        let styleClass = 'ui-state-default ui-corner-' + this.orientation;
        if (tab.headerStyleClass) {
            styleClass = styleClass + " " + tab.headerStyleClass;
        }
        return styleClass;
    }

    clickTab(event: any, tab: TabPanel) {
        this.onTabClick.emit({
            originalEvent: event,
            tab: tab
        })
    }

    clickClose(event: any, tab: TabPanel) {
        this.onTabCloseClick.emit({
            originalEvent: event,
            tab: tab
        })
    }
}
