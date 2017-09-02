// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { RightSidebarComponent } from './rigth-sidebar.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule
    ],
    declarations: [
        RightSidebarComponent,
    ],
    exports: [
        RightSidebarComponent,
    ]
})
export class RightSidebarModule {

}
