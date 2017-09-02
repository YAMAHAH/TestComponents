import { Routes } from '@angular/router';
import { StaticNewsComponent } from './staticnews.component';
import { ChildNewsComponent } from './childnews.component';

export const rootRouterConfig: Routes = [
    { path: '', redirectTo: "snews2", pathMatch: "full" },
    {
        path: 'snews2',
        component: StaticNewsComponent, data: { systemName: "snews" },
        loadChildren: "../static-news.1/staticnews.module#StaticNewsModule"
    },
    { path: 'childNews/:id', component: ChildNewsComponent, outlet: "bottom" },

];
