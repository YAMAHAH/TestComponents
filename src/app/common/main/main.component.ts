import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'x-main',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {
    constructor(private router: Router, private elementRef: ElementRef) {
        console.log(this.router);
    }
    ngOnInit() { }
    ngAfterViewInit() {
        this.setupStyleEl();
    }
    animationStyleEl: HTMLStyleElement;
    setupStyleEl() {
        this.animationStyleEl = document.createElement('style');
        let styleHTML = `
            x-main {
                display:flex;
                flex:1;
                height:100%;
            }
        `;
        this.animationStyleEl.innerHTML = styleHTML;
        (this.elementRef.nativeElement as Element).appendChild(this.animationStyleEl);
    }
}
