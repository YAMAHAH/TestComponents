import { Routes } from '@angular/router';
import { DesktopComponent } from './desktop.component';

export const desktopRouterConfig: Routes = [
    { path: '', component: DesktopComponent, data: { subsystem: "snews" } }
];
