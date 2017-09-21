import { Routes } from '@angular/router';
import { IndexComponent } from './index.component';
import { AuthGuard } from '../auth/auth.guard';
import { MainComponent } from './main.component';
import { SaleComponent } from './sale.component';

export const pcRootRouterConfig: Routes = [
    { path: "", redirectTo: "desktop", pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: '../../home/home.module#HomeModule'
    },
    {
        path: 'news',
        loadChildren: '../../news/news.module#NewsModule'
    },
    {
        path: 'd3',
        loadChildren: '../../d3/d3.demo.module#D3Module'
    },
    {
        path: 'staticnews', component: IndexComponent,
        loadChildren: '../../static-news/staticnews.module#StaticNewsModule'
    },
    {
        path: 'desktop',
        loadChildren: '../../common/desktop/desktop.module#DesktopModule',
        data: { title: '系统导航' }
    },
    {
        path: 'main',
        component: MainComponent
    },
    {
        path: 'sale',
        component: IndexComponent,
        loadChildren: '../../sale/sale.module#SaleModule',
        outlet: "sale",
        data: { title: '销售模块' }
    },
    {
        path: 'purOrder', component: IndexComponent, outlet: 'pur',
        loadChildren: "../../pur/pur-order/pur-order.module#PurOrderModule",
        data: { title: '采购模块' }
    },
    {
        path: 'footer',
        component: IndexComponent,
        loadChildren: '../../static-news/staticnews.module#StaticNewsModule',
        outlet: "footer"
    }
];

// ----------------------------------------
// root node 显示收缩展开图标控制是否缩成图标
//  **subjecticon-1**这是有一首歌**icon+(-)** level=0 点击展开图标可以显示或隐藏子项

//    leftpadding **subjection-11**子文本内容A**icon+(1)** level=1

//    leftpadding **subjection-12**子文本内容B**icon+(1)** level=1

// ----------------------------------------
// leftpadding=level*5px 占所有空间
// ----------------------------------------

//  **subjecticon-2**这是有一首歌**icon+(-)** level=0  适当缩进

//    **subjection-21**子文本内容A**icon+(1)** level=1

//    **subjection-22**子文本内容B**icon+(1)** level=1

//    **subjection-23**子文本内容B**icon+(1)** level=1

// ----------------------------------------
