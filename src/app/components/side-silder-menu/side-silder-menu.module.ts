// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { SideSilderMenuComponent } from './side-silder-menu.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from '../tooltip/tooltip';
import { OverlayPanelModule } from '../overlaypanel/overlaypanel';
import { CalendarModule } from '../calendar/calendar';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../common/shared/shared-module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        RouterModule,
        TooltipModule,
        OverlayPanelModule,
        CalendarModule
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
