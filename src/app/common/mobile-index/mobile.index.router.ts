import { Routes } from '@angular/router';
import { MobileIndexComponent } from './mobile-index.component';
import { CanPageAnimateGuard } from '../page-animate-guard';
import { MyDataResolver } from '../my-data-resolver';
import { AuthGuard } from '../auth/auth.guard';

export const mobileIndexRouterConfig: Routes = [
    {
        path: '',
        component: MobileIndexComponent, canActivate: [AuthGuard],
        children: [
            { path: "", redirectTo: "home", pathMatch: 'full' },
            {
                path: 'home',
                loadChildren: '../../home/home.module#HomeModule',
                canActivate: [CanPageAnimateGuard],
                resolve: { default: MyDataResolver }
            },
            {
                path: 'news',
                loadChildren: '../../news/news.module#NewsModule',
                canActivate: [CanPageAnimateGuard],
                resolve: { default: MyDataResolver }
            },
            {
                path: 'd3',
                loadChildren: '../../d3/d3.demo.module#D3Module',
                canActivate: [CanPageAnimateGuard],
                resolve: { default: MyDataResolver }
            },
            {
                path: 'staticnews',
                loadChildren: '../../static-news/staticnews.module#StaticNewsModule',
                canActivate: [CanPageAnimateGuard],
                resolve: { default: MyDataResolver }
            },
        ]
    },

];
