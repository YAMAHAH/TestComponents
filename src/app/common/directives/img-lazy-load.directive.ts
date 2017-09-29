import { Directive, Input, ElementRef, OnChanges, SimpleChanges, Renderer2, AfterViewInit, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

type eventType = "click" | "mouseOver" | "scroll";
type effectType = "show" | "fadeIn" | "slideDown";

@Directive({
    selector: '[imgLazyLoad]'
})
export class ImageLazyLoadDirective implements OnChanges, AfterViewInit, OnInit {

    @Input() effect: effectType = "show";
    @Input() event: eventType = "scroll";
    @Input() threshold: number = 180;
    @Input() container: HTMLElement = document.body;
    @Input("imgLazyLoad") originalUrl: string;
    @Input() skip_invisible: boolean;
    @Input() failure_limit: number;
    @Input() preLoad: boolean = false;
    constructor(private element: ElementRef, private renderer: Renderer2) {

    }
    unSubscriber: Subscription;
    ngOnChanges(changes: SimpleChanges) {
        if (!this.loaded) {
            if (this.unSubscriber) this.unSubscriber.unsubscribe();
            let eventStream$;
            if (this.event == "scroll") {
                eventStream$ = Observable.fromEvent(this.container, "scroll");
            }
            else if (this.event == 'click')
                eventStream$ = Observable.fromEvent(this.element.nativeElement, "click");
            else if (this.event == 'mouseOver')
                eventStream$ = Observable.fromEvent(this.element.nativeElement, "mouseover");
            if (eventStream$)
                this.unSubscriber = eventStream$.subscribe(res => this.check());
        }
    }
    ngOnInit(): void {
        this.preLoadImage(this.originalUrl);
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.event == "scroll") {
                this.check();
            }
        }, 20);
    }
    private loaded: boolean = false;
    loadIamge() {
        if (!this.loaded) {
            if (this.target instanceof HTMLImageElement) {
                this.renderer.setAttribute(this.element.nativeElement, "src", this.originalUrl);
            } else {
                this.renderer.setStyle(this.target, "background-image", 'url(' + this.originalUrl + ')');
            }
            this.loaded = true;
            if (this.unSubscriber) this.unSubscriber.unsubscribe();
        }
    }

    preLoadImage(url: string, callback?: () => void) {
        if (this.preLoad) {
            let img = new Image(); //创建一个Image对象，实现图片的预下载 
            img.src = url;
            if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数 
                if (callback) callback.call(img);
                return; // 直接返回，不用再处理onload事件 
            }
            img.onload = () => { //图片下载完毕时异步调用callback函数。 
                if (callback) callback.call(img);//将回调函数的this替换为Image对象 
            };
        }
    }

    get target() {
        return this.element.nativeElement as HTMLElement;
    }
    get isVisible() {
        return this.target.style.display != "none" ||
            this.target.style.visibility == "visible" ||
            !this.target.hidden;
    }
    private counter: number;
    check() {
        if (this.skip_invisible && !this.isVisible) return;
        if (this.aboveTheTop() || this.leftOfBegin()) {
            /* Nothing. */
        } else if (!this.belowTheFold() && !this.rightOfFold()) {
            this.loadIamge();
        } else {
            if (++this.counter > this.failure_limit) {
                return false;
            }
        }
    }

    get windowRect() {
        return {
            width: (document.body.clientWidth || document.documentElement.clientWidth),
            height: (document.body.clientHeight || document.documentElement.clientHeight),
            scrollTop: (document.body.scrollTop || document.documentElement.scrollTop),
            scrollLeft: (document.body.scrollLeft || document.documentElement.scrollLeft)
        }
    }

    belowTheFold() {
        let fold: number = 0;
        if (this.container === undefined || this.container === document.body) {
            fold = this.windowRect.height + this.windowRect.scrollTop;
        } else {
            fold = this.container.offsetTop + this.container.clientHeight;
        }
        return fold <= this.target.offsetTop - this.threshold;
    }

    rightOfFold() {
        let fold: number = 0;
        if (this.container === undefined || this.container === document.body) {
            fold = this.windowRect.width + this.windowRect.scrollLeft;
        } else {
            fold = this.container.offsetLeft + this.container.clientWidth;
        }
        return fold <= this.target.offsetLeft - this.threshold;
    }

    aboveTheTop() {
        let fold: number = 0;
        if (this.container === undefined || this.container === document.body) {
            fold = this.windowRect.scrollTop;
        } else {
            fold = this.container.offsetTop;
        }
        return fold >= this.target.offsetTop + this.threshold + this.target.offsetHeight;
    }

    leftOfBegin() {
        let fold: number = 0;
        if (this.container === undefined || this.container === document.body) {
            fold = this.windowRect.scrollLeft;
        } else {
            fold = this.container.offsetLeft;
        }
        return fold >= this.target.offsetLeft + this.threshold + this.target.clientWidth;
    }
}