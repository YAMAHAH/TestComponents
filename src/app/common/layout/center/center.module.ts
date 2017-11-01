// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { CenterContentComponent } from './center.component';
import { RouterModule } from '@angular/router';
import { NavTabsModule } from '../../nav-tabs/nav-tabs.module';
import { RouterOutletModule } from '../../router-outlet/router-outlet.module';

@NgModule({
    imports: [
        RouterModule,NavTabsModule,RouterOutletModule
    ],
    declarations: [
        CenterContentComponent,
    ],
    exports: [
        CenterContentComponent,
    ]
})
export class CenterModule {

}
