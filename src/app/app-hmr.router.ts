import { Routes, Route, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { MyDataResolver } from './common/my-data-resolver';
import { CanPageAnimateGuard } from './common/page-animate-guard';
import { StaticNewsComponent } from './test/staticnews.component';
import { AuthGuard } from './common/auth/auth.guard';
import { AuthModule } from './common/auth/auth.module';
import { HMRLayoutComponent } from './hmr-layout.component';


export function ConfigAppRoutes(approutes: Routes) {
    approutes.forEach(r => {
        let guards = r.canActivate;
        if (!!!guards) { guards = []; }
        guards.push(CanPageAnimateGuard);
        r.canActivate = guards;
        let resolveData = r.resolve;
        if (!!!resolveData) { resolveData = {}; }
        resolveData["default"] = MyDataResolver;
        r.resolve = resolveData;
    });
    return approutes;
}

export const rootHMRRouterConfig: Routes =
    [
        { path: '', redirectTo: 'pc', pathMatch: 'full' },
        {
            path: 'mobile',
            loadChildren: "./common/mobile-index/mobile-index.module#MobileIndexModule"
        },
        {
            path: 'pc',
            component: HMRLayoutComponent,
            canActivate: [AuthGuard],
            loadChildren: "./common/pc-index/index.module#IndexModule"
        },
        {
            path: 'auth',
            loadChildren: "./common/auth/auth.module#AuthModule"
        },
        {
            path: 'test',
            component: StaticNewsComponent
        },
        { path: '**', redirectTo: "/auth/login" }
    ];