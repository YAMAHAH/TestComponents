import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RouterService {

    constructor(private router: Router, private activateRouter: ActivatedRoute) { }

    async navigateToOutlet(outlets: { [key: string]: string }, queryParams: { [key: string]: any } = null, relativeTo: ActivatedRoute = null) {
        let extras = {
            skipLocationChange: true,
            relativeTo: relativeTo || this.activateRouter
        };
        if (queryParams) {
            extras['queryParams'] = queryParams;
        }
        return await this.router.navigate([{ outlets: outlets }], extras);
    }

    navigate(commands: any[], extras: NavigationExtras) {
        return this.router.navigate(commands, extras);
    }

    navigageUrl(path: string | UrlTree, extras: NavigationExtras) {
        return this.router.navigateByUrl(path, extras)
    }

}