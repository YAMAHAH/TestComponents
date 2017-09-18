// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { ReportViewer } from './report.viewer';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
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
