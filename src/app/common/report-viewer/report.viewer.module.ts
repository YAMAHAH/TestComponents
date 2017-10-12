// Angular Imports
import { NgModule, ModuleWithProviders } from '@angular/core';

// This Module's Components
import { ReportViewer } from './report.viewer';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PageLoadingModule } from '../page-loading/page-loading-module';
import { ReportManagerService } from './report-manager.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        PageLoadingModule
    ],
    declarations: [
        ReportViewer,
    ],
    exports: [
        ReportViewer,
    ]
})
export class ReportViewerModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ReportViewerModule,
            providers: [ReportManagerService]
        };
    }
}
