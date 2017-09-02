// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { PurOrderComponent } from './pur-order.component';
import { PurDetailComponent } from './pur.detail.component';
import { PurListComponent } from './pur.list.component';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from '../../common/badge/badge.module';
import { AlertBoxModule } from '../../common/alert-box/alert-box.module';
import { XYZDialogModule } from '../../common/dialog/dialog.module';
import { NavTreeViewModule } from '../../components/nav-tree-view/nav-tree-view.module';
import { SideSilderMenuModule } from '../../components/side-silder-menu/side-silder-menu.module';
import { AccordionMenuModule } from '../../components/accordion-menu/accordion-menu.module';
import { PurOrderService } from './purOrderService';


export const purRouteConfig: Routes = [
    { path: "", component: PurOrderComponent }
];

@NgModule({
    imports: [
        CommonModule, FormsModule,
        RouterModule.forChild(purRouteConfig),
        XYZDialogModule,
        NavTreeViewModule, BadgeModule, AlertBoxModule, SideSilderMenuModule, AccordionMenuModule
    ],
    declarations: [
        PurOrderComponent, PurDetailComponent, PurListComponent
    ],
    exports: [
        PurOrderComponent
    ],
    entryComponents: [PurDetailComponent, PurListComponent],
    providers: [PurOrderService]
})
export class PurOrderModule {

}
