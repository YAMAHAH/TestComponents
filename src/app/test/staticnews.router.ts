import { Routes } from '@angular/router';
import { StaticNewsComponent } from './staticnews.component';
import { ChildNewsComponent } from './childnews.component';

export const rootRouterConfig: Routes = [
    {
        path: 'test', component: StaticNewsComponent, children: [
            { path: 'child/:id', component: ChildNewsComponent }
        ]
    }
];
