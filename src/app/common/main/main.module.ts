// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { MainComponent } from './main.component';
import { NavTabsModule } from '../nav-tabs/nav-tabs.module';
import { RouterOutletModule } from '../router-outlet/router-outlet.module';
import { RouterModule } from '@angular/router';
import { mainRouterConfig } from './main.router';

@NgModule({
    imports: [
        NavTabsModule, RouterOutletModule,
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
