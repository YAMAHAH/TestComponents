import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './staticnews.router';
import { StaticNewsComponent } from './staticnews.component';
import { ChildNewsComponent } from './childnews.component';
import { NavMenuModule } from '../common/nav-menu/nav-menu.module';
import { RouterOutletModule } from '../common/router-outlet/router-outlet.module';
import { ChromeTabsModule } from '../common/chrome-tabs/chrome-tabs.module';
import { NavTreeViewModule } from '../components/nav-tree-view/nav-tree-view.module';

@NgModule({
  imports: [CommonModule, RouterOutletModule,
    RouterModule.forChild(rootRouterConfig),
    NavTreeViewModule, NavMenuModule, ChromeTabsModule
  ],
  declarations: [StaticNewsComponent, ChildNewsComponent],
  exports: [StaticNewsComponent, ChildNewsComponent]
})
export class StaticNewsModule { }
