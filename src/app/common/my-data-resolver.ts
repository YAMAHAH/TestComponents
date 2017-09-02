import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/delay';
import { PageLoadingService } from './page-loading';
@Injectable()
export class MyDataResolver implements Resolve<any>{

    constructor(private pageLoadService: PageLoadingService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        setTimeout(() => {
            this.pageLoadService.hidePageLoading();
        }, 3000);
        return Observable.of(Observable.timer(100, 100).take(1000).toArray()).delay(3000);
    }
}