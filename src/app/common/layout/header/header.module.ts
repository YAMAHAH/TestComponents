// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule
    ],
    declarations: [
        HeaderComponent,
    ],
    exports: [
        HeaderComponent,
    ]
})
export class HeaderModule {

}
