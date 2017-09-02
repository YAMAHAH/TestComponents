// Angular Imports
import { NgModule, ModuleWithProviders } from '@angular/core';

// This Module's Components
import { RouterModule } from '@angular/router';
import { authRouterConfig } from './auth.router';
import { Signup } from './signup';
import { AuthService2 } from './auth.service';
import { SharedModule } from '../shared/shared-module';
import { LoginComponent } from './login.component';
import { AuthGuard } from './auth.guard';
import { AService } from './AService';
import { BService } from './BService';
import { AuthGuardModule } from './AuthGuardModule';

@NgModule({
    imports: [
        SharedModule.forRoot(), RouterModule,

        AuthGuardModule.forRoot()
    ],
    declarations: [
        LoginComponent, Signup
    ],
    providers: [AService, BService]
})
export class AuthModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [AuthService2, AuthGuard]
        };
    }
}


