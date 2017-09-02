// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { SideSilderMenuComponent } from './side-silder-menu.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from '../tooltip/tooltip';

@NgModule({
    imports: [
        CommonModule, RouterModule, TooltipModule
    ],
    declarations: [
        SideSilderMenuComponent,
    ],
    exports: [
        SideSilderMenuComponent,
    ]
})
export class SideSilderMenuModule {

}
