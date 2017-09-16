// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { IframeComponent } from './iframe.component';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        HttpModule
    ],
    declarations: [
        IframeComponent,
    ],
    exports: [
        IframeComponent,
    ]
})
export class IframeModule {

}
