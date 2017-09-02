import { Routes } from '@angular/router';
import { Signup } from './signup';
import { LoginComponent } from './login.component';
import { AuthSelfGuard } from './auth.Self.guard';

export const authRouterConfig: Routes = [
    { path: '', redirectTo: "login", pathMatch: "full" },
    { path: 'login', component: LoginComponent, data: { one: 'one' }, canActivate: [AuthSelfGuard] },
    { path: 'signup', component: Signup }
];
