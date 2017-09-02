// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { SizingPointComponent } from './sizing-point.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SizingPointComponent,
    ],
    exports: [
        SizingPointComponent,
    ]
})
export class SizingPointModule {

}
