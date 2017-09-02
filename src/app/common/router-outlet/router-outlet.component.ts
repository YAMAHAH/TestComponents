import {
    Component, AfterViewInit, OnInit, Input, ViewChild, OnDestroy, Output,
    EventEmitter, ChangeDetectorRef, ComponentFactoryResolver,
    ViewContainerRef
} from '@angular/core';
import { RouterOutlet, Router, ChildrenOutletContexts, OutletContext } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'x-router-outlet',
    templateUrl: 'router-outlet.component.html',
    styleUrls: ['router-outlet.component.css']
})
export class RouterOutletComponent implements AfterViewInit, OnInit, OnDestroy {
    @Input('name') outletName: string = "primary";

    @ViewChild("portal") mainOutlet: RouterOutlet;

    OnActivate: (event?: any, args?: any[]) => void = (event: any) => {
        if (event && event.childRouterOutlet$) {
            event.childRouterOutlet$.subscribe(this.activate);
        } else {
            this.activate.next(event);
        }
    };
    OnDeActivate: (event?: any, args?: any[]) => void = (event: any) => {
        if (event && event.childRouterOutlet$) {
            event.childRouterOutlet$.subscribe(this.activate);
        } else {
            this.activate.next(event);
        }
    };
    @Output() activate: EventEmitter<any> = new EventEmitter<any>();
    @Output() deactivate: EventEmitter<any> = new EventEmitter<any>();
    private auxOutlet: RouterOutlet;
    isMain: boolean;
    constructor(
        private parentContext: ChildrenOutletContexts,
        private location: ViewContainerRef,
        private resolver: ComponentFactoryResolver,
        private changeDetector: ChangeDetectorRef) { }

    private isBlank(outletName: string) {
        return outletName === null || outletName === "" || outletName === undefined
    }
    ngOnInit() {
        if (this.isBlank(this.outletName) || this.outletName === 'primary') {
            this.isMain = true;
        } else {
            this.isMain = false;
            this.auxOutlet = new RouterOutlet(
                this.parentContext,
                this.location,
                this.resolver,
                this.outletName,
                this.changeDetector);
        }
    }


    ngAfterViewInit() {
        if (!this.isMain) {
            this.parentContext && this.parentContext.onChildOutletCreated(this.outletName, this.auxOutlet);
        } else {
            if (this.mainOutlet) {
                this.parentContext && this.parentContext.onChildOutletCreated('primary', this.mainOutlet);
                if (this.mainOutlet['name'] === null) {
                    this.mainOutlet['name'] = this.outletName || 'primary';
                }
            }
        }
    }
    ngOnDestroy() {
        if (this.parentContext) {
            //只清除outlet,其它信息还在
            this.parentContext.onChildOutletDestroyed(this.outletName);
        }
    }
}
