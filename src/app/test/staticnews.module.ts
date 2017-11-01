import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './staticnews.router';
import { StaticNewsComponent } from './staticnews.component';
import { ChildNewsComponent } from './childnews.component';
import { NavTabsModule } from '../common/nav-tabs/nav-tabs.module';

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(rootRouterConfig),NavTabsModule
  ],
  declarations: [StaticNewsComponent, ChildNewsComponent],
  exports: [StaticNewsComponent, ChildNewsComponent]
})
export class StaticNewsModule { }
