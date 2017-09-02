// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { FooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule
    ],
    declarations: [
        FooterComponent,
    ],
    exports: [
        FooterComponent,
    ]
})
export class FooterModule {

}
