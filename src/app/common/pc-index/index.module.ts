
import { NgModule } from '@angular/core';
import { IndexComponent } from './index.component';
import { RouterModule } from '@angular/router';
import { pcRootRouterConfig } from './index.router';
import { SharedModule } from '../shared/shared-module';
import { PageLoadingModule } from '../page-loading/page-loading-module';
import { AuthModule } from '../auth/auth.module';
import { LayoutModule } from '../layout/layout-module';
import { DesktopLayoutContainerModule } from '../layout/desktop-layout-container/desktop-layout-container.module';
import { DesktopItemModule } from '../desktop/desktop-item/desktop-item.module';
import { LeftSidebarModule } from '../layout/left-sidebar/left-sidebar.module';
import { MainComponent } from './main.component';
import { RouterOutletModule } from '../router-outlet/router-outlet.module';
import { ChromeTabsModule } from '../chrome-tabs/chrome-tabs.module';
import { SaleComponent } from './sale.component';
@NgModule({
    imports: [
        SharedModule.forRoot(),
        DesktopLayoutContainerModule,
        DesktopItemModule,
        RouterModule.forChild(pcRootRouterConfig),
        RouterOutletModule,ChromeTabsModule,
        PageLoadingModule.forRoot()
    ],
    declarations: [
        IndexComponent, MainComponent,SaleComponent
    ],
    exports: [
        IndexComponent,
    ]
})
export class IndexModule {

}
