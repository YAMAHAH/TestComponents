import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { AdItem } from './ad-item';
import { HostViewContainerDirective } from './ad.directive';

@Component({
    selector: 'ad-banner',
    template: `
        <div>
            <h3>你的生活,你作主</h3>
            <ng-template ad-host></ng-template>          
        </div>
    `
})

export class AdBannerComponent implements AfterViewInit, OnDestroy {
    interval: any;
    @Input() ads: AdItem[];
    currentAddIndex: number = -1;
    @ViewChild(HostViewContainerDirective) adHost: HostViewContainerDirective;

    constructor(private _componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef) { }

    ngAfterViewInit() {

        this.loadComponent();
        this.getAds();
    }

    loadComponent() {

        this.currentAddIndex = (this.currentAddIndex + 1) % this.ads.length;

        let adItem = this.ads[this.currentAddIndex];

        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(adItem.component);

        let viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        componentRef.instance.data = adItem.data;
        this.changeDetectorRef.detectChanges();
    }

    getAds() {
        this.interval = setInterval(() => {
            this.loadComponent();
        }, 3000);
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }
}