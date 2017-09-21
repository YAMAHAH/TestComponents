import { Component, OnInit, Directive, AfterViewInit, AfterContentInit, ViewContainerRef, EventEmitter } from '@angular/core';
import { AppStoreService } from './services/app.store.service';
import { XYZUIConfig } from './common/rebirth-ui.config';
import { Router, ActivatedRoute, NavigationEnd, RoutesRecognized, Data } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { Observable } from 'rxjs/Rx';

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
export class AppComponent implements OnInit {
    name = 'Angular App';
    constructor(private appStoreService: AppStoreService,
        private rebirthConfig: XYZUIConfig,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title
    ) {
        // if (["localhost", "127.0.0.1"].findIndex(h => h == location.hostname) > -1) {
        //   this.appStateService.host = "http://" + location.host;
        // } else {
        //   this.appStateService.host = "http://" + location.host; //"http://192.168.10.233:5000";
        // }
        this.appStoreService.host = "http://" + location.hostname + ":" + '5000';

        this.rebirthConfig.rootContainer = this.viewContainerRef;
    }

    titleData: string[] = [];
    runOne: boolean = false;
    ngOnInit() {
        let tempData: string[] = [];
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map((event: NavigationEnd) => {
                tempData = [];
                this.runOne = false;
                return this.router.routerState.root.firstChild;
            })
            .flatMap(route => {
                let routes: ActivatedRoute[] = [];
                route.children.forEach(c => {
                    let childRoute = c;
                    while (childRoute.firstChild) {
                        childRoute = childRoute.firstChild;
                    };
                    routes.push(childRoute);
                });
                if (route.children.length < 0) routes.push(route);
                return routes;
            })
            .mergeMap(route => {
                return route.data;
            })
            .scan((acc, data) => {
                let title = data.title;
                if (title) {
                    tempData.push(title);
                    let notTitle = this.titleData.indexOf(title) < 0;
                    if (notTitle) {
                        acc = title
                    } else if (!notTitle && !this.runOne) {
                        this.runOne = true;
                        if (this.titleData.length > 2)
                            acc = this.titleData[this.titleData.length - 2];
                        else
                            acc = this.titleData[0];
                    }
                }
                return acc;
            }, '')
            .subscribe(data => {
                debugger;
                console.log(data);
                // let title = data.title;
                this.titleService.setTitle(data);
                this.titleData = [];
                this.titleData.push(...tempData);
                // if (title) {
                //     let notTitle = this.titleData.indexOf(title) < 0;
                //     if (notTitle) {
                //         this.titleService.setTitle(title);
                //         this.titleData = tempData;
                //     } else if (!notTitle && !this.runOne) {

                //         if (this.titleData.length > 2)
                //             this.titleService.setTitle(this.titleData[this.titleData.length - 2]);
                //         else
                //             this.titleService.setTitle(this.titleData[0]);
                //         this.runOne = true;
                //     } else if (title == tempData[tempData.length - 1]) {
                //         this.titleData = tempData;
                //         console.log(this.titleData);
                //         console.log(tempData);
                //     }
                // }
            });
    }


}
