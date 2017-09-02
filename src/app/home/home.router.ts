import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { HomeComponent } from './home.component';
import { AppDetailComponent } from './detail/app.detail.component';
import { AppHomeComponent } from './apphome.component';
import { HomeListComponent } from './list/homelist.component';
import { HomeDetailComponent } from './detail/homedetail.component';
import { AppListComponent } from './list/applist.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { MyDataResolver } from '../common/my-data-resolver';
import { CanPageAnimateGuard } from '../common/page-animate-guard';

export const rootRouterConfig: Routes = [
  //  { path: '', redirectTo: 'list', pathMatch: 'full' },
  //  {
  // path: "", children: [ // 订单管理系统
  // {
  //   path: '', component: AppHomeComponent, children: [
  //     { path: 'list', component: HomeListComponent },
  //     { path: 'detail0', component: HomeDetailComponent },
  //     { path: 'detail', component: HomeDetailComponent, outlet: 'bottom' }
  //   ]
  // },


  // {
  //   path: ":li", component: HomeComponent, children: [
  //     {
  //       path: '', component: HomeListComponent, pathMatch: 'full'
  //     },
  //     { path: ':id', component: DetailComponent },
  //     { path: ":id", component: HomeDetailComponent, outlet: "bottom" }
  //     // {
  //     //   path: 'detail/:id', children: [
  //     //     { path: "", component: HomeDetailComponent, outlet: "bottom" }
  //     //   ]
  //     // }
  //   ]
  // },
  // {
  //   path: ":li", component: HomeComponent, outlet: "bottom", children: [
  //     { path: 'detail11', component: DetailComponent },
  //     { path: "detail12", component: HomeDetailComponent, outlet: "bottom" }
  //   ]
  // },

  {
    path: "", component: HomeComponent, children: [
      { path: "", redirectTo: "list", pathMatch: 'full' },
      {
        path: "list", component: HomeListComponent
      },
      // { path: "", redirectTo: 'detail55/55', pathMatch: 'full' },
      {
        path: "", component: HomeDetailComponent, outlet: "bottom", canActivate: [CanPageAnimateGuard],
        resolve: { default: MyDataResolver }
      }
      // {
      //   path: 'list', children: [
      //     { path: "", component: HomeListComponent },
      //     { path: "detail/:id", component: HomeDetailComponent, outlet: "bottom" }
      //   ]
      // },
      // { path: "detail/:id", component: HomeDetailComponent, outlet: "bottom" },
      // // {
      //   path: 'detail/:id', children: [
      //     { path: "", component: HomeDetailComponent, outlet: "bottom" }
      //   ]
      // }
    ]
  }
  ,

  {
    path: '', component: AppHomeComponent, children: [
      { path: 'detail3', component: HomeDetailComponent, outlet: 'primary' },
      { path: 'detail5', component: HomeDetailComponent, outlet: 'bottom' }
    ]
  },
  {
    path: 'list2', component: AppListComponent, children: [
      { path: '', redirectTo: 'detail0', pathMatch: 'full' },
      { path: 'detail0', component: DetailComponent },
      { path: 'detail', component: DetailComponent, outlet: 'bottom' }
    ]
  },
  { path: 'detail0', component: AppDetailComponent },
  { path: 'detail', component: AppDetailComponent, outlet: 'right' },
  { path: 'detail2', component: AppDetailComponent, outlet: 'bottom' },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'contact2', component: ContactComponent, outlet: 'bottom', },
  // }
  // 订单管理系统(xu) / 客户订单列表 / 客户订单
  // 订单管理系统(xu) / 客户订单列表 
  // 订单管理系统(xu) / 客户订单
];