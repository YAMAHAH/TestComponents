// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { MobileIndexComponent } from './mobile-index.component';
import { RouterModule, Router } from '@angular/router';
import { mobileIndexRouterConfig } from './mobile.index.router';
import { SharedModule } from '../shared/shared-module';
import { PageLoadingModule } from '../page-loading/page-loading-module';
import { AuthModule } from '../auth/auth.module';

@NgModule({
    imports: [
        SharedModule.forRoot(),
        RouterModule.forChild(mobileIndexRouterConfig),
        PageLoadingModule.forRoot()
    ],
    declarations: [
        MobileIndexComponent,
    ],
    exports: [
        MobileIndexComponent,
    ]
})
export class MobileIndexModule {

    constructor(private router: Router) {
        console.log(router);
        // ConfigAppRoutes(this.router.config);
    }

}
