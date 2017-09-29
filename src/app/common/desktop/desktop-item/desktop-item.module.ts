// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { DesktopItemComponent } from './desktop-item.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
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
