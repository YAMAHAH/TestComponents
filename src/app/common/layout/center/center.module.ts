// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { CenterContentComponent } from './center.component';
import { RouterModule } from '@angular/router';
import { ChromeTabsModule } from '../../chrome-tabs/chrome-tabs.module';
import { RouterOutletModule } from '../../router-outlet/router-outlet.module';

@NgModule({
    imports: [
        RouterModule,ChromeTabsModule,RouterOutletModule
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
