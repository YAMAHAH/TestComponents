import { NgModule, Component, ElementRef, Input, Output, EventEmitter, HostListener, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockableUI } from '../common/api';
import { TabPanel } from './tabPanel';
import { TabViewNav } from './tabViewNav';

@Component({
    selector: 'x-tabView',
    templateUrl: './tabView.html',
})
export class TabView implements AfterContentInit, BlockableUI {

    @Input('orientation') navOrientation: string = 'top';

    @Input() style: any;

    @Input() styleClass: string;

    @Input() controlClose: boolean;

    @Input() lazy: boolean;

    @ContentChildren(TabPanel) tabPanels: QueryList<TabPanel>;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @Output() onClose: EventEmitter<any> = new EventEmitter();

    initialized: boolean;

    tabModels: TabPanel[];

    constructor(public el: ElementRef) { }

    ngAfterContentInit() {
        this.initTabs();

        this.tabPanels.changes.subscribe(_ => {
            this.initTabs();
        });
    }

    initTabs(): void {
        this.tabModels = this.tabPanels.toArray();
        for (let tab of this.tabModels) {
            tab.lazy = this.lazy;
        }

        let selectedTab: TabPanel = this.findSelectedTab();
        if (!selectedTab && this.tabModels.length) {
            this.tabModels[0].selected = true;
        }
    }

    open(event: Event, tab: TabPanel) {
        if (tab.disabled) {
            event.preventDefault();
            return;
        }

        if (!tab.selected) {
            let selectedTab: TabPanel = this.findSelectedTab();
            if (selectedTab) {
                selectedTab.selected = false
            }
            tab.selected = true;
            this.onChange.emit({ originalEvent: event, index: this.findTabIndex(tab) });
        }
        event.preventDefault();
    }

    close(event: Event, tab: TabPanel) {
        if (this.controlClose) {
            this.onClose.emit({
                originalEvent: event,
                index: this.findTabIndex(tab),
                close: () => {
                    this.closeTab(tab);
                }
            }
            );
        }
        else {
            this.closeTab(tab);
            this.onClose.emit({
                originalEvent: event,
                index: this.findTabIndex(tab)
            });
        }

        event.stopPropagation();
    }

    closeTab(tab: TabPanel) {
        if (tab.selected) {
            tab.selected = false;
            for (let i = 0; i < this.tabModels.length; i++) {
                let tabPanel = this.tabModels[i];
                if (!tabPanel.closed && !tab.disabled) {
                    tabPanel.selected = true;
                    break;
                }
            }
        }

        tab.closed = true;
    }

    findSelectedTab() {
        for (let i = 0; i < this.tabModels.length; i++) {
            if (this.tabModels[i].selected) {
                return this.tabModels[i];
            }
        }
        return null;
    }

    findTabIndex(tab: TabPanel) {
        let index = -1;
        for (let i = 0; i < this.tabModels.length; i++) {
            if (this.tabModels[i] == tab) {
                index = i;
                break;
            }
        }
        return index;
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }
}


@NgModule({
    imports: [CommonModule],
    exports: [TabView, TabPanel, TabViewNav],
    declarations: [TabView, TabPanel, TabViewNav]
})
export class TabViewModule { }