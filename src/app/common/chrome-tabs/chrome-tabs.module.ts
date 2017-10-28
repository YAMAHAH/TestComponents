// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { ChromeTabsComponent } from './chrome-tabs.component';
import { ChromeTabComponent } from './chrome-tab.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterOutletModule } from '../router-outlet/router-outlet.module';
import { CoreModule } from '../shared/shared-module';
import { ToastyModule } from '../toasty/index';
import { ReportViewerModule } from '../report-viewer/report.viewer.module';
import { ReportViewer } from '../report-viewer/report.viewer';

@NgModule({
    imports: [
        CommonModule,
        RouterOutletModule,
        RouterModule,
        CoreModule,
        ToastyModule,
        ReportViewerModule.forRoot()
    ],
    declarations: [
        ChromeTabsComponent,
        ChromeTabComponent
    ],
    exports: [
        ChromeTabsComponent
    ],
    entryComponents: [ReportViewer]
})
export class ChromeTabsModule {

}
