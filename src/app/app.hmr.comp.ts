import { Component, OnInit, Directive, AfterViewInit, AfterContentInit, ViewContainerRef, EventEmitter } from '@angular/core';
import { AppStoreService } from './services/app.store.service';
import { XYZUIConfig } from './common/rebirth-ui.config';
import { Router, ActivatedRoute, NavigationEnd, RoutesRecognized, Data, ActivatedRouteSnapshot } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { Observable } from 'rxjs/Rx';
import { toArray } from 'rxjs/Operators';
import { HTMLElementExtendService } from './untils/html-element-extend';



let style = require("../../styles.css");
require("./news/news.scss");
require("./app.scss");

@Component({
    selector: 'my-app',
    styleUrls: ['./app.component.css'],
    template: `
    <x-pageloading globalLoad='true'></x-pageloading>
    <router-outlet></router-outlet>
  `
})
export class AppHmrComponent implements OnInit {
    name = 'Angular App';
    constructor(private appStoreService: AppStoreService,
        private rebirthConfig: XYZUIConfig,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
        private titleService: Title,
        private htmlElementService: HTMLElementExtendService
    ) {
        this.htmlElementService.initConfig(HTMLElement.prototype);

        // if (["localhost", "127.0.0.1"].findIndex(h => h == location.hostname) > -1) {
        //   this.appStateService.host = "http://" + location.host;
        // } else {
        //   this.appStateService.host = "http://" + location.host; //"http://192.168.10.233:5000";
        // }
        this.appStoreService.host = "http://" + location.hostname + ":" + '5000';

        this.rebirthConfig.rootContainer = this.viewContainerRef;
    }

    existTitles: string[] = [];
    runOne: boolean = false;
    ngOnInit() {
        //setTimeout(() => this.appStoreService.rightSubject$.next({ objectId: "div9sdfddf596", templateId: "" }), 10000); //39423742047204234234
        let tempData: string[] = [];
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map((event: NavigationEnd) => {
                return { eventId: event.id, curRouteState: this.router.routerState.root.firstChild };
            })
            .flatMap(eventInfo => {
                let routeStates: ActivatedRouteSnapshot[] = [];
                eventInfo.curRouteState.children.forEach(c => {
                    let childRoute = c;
                    while (childRoute.firstChild) {
                        childRoute = childRoute.firstChild;
                    };
                    routeStates.push(childRoute.snapshot);
                });
                if (eventInfo.curRouteState.children.length < 0)
                    routeStates.push(eventInfo.curRouteState.snapshot);
                return [{ eventId: eventInfo.eventId, routeStates: routeStates }];
            })
            .subscribe(data => {
                let lastestTitles: string[] = data.routeStates
                    .filter(routeState => !!routeState.data.title)
                    .map(state => state.data.title);
                let addTitles = lastestTitles.exceptWith(this.existTitles);  //ArrayExtend.except(this.existTitles, lastestTitles);
                this.existTitles = [];
                this.existTitles.push(...lastestTitles);
                if (addTitles.length > 0)
                    this.titleService.setTitle(addTitles[0]);
                else if (this.existTitles.length > 0)
                    this.titleService.setTitle(this.existTitles[this.existTitles.length - 1]);
            });
    }
}
