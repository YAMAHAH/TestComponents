import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './staticnews.router';
import { StaticNewsComponent } from './staticnews.component';
import { ChildNewsComponent } from './childnews.component';
import { PurComponent } from './pur.component';
import { SaleComponent } from './sale.component';
import { PurListComponent } from './pur.list.component';
import { PurDetailComponent } from './pur.detail.component';
import { RouterOutletModule } from '../common/router-outlet/router-outlet.module';
import { NavTreeViewModule } from '../components/nav-tree-view/nav-tree-view.module';

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(rootRouterConfig),
    NavTreeViewModule,RouterOutletModule
  ],
  declarations: [
    StaticNewsComponent,
    ChildNewsComponent,
    PurComponent,
    PurListComponent,
    PurDetailComponent,
    SaleComponent
  ],
  exports: [StaticNewsComponent, ChildNewsComponent]
})
export class StaticNewsModule { }
