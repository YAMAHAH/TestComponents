// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { DesktopItemComponent } from './desktop-item.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule, RouterModule
    ],
    declarations: [
        DesktopItemComponent,
    ],
    exports: [
        DesktopItemComponent,
    ]
})
export class DesktopItemModule {

}
