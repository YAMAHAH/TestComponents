// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { PageViewerComponent } from './page-viewer.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared-module';


@NgModule({
    imports: [
        CommonModule, SharedModule
    ],
    declarations: [
        PageViewerComponent,
    ],
    exports: [
        PageViewerComponent,
    ]
})
export class PageViewerModule {

}
