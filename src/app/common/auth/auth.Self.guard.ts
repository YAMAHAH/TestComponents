import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AService } from './AService';

@Injectable()
export class AuthSelfGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private aSrv: AService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (this.authService.isLoggedIn) { return true; }
        // this.router.navigate(['/auth/login', { target: decodeURIComponent(state.url) }], { queryParams: {}, fragment: '', skipLocationChange: true });
        return true;
    }
}
