import { Component, OnInit, Directive, AfterViewInit, AfterContentInit, ViewContainerRef } from '@angular/core';
import { AppStoreService } from './services/app.store.service';
import { XYZUIConfig } from './common/rebirth-ui.config';

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
  constructor(private appStateService: AppStoreService,
    private rebirthConfig: XYZUIConfig,
    private viewContainerRef: ViewContainerRef) {
    // if (["localhost", "127.0.0.1"].findIndex(h => h == location.hostname) > -1) {
    //   this.appStateService.host = "http://" + location.host;
    // } else {
    //   this.appStateService.host = "http://" + location.host; //"http://192.168.10.233:5000";
    // }
    this.appStateService.host = "http://" + location.hostname + ":" + '5000';

    this.rebirthConfig.rootContainer = this.viewContainerRef;
  }


  ngOnInit() {

  }
}
