// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { RouterOutletComponent } from './router-outlet.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        RouterOutletComponent,
    ],
    exports: [
        RouterOutletComponent,
    ]
})
export class RouterOutletModule {

}
