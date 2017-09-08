import { Component, OnInit, EventEmitter, ViewContainerRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadScriptService } from '../../services/load-script-service';
import { FormOptions } from '../../components/form/FormOptions';
import { AppStoreService } from '../../services/app.store.service';



@Component({
    selector: 'signup',
    templateUrl: './signup.html',
    styleUrls: ['./signup.css']
})
export class Signup implements OnInit {

    constructor(public router: Router,
        private authService: AuthService,
        private loadScriptService: LoadScriptService,
        private viewContainerRef: ViewContainerRef,
        private appStore: AppStoreService,
        private elementRef: ElementRef) {
    }

    signup(event: Event, username: string, password: string, avatar: string): void {
        event.preventDefault();
        this.authService.signup(username, password).then(() => {
            this.modalResult.emit({ 'action': 'signup', 'status': 'sucessful' });
        });
    }

    login(event: Event) {
        event.preventDefault();
        this.modalResult.emit({ 'action': 'login', 'status': 'sucessful' });
    }
    title: string = "用户注册";
    modalResult: EventEmitter<any>;
    show() {
        let options: FormOptions = new FormOptions();
        options.responsive = true;
        options.width = 365;
        options.height = 395;
        options.header = this.title;
        options.modal = true;
        options.resizable = false;
        options.visible = true;
        options.closable = false;
        options.appendComponentRef = this;
        options.rootContainer = this.viewContainerRef;
        options.injector = this.viewContainerRef.parentInjector;

        this.appStore.modalService.showForm(options)
            // .delay(50)
            .subscribe((res: { action: string, status: string }) => {
                switch (res.action) {
                    case "login":
                        this.router.navigateByUrl('/auth/login');
                        break;
                    case "signup":
                        this.router.navigateByUrl('/pc');
                        break;
                    default:
                        break;
                }
            });
    }
    ngOnInit() {
        this.loadScriptService
            .loadBootstrapCSS
            .then((css: any) => { });
        this.show();
    }
}
