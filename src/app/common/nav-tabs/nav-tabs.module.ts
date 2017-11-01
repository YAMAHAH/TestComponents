// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { NavTabsComponent } from './nav-tabs.component';
import { NavTabComponent } from './nav-tab.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterOutletModule } from '../router-outlet/router-outlet.module';
import { CoreModule } from '../shared/shared-module';
import { ToastyModule } from '../toasty/index';
import { ReportViewerModule } from '../report-viewer/report.viewer.module';
import { ReportViewer } from '../report-viewer/report.viewer';
import { OverlayPanelModule } from '../../components/overlaypanel/overlaypanel';

@NgModule({
    imports: [
        CommonModule,
        RouterOutletModule,
        RouterModule,
        CoreModule,
        ToastyModule,
        ReportViewerModule.forRoot(),
        OverlayPanelModule
    ],
    declarations: [
        NavTabsComponent,
        NavTabComponent
    ],
    exports: [
        NavTabsComponent
    ],
    entryComponents: [ReportViewer]
})
export class NavTabsModule {

}
