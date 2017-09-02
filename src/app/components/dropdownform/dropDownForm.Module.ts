// Angular Imports
import { NgModule } from '@angular/core';
import { DropdownFormComponent } from "./dropDownForm.Component";
import { DropdownModule } from '../dropdown/dropdown';
import { OverlayPanelModule } from '../overlaypanel/overlaypanel';
import { FormsModule } from '@angular/forms';

// This Module's Components

@NgModule({
    imports: [
        DropdownModule, OverlayPanelModule, FormsModule
    ],
    declarations: [
        DropdownFormComponent,
    ],
    exports: [
        DropdownFormComponent,
    ]
})
export class DropdownformModule {

}
