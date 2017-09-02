import { Routes } from '@angular/router';
import { NewsComponent } from './news.component';
import { AuxNewsComponent } from './auxnews.component';

export const rootRouterConfig: Routes = [

    { path: '', component: NewsComponent, data: { systemName: "news" } },
    { path: 'auxnews', component: AuxNewsComponent, outlet: 'bottom' },
    { path: 'news2', component: NewsComponent, outlet: 'bottom' }
];
