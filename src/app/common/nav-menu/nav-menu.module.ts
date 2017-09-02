// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { NavMenuComponent } from './nav-menu.component';
import { NavDropdownMenuComponent } from './nav-dropdown-menu';

@NgModule({
    imports: [

    ],
    declarations: [
        NavMenuComponent, NavDropdownMenuComponent
    ],
    exports: [
        NavMenuComponent, NavDropdownMenuComponent
    ]
})
export class NavMenuModule {

}
