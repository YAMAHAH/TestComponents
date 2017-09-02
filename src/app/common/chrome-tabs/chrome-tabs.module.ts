// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { ChromeTabsComponent } from './chrome-tabs.component';
import { ChromeTabComponent } from './chrome-tab.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterOutletModule } from '../router-outlet/router-outlet.module';
import { SharedModule } from '../shared/shared-module';
import { ToastyModule } from '../toasty/index';

@NgModule({
    imports: [
        CommonModule,
        RouterOutletModule,
        RouterModule,
        SharedModule,
        ToastyModule
    ],
    declarations: [
        ChromeTabsComponent,
        ChromeTabComponent
    ],
    exports: [
        ChromeTabsComponent
    ]
})
export class ChromeTabsModule {

}
