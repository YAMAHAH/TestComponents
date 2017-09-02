import { Component, OnInit, AfterViewInit, ElementRef, ViewContainerRef, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadScriptService } from '../../services/load-script-service';
import { NgForm } from '@angular/forms';
import { AppStoreService } from '../../services/app.store.service';
import { FormOptions } from '../../components/form/FormOptions';
import { FormTitleAlignEnum } from '../../components/form/FormTitleAlignEnum';

export class loginBase {
    router: Router;
    test(target: string, defaultPage: string) {
        this.router.navigateByUrl(target ? target : defaultPage, { skipLocationChange: true });
    }
}

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent extends loginBase implements OnInit, AfterViewInit {

    isLogining: boolean = true;
    defaultPage: string = '/pc';
    target: string = null;
    constructor(
        public router: Router,
        private authService: AuthService,
        private loadScriptService: LoadScriptService,
        private activeRoute: ActivatedRoute,
        private elementRef: ElementRef,
        private appStore: AppStoreService,
        private viewContainerRef: ViewContainerRef) {
        super();
        this.activeRoute
            .params
            .map(p => p['target'])
            .subscribe(url => {
                if (url) this.target = decodeURIComponent(url);
            });
    }

    onSubmit(f: NgForm) {
        return false;
    }

    ngOnInit() {
        this.loadScriptService
            .loadBootstrapCSS
            .then((css: any) => { });

        // this.loadScriptService.loadFlexboxGridCSS.then(css => { });
        this.loadScriptService.loadAnimateCSS.then(css => { this.isLogining = false; });
        this.show();
    }
    title: string = "简易ERP系统登录";
    modalResult: EventEmitter<any>;
    show() {
        let options: FormOptions = new FormOptions();
        options.responsive = true;
        options.width = 450;
        options.height = 310;
        options.header = this.title;
        options.modal = true;
        options.visible = true;
        options.closable = false;
        options.resizable = false;
        options.titleAlign = FormTitleAlignEnum.center;
        options.appendComponentRef = this;
        options.rootContainer = this.viewContainerRef;
        options.injector = this.viewContainerRef.parentInjector;

        this.appStore.modalService.showForm(options)
            // .delay(50)
            .subscribe((res: { action: string, status: string }) => {
                switch (res.action) {
                    case "login":
                        this.test(this.target, this.defaultPage);
                        //  this.router.navigateByUrl(this.target ? this.target : this.defaultPage, { skipLocationChange: true });
                        this.isLogining = true;
                        break;
                    case "signup":
                        this.router.navigateByUrl('/auth/signup', { skipLocationChange: true })
                        break;
                    default:
                        break;
                }
            });
    }

    ngAfterViewInit() {
   
    }

    exitLogin: boolean = false;
    ok(event: Event, ngForm: NgForm) {
        this.modalResult.emit(ngForm);
    }

    login(event: Event, ngForm: NgForm): Observable<boolean> | boolean { // username: string, password: string
        event.preventDefault();
        if (ngForm.valid) {

            this.authService
                .login(ngForm.value.credentials.username, ngForm.value.credentials.password)
                .then(() => {
                    this.exitLogin = true;
                    if (this.modalResult) this.modalResult.emit({ action: 'login', status: 'sucess' });
                    return this.isLogining;
                });
        }
        return false;
    }

    signup(event: Event) {
        event.preventDefault();
        this.exitLogin = true;
        if (this.modalResult) this.modalResult.emit({ action: 'signup', status: 'sucess' });
    }
}