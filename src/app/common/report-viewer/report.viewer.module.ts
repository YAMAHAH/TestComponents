// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { ReportViewer } from './report.viewer';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PageLoadingModule } from '../page-loading/page-loading-module';

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

}
