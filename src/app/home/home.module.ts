import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { rootRouterConfig } from './home.router'

import { HomeComponent } from './home.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AppDetailComponent } from './detail/app.detail.component';
import { AppHomeComponent } from './apphome.component';
import { HomeListComponent } from './list/homelist.component';
import { AppListComponent } from './list/applist.component';
import { HomeDetailComponent } from './detail/homedetail.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SharedModule } from '../common/shared/shared-module';
import { HomeService } from '../services/home/home.service';
@NgModule({
  imports: [SharedModule.forRoot(),
  RouterModule.forChild(rootRouterConfig)
  ],
  declarations: [HomeComponent, AppHomeComponent, AboutComponent, ContactComponent,
    HomeListComponent, AppListComponent, ListComponent,
    HomeDetailComponent, DetailComponent, AppDetailComponent],
  providers: [HomeService]
})
export class HomeModule { }
