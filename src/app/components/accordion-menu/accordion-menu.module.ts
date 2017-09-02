// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { AccordionMenuComponent } from './accordion-menu.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AccordionMenuComponent,
    ],
    exports: [
        AccordionMenuComponent,
    ]
})
export class AccordionMenuModule {

}
