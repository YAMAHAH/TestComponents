import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoadScriptService } from '../services/load-script-service';
import { PageLoadingService, AnimateEffectEnum } from './page-loading';

@Injectable()
export class CanPageAnimateGuard implements CanActivate {

    constructor(private loadScriptService: LoadScriptService, private pageLoadingService: PageLoadingService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.loadScriptService
            .loadSnapSvg
            .then(snap => {
                this.pageLoadingService.showPageLoading(AnimateEffectEnum.random);
                return true;
            });
    }
}