import { Routes } from '@angular/router';
import { MainComponent } from './main.component';


export const mainRouterConfig: Routes = [
    { path: '', redirectTo: "main", pathMatch: "full" },
    {
        path: 'main',
        component: MainComponent, data: { systemName: "main" }
    }
];
