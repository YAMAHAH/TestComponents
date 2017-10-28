// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { DesktopLayoutContainerModule } from '../layout/desktop-layout-container/desktop-layout-container.module';
import { desktopRouterConfig } from './desktop.router';
import { DesktopComponent } from './desktop.component';
import { DesktopItemModule } from './desktop-item/desktop-item.module';
import { CoreModule } from '../shared/shared-module';

@NgModule({
    imports: [
        CommonModule,CoreModule,
        RouterModule.forChild(desktopRouterConfig),
        DesktopLayoutContainerModule,
        DesktopItemModule,
        CoreModule
    ],
    declarations: [
        DesktopComponent,
    ],
    exports: [
        DesktopComponent
    ]
})
export class DesktopModule {

}
