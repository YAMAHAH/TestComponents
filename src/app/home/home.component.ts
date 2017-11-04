import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { Router } from '@angular/router';
import { PageLoadingService } from '../common/page-loading';
import { LoadScriptService } from '../services/load-script-service';
//let Snap = require("snapsvg");
//let Draggabilly = require('draggabilly');
let Snap: any;
@Component({
    selector: 'home',
    template: `
        <h2>home page{{test$ | async }}</h2>
        <button (click)="pageLoadService.showPageLoading(2)">svgAnimate</button>
        <app-title subtitle="HomeAOTModule"></app-title>
        <router-outlet></router-outlet>
        <router-outlet name = "bottom"></router-outlet>
    `
})
export class HomeComponent implements OnInit, AfterViewInit {
    test$: Observable<number>;
    constructor(private router: Router,
        public pageLoadService: PageLoadingService,
        private loadScriptService: LoadScriptService
    ) {
        this.test$ = Observable.timer(1000, 1000);
    }

    ngOnInit() { }

    ngAfterViewInit() {
        // this.loadScriptService
        //     .loadSnapSvg
        //     .then(snap => {
        //         this.clock();
        //     });
    }

    clock() {
        var s = Snap(600, 600);
        var path = "",
            nums = s.text(300, 300, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
                .attr({
                    font: "300 40px Helvetica Neue",
                    textAnchor: "middle"
                });

        for (var i = 0; i < 72; i++) {
            var r = i % 6 ? i % 3 ? 247 : 240 : 230,
                sin = Math.sin(Snap.rad(5 * i)),
                cos = Math.cos(Snap.rad(5 * i));
            path += "M" + [300 + 250 * cos, 300 + 250 * sin] + "L" + [300 + r * cos, 300 + r * sin];
            if (!(i % 6)) {
                let str = "tspan:nth-child(" + (i / 6 + 1) + ")";
                nums.select(str)
                    .attr({
                        x: 300 + 200 * Math.cos(Snap.rad(5 * i - 60)),
                        y: 300 + 200 * Math.sin(Snap.rad(5 * i - 60)) + 15,
                    });
            }
        }
        var table = s.g([nums, s.path(path).attr({
            fill: "none",
            stroke: "#000",
            strokeWidth: 2
        })]).attr({
            transform: "t0,210"
        });
        s.g(table).attr({
            clip: s.circle(300, 300, 100)
        });
        var hand = s.line(300, 200, 300, 400).attr({
            fill: "none",
            stroke: "#f63",
            strokeWidth: 2
        });
        s.circle(300, 300, 100).attr({
            stroke: "#000",
            strokeWidth: 10,
            fillOpacity: 0
        }).click(function () {
            Snap.animate(0, 360, function (val: number) {
                table.transform("t" +
                    [
                        210 * Math.cos(Snap.rad(val + 90)),
                        210 * Math.sin(Snap.rad(val + 90))
                    ]);
                hand.transform("r" + [val, 300, 300]);
            }, 12000);
        });
    }
}