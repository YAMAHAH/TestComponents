import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthSelfGuard } from './auth.Self.guard';
import { SharedModule } from '../shared/shared-module';
import { authRouterConfig } from './auth.router';
import { RouterModule } from '@angular/router';
@NgModule({
    imports: [
        RouterModule.forChild(authRouterConfig),
    ],
    declarations: [
    ]
})
export class AuthGuardModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthGuardModule,
            providers: [AuthSelfGuard]
        };
    }
}