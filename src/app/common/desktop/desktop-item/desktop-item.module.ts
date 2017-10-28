// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { DesktopItemComponent } from './desktop-item.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../../shared/shared-module';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
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
