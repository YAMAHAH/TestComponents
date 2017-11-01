
import { NgModule } from '@angular/core';
import { IndexComponent } from './index.component';
import { RouterModule } from '@angular/router';
import { pcRootRouterConfig } from './index.router';
import { CoreModule } from '../shared/shared-module';
import { PageLoadingModule } from '../page-loading/page-loading-module';
import { AuthModule } from '../auth/auth.module';
import { LayoutModule } from '../layout/layout-module';
import { DesktopLayoutContainerModule } from '../layout/desktop-layout-container/desktop-layout-container.module';
import { DesktopItemModule } from '../desktop/desktop-item/desktop-item.module';
import { LeftSidebarModule } from '../layout/left-sidebar/left-sidebar.module';
import { MainComponent } from './main.component';
import { RouterOutletModule } from '../router-outlet/router-outlet.module';
import { NavTabsModule } from '../nav-tabs/nav-tabs.module';
import { SaleComponent } from './sale.component';
@NgModule({
    imports: [
        CoreModule.forRoot(),
        DesktopLayoutContainerModule,
        DesktopItemModule,
        RouterModule.forChild(pcRootRouterConfig),
        RouterOutletModule,
        NavTabsModule,
        PageLoadingModule.forRoot()
    ],
    declarations: [
        IndexComponent, MainComponent, SaleComponent
    ],
    exports: [
        IndexComponent,
    ]
})
export class IndexModule {

}
