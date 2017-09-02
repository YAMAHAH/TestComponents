import { Routes } from '@angular/router';
import { StaticNewsComponent } from './staticnews.component';
import { ChildNewsComponent } from './childnews.component';
import { PurComponent } from './pur.component';
import { SaleComponent } from './sale.component';
import { PurListComponent } from './pur.list.component';
import { PurDetailComponent } from './pur.detail.component';

export const rootRouterConfig: Routes = [
    { path: "", redirectTo: 'sn2', pathMatch: "full" },
    { path: 'sn1', component: StaticNewsComponent, outlet: "test" },
    { path: 'sn2', component: StaticNewsComponent },
    {
        path: 'pur', component: PurComponent, outlet: 'pur', children: [
            { path: "lista", redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: PurListComponent },
            { path: 'detail', component: PurDetailComponent }
        ]
    },
    { path: 'sale', component: SaleComponent, outlet: "sale" },
    { path: 'childNews/:id', component: ChildNewsComponent, outlet: "bottom" }
];
