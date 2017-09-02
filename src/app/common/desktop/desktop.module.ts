// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { DesktopLayoutContainerModule } from '../layout/desktop-layout-container/desktop-layout-container.module';
import { desktopRouterConfig } from './desktop.router';
import { DesktopComponent } from './desktop.component';
import { DesktopItemModule } from './desktop-item/desktop-item.module';
import { SharedModule } from '../shared/shared-module';

@NgModule({
    imports: [
        CommonModule,SharedModule,
        RouterModule.forChild(desktopRouterConfig),
        DesktopLayoutContainerModule,
        DesktopItemModule
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
