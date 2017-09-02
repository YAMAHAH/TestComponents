import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
    selector: 'mobile-index',
    templateUrl: './mobile-index.component.html',
    styleUrls: ['./mobile-index.component.css']
})
export class MobileIndexComponent {
    name = 'Angular Aot Complier for Mobile';
    constructor(private authService: AuthService) { }
    logout() {
        this.authService.logout("/auth/login");
    }
}