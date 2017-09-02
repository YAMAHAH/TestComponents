import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
// import { Observable, Subject } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
// import { UrlResolver } from '@angular/compiler';

// const css: string = require('./news.css');
// require('./news.scss');
// export const style1: any = loadstyle();
// import css = require("./news.css");
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';
import { Subject } from 'rxjs/Subject';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { NewsService } from '../services/news/news.service';

@Component({
    selector: 'news',
    styleUrls: ['./news.css'],
    templateUrl: './news.component.html'
})
export class NewsComponent implements OnInit, AfterViewInit {
    test$: Observable<number>;
    result$: Observable<any>;
    clicks$: Observable<any>;
    datas = [1, 2, 3, 4, 5, 6, 8];
    @ViewChild("exhaustMap") test: ElementRef;
    @ViewChild("audit") audit: ElementRef;
    @ViewChild("window") window: ElementRef;

    @ViewChild("combineAll") combineAll: ElementRef;
    constructor(public activateRouter: ActivatedRoute, private newsService: NewsService) {

        this.test$ = Observable.timer(1000, 1000).map(x => x * 133);
        this.clicks$ = Observable.fromEvent(document, 'click');
        let timer$ = Observable.interval(1000);//clicks$.withLatestFrom(
        this.result$ = this.textEmitter
            .distinctUntilChanged()
            .switchMap(values => {
                return this.newsService.getReport(+values, +values);
            }
            );


        // let throw$ = Observable.throw(new Error('ppos!')).startWith(7);
        // throw$.subscribe(x => console.log(x), e => console.error(e));
        // Observable.interval(1000).mergeMap(x => x === 3 ?
        //     Observable.throw("THirtens are bad") :
        //     Observable.of('a', 'b', 'c')
        // ).subscribe(x => console.log(x), e => console.error(e));

        // Observable.fromEventPattern((handler: any) => { document.addEventListener('click', handler); },
        //     (handler: any) => { document.removeEventListener("click", handler); },
        //     (e) => { console.log("eventPattern"); return { event: "click", data: e } })
        //     .subscribe(x => console.log(x));

        // Observable.pairs({ foot: 42, bar: 56, baz: 78 }).subscribe(x => console.log(x));
        Observable.generate(0, x => x < 10, z => z + 1, x => x * 2).subscribe(x => console.log(x));
        // let using$ = Observable.using(() => new DisposableResource(200),
        //     (resouce: DisposableResource) => {
        //         let subject = new AsyncSubject();
        //         subject.next(resouce.getValue());
        //         subject.complete();
        //         return subject;
        //     }).subscribe(x => console.log(x), err => console.log(err), () => console.log("complete"));
        // //using$.unsubscribe();
        // Observable.fromEvent(document, 'click').audit(ev => Observable.interval(1000)).subscribe(x => console.log('xxxxxx' + x));
        // Observable.fromEvent(document, 'click').mapTo(1)
        //     .expand(x => Observable.of(2 * x).delay(1000))
        //     .take(10)
        //     .subscribe(x => console.log(x));
        // let higherOrder = this.clicks$.map((ev) => Observable.interval(1000).take(10));
        // let result = higherOrder.exhaust();
        // result.subscribe(x => console.log(x));


    }
    ngOnInit() {
        //  this.result$.subscribe(x => console.log(x));
        Observable.timer(0, 100)
            .window(Observable.interval(500))
            .take(3)
            .flatMap(x => x.toArray())
            //.mergeAll()
            .subscribe(x => console.log(x));

    }

    ngAfterViewInit() {
        console.log(this.audit);
        Observable.fromEvent(this.test.nativeElement, 'click')
            .exhaustMap((ev) => Observable.interval(1000).skip(3).take(5))
            .subscribe(x => console.log("exhaustMap:" + x));
        Observable.fromEvent(this.audit.nativeElement, 'click')
            .auditTime(1000) //ev => Observable.interval(1000)
            .subscribe((x: MouseEvent) => console.log('audit:' + x));
        Observable.fromEvent(this.window.nativeElement, 'click')
            .window(Observable.interval(1000))
            .map(win => win.take(2))
            .mergeAll()

            .subscribe(x => console.log(x));
        Observable.fromEvent(this.combineAll.nativeElement, 'click')
            .map(ev => Observable.interval(2000).take(3))
            .take(2)
            .combineAll()
            .subscribe(x => console.log(x));

        Observable.range(2, 2)
            .map(e => {
                console.log(e);
                return Observable.interval(1000).skip(3 * e).take(3)
            })
            .combineAll()
            .subscribe(x => console.log(x));
        Observable.range
    }

    get filtercb() {
        return (value: any, index: number) => index == 3;
    }
    private textEmitter: Subject<string> = new Subject<string>();
    keyup(value: string) {
        this.textEmitter.next(value);
    }
    get exhaustMap() {
        return this.clicks$.exhaustMap((ev) => Observable.interval(1000).take(4));
    }

    testClick() {

    }
}

/**
 * DisposableResource
 */
export class DisposableResource {
    value: any;
    disposed: boolean;
    constructor(value: number) {
        this.value = value;
    }
    getValue() {
        if (this.disposed) {
            throw new Error('Object is Disposed');
        }
        return this.value;
    }
    unsubscribe(): void {
        if (!this.disposed) {
            this.disposed = true;
            this.value = null;
        }
        console.log('unsubscribe');
    }

    dispose() {
        if (!this.disposed) {
            this.disposed = true;
            this.value = null;
        }
        console.log('Dispose');
    }
}

