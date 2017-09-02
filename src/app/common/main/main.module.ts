// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { MainComponent } from './main.component';
import { ChromeTabsModule } from '../chrome-tabs/chrome-tabs.module';
import { RouterOutletModule } from '../router-outlet/router-outlet.module';
import { RouterModule } from '@angular/router';
import { mainRouterConfig } from './main.router';

@NgModule({
    imports: [
        ChromeTabsModule, RouterOutletModule,
        RouterModule.forChild(mainRouterConfig)
    ],
    declarations: [
        MainComponent,
    ],
    exports: [
        MainComponent,
    ]
})
export class MainModule {

}
