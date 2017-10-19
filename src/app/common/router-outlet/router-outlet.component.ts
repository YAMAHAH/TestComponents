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

    @ViewChild("portal", { read: RouterOutlet }) mainOutlet: RouterOutlet;

    onActivate(event: any) {
        if (event && event.childRouterOutlet$) {
            event.childRouterOutlet$.subscribe(this.activate);
        } else {
            this.activate.next(event);
        }
    }
    onDeActivate(event: any) {
        if (event && event.childRouterOutlet$) {
            event.childRouterOutlet$.subscribe(this.activate);
        } else {
            this.activate.next(event);
        }
    }
    @Output() activate: EventEmitter<any> = new EventEmitter<any>();
    @Output() deactivate: EventEmitter<any> = new EventEmitter<any>();
    private auxOutlet: RouterOutlet;
    isMain: boolean;
    constructor(
        private parentContexts: ChildrenOutletContexts,
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
                this.parentContexts,
                this.location,
                this.resolver,
                this.outletName,
                this.changeDetector);
            //以下代码可以不要
            if (!this.auxOutlet.isActivated) {
                // If the outlet was not instantiated at the time the route got activated we need to populate
                // the outlet when it is initialized (ie inside a NgIf)
                const context = this.parentContexts.getContext(this.outletName);
                if (context && context.route) {
                    if (context.attachRef) {
                        // `attachRef` is populated when there is an existing component to mount
                        this.auxOutlet.attach(context.attachRef, context.route);
                    } else {
                        // otherwise the component defined in the configuration is created
                        this.auxOutlet.activateWith(context.route, context.resolver || null);
                    }
                }
            }
        }
    }


    ngAfterViewInit() {
        if (!this.isMain) {
            this.parentContexts && this.parentContexts.onChildOutletCreated(this.outletName, this.auxOutlet);
        } else {
            if (this.mainOutlet) {
                this.parentContexts && this.parentContexts.onChildOutletCreated('primary', this.mainOutlet);
                if (this.mainOutlet['name'] === null) {
                    this.mainOutlet['name'] = this.outletName || 'primary';
                }
            }
        }
    }
    ngOnDestroy() {
        if (this.parentContexts) {
            //只清除outlet,其它信息还在
            this.parentContexts.onChildOutletDestroyed(this.outletName);
        }
    }
}
