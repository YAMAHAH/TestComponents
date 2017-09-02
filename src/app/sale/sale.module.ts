import { Routes, RouterModule } from '@angular/router';
import { SaleComponent } from './sale.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { XYZUIModule } from '../common/rebirth-ui.module';
import { XYZDialogModule } from '../common/dialog/dialog.module';
// import { ButtonModule } from 'primeng/primeng';
import { NgModule } from '@angular/core';
import { PopoverModule } from '../common/popover/popover.module';
import { PanelModule } from '../common/panel/panel.module';
import { AccordionModule } from '../common/accordion/accordion.module';
import { AlertBoxModule } from '../common/alert-box/alert-box.module';
import { AdModule } from '../ad/ad.module';
import { ToastyModule } from '../common/toasty/index';
import { PanelTestComponent } from './panel.test.component';
import { ActionButtonModule } from '../common/action-button/action-button.module';
import { ModalTestComponent } from './modal.test.component';
import { WebFormModule } from '../components/form/FormModule';
import { OverlayPanelModule } from '../components/overlaypanel/overlaypanel';
import { DropdownModule } from '../components/dropdown/dropdown';
import { DropdownformModule } from '../components/dropdownform/dropDownForm.Module';
import { AutoCompleteModule } from '../components/autocomplete/autocomplete';
import { CalendarModule } from '../components/calendar/calendar';
import { DataTableModule } from '../components/datatable/datatable';
import { UISharedModule } from '../common/shared/shared2';
import { ColumnBodyComponent } from './columnBody';
import { DateColumnBodyComponent } from './dateColumnBody';
import { CellEditorComponent } from './cellEditor';

export const saleRouteConfig: Routes = [
    {
        path: "", component: SaleComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(saleRouteConfig),
        FormsModule,
        CommonModule,
        // ButtonModule,
        XYZDialogModule,
        XYZUIModule,
        PopoverModule,
        PanelModule,
        AccordionModule,
        ActionButtonModule,
        AlertBoxModule,
        AdModule,
        ToastyModule,
        WebFormModule, OverlayPanelModule, DropdownModule, DropdownformModule,
        AutoCompleteModule, CalendarModule, DataTableModule
    ],
    declarations: [
        SaleComponent, ColumnBodyComponent, DateColumnBodyComponent, CellEditorComponent,
        ModalTestComponent,
        PanelTestComponent
    ],
    exports: [
        SaleComponent, ColumnBodyComponent, DateColumnBodyComponent, CellEditorComponent
    ],
    entryComponents: [
        ModalTestComponent,
        PanelTestComponent,
        SaleComponent, ColumnBodyComponent, DateColumnBodyComponent, CellEditorComponent
    ]
})
export class SaleModule {

}


