// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { LeftSidebarComponent } from './left-sidebar.component';
import { RouterModule } from '@angular/router';
import { SideSilderMenuModule } from '../../../components/side-silder-menu/side-silder-menu.module';

@NgModule({
    imports: [
        RouterModule,SideSilderMenuModule
    ],
    declarations: [
        LeftSidebarComponent,
    ],
    exports: [
        LeftSidebarComponent,
    ]
})
export class LeftSidebarModule {

}
