import {
    Component, AfterViewInit, OnInit, Input, ViewChild, OnDestroy, Output,
    EventEmitter, ChangeDetectorRef, ComponentFactoryResolver,
    ViewContainerRef
} from '@angular/core';
import { RouterOutlet, Router, ChildrenOutletContexts, OutletContext } from '@angular/router';
import { Directive, Attribute } from '@angular/core';

@Directive({
    selector: 'x-router-outlet',
})
export class RouterOutletEx extends RouterOutlet implements AfterViewInit, OnInit, OnDestroy {
    @Input('name') outletName: string = "primary";
    private auxOutlet: RouterOutlet;
    isMain: boolean;
    constructor(
        private parentContext: ChildrenOutletContexts,
        private location2: ViewContainerRef,
        private resolver2: ComponentFactoryResolver,
        @Attribute('name') name: string,
        private changeDetector2: ChangeDetectorRef
    ) {
        super(parentContext, location2, resolver2, name, changeDetector2);
        this.outletName = name || "primary";
    }

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
                this.location2,
                this.resolver2,
                this.outletName,
                this.changeDetector2);
        }
    }


    ngAfterViewInit() {
        if (!this.isMain) {
            this.parentContext && this.parentContext.onChildOutletCreated(this.outletName, this.auxOutlet);
        } else {
            // if (this.mainOutlet) {
            //     this.parentContext && this.parentContext.onChildOutletCreated('primary', this.mainOutlet);
            //     if (this.mainOutlet['name'] === null) {
            //         this.mainOutlet['name'] = this.outletName || 'primary';
            //     }
            // }
        }
    }
    ngOnDestroy() {
        if (this.parentContext) {
            //只清除outlet,其它信息还在
            this.parentContext.onChildOutletDestroyed(this.outletName);
        }
    }
}
