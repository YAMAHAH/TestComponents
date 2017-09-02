import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home/home.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/withLatestFrom';

@Component({
    selector: 'homelist',
    template: `
        <h2>home list page</h2>
        <input type="text" #input (keyup)="keyup(input.value)" />
        <pre>{{ text$ | async | json }}</pre>
        <input type="text" #input1 (keyup)="text1.next(input1.value)" />
        <input type="text" #input2 (keyup)="text2.next(input2.value)" /> 
        {{ result$ | async }}
        <pre>{{report | async | json}}</pre>
        <h2><a [routerLink]="['../',{outlets:{bottom:'detail/3'}}]"> detail </a> </h2>
        <h2> <a [routerLink]="[{outlets:{bottom:null}}]"> Back</a></h2>
         <router-outlet></router-outlet>
        <router-outlet name = "bottom"></router-outlet>
    `
})
export class HomeListComponent implements OnInit {
    private textEmitter: Subject<string> = new Subject<string>();
    report: any;
    text$: Observable<any>;
    text1: BehaviorSubject<string> = new BehaviorSubject<string>("6");
    text2: BehaviorSubject<string> = new BehaviorSubject<string>("6");
    result$: Observable<string>;
    constructor(private homeService: HomeService) { }

    ngOnInit() {
        Observable.combineLatest(this.text1, this.text2)
            .subscribe(values => {
                this.report = this.homeService
                    .getReport(+values[0], +values[1]);
            });

        this.text$ = this.textEmitter
            .debounceTime(500)
            .distinctUntilChanged()
            .switchMap(v => this.getDataAsync(v));

        this.text$.subscribe((value) => {
            console.log(value);
        });

        this.result$ = Observable.combineLatest(this.text1, this.text2).map(values => {
            return values[0] + " " + values[1];
        });

    }
    keyup(value: string) {
        this.textEmitter.next(value);
    }
    getDataAsync(value: string): Observable<any> {
        let subject = new Subject<any>();
        setTimeout(() => {
            console.log("after 2second");
            this.homeService.getReport(+value, +value).subscribe(subject);
            // subject.next(value + " final");
        }, 2000);
        return subject;
    }

}