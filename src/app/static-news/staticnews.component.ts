import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { Router } from '@angular/router';
@Component({
    selector: 'staticnews',
    template: `
        <div style="display:flex;flex:1;height:100%;">
            <x-chrome-tabs style="display:flex;flex:1"></x-chrome-tabs>
        </div>
       
        <x-router-outlet></x-router-outlet>
        <x-router-outlet name='test'></x-router-outlet>
        <x-router-outlet name='bottom'></x-router-outlet>
    `
})
export class StaticNewsComponent implements OnInit {
    // test$: Observable<number>; <router-outlet></router-outlet><x-chrome-tabs style="width:750px;"></x-chrome-tabs>
    constructor(private router: Router, private elementRef: ElementRef) {
        // this.test$ = Observable.timer(1000, 1000);<x-chrome-tabs style="flex:0 ;width:750px;"></x-chrome-tabs>
        // console.log(this.router);
    }

    //   <div style="display:flex;" >
    //         <x-nav-tree-view></x-nav-tree-view>
    //         <x-nav-tree-view2 style="display:none;"></x-nav-tree-view2>
    //         <div style="display:flex;flex-direction:column; justify-content: space-between">
    //             <nav-dropdown-menu ></nav-dropdown-menu>
    //             <x-nav-menu></x-nav-menu>
    //         </div>
    //     </div>
    //<h2>StaticNews page for Jit {{test$ | async}}</h2>
    ngOnInit() { }
    ngAfterViewInit() {
        this.setupStyleEl();
    }
    animationStyleEl: HTMLStyleElement;
    setupStyleEl() {
        this.animationStyleEl = document.createElement('style');
        let styleHTML = `
            staticnews {
                display:flex;
                height:100%;
            }
        `;
        this.animationStyleEl.innerHTML = styleHTML;
        (this.elementRef.nativeElement as Element).appendChild(this.animationStyleEl);
    }

}