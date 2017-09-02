import { Component, Optional, ElementRef, Renderer, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AppStoreService } from '../../../services/app.store.service';
import { ISubject } from '../../../Models/IAction';
import { AppFooterActions } from '../../../actions/layout/app-footer-actions';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AppLeftSiderActions, ShowAppLeftSiderAction, HideAppLeftSiderAction } from '../../../actions/layout/app-left-sider-actions';
import { AppRightSiderActions } from '../../../actions/layout/app-right-sider-actions';

@Component({
    selector: 'x-left-sidebar',
    templateUrl: 'left-sidebar.component.html',
    styleUrls: ['left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit, AfterViewInit {
    minWidth: string = "0px";
    maxWidth: string = "255px";
    salceWidth: string = "55px";

    leftLayout: ISubject;
    leftActions = new AppLeftSiderActions();
    constructor( @Optional() public loginService: AuthService,
        private router: Router,
        private appStore: AppStoreService,
        private self: ElementRef,
        private renderer: Renderer) {
        this.reducer();

    }
    ngOnInit() {
        // console.log(this.appStore.select(this.leftActions.key, false).key);
        this.showRightSidebar();
        this.showFooter();


    }
    ngAfterViewInit() {
        // let aa = document.querySelectorAll("li[ng-reflect-router-link]");
        // Observable.fromEvent(aa, 'click').subscribe(li => { console.log(li) });
        this.expanded();

    }
    reducer() {
        this.leftLayout = this.appStore.select(this.leftActions.key);
        this.leftLayout.subject.subscribe(act => {
            switch (true) {
                case act instanceof ShowAppLeftSiderAction:
                    act.data && this.width(act.data.state);
                    this.renderer.setElementClass(this.self.nativeElement, "hide-left", false);
                    break;
                case act instanceof HideAppLeftSiderAction:
                    act.data && this.width(act.data.state);
                    this.renderer.setElementClass(this.self.nativeElement, "hide-left", true);
                    break;
                default:
                    break;
            }
        });
    }
    logout() {
        this.loginService.logout('\auto\login');
    }

    width(value: string) {
        this.renderer.setElementStyle(this.self.nativeElement, "flex", "0 0 " + value);
    }
    height(value: string) {
        this.renderer.setElementStyle(this.self.nativeElement, "height", value);
    }
    isExpanded: boolean = true;
    expanded() {
        if (this.isExpanded) {
            this.appStore
                .dispatch(
                this.leftActions.showLeftSiderAction({
                    sender: this.leftLayout.key,
                    state: this.salceWidth
                }));
        } else {
            this.appStore.dispatch(this.leftActions.showLeftSiderAction({
                sender: this.leftLayout.key,
                state: this.maxWidth
            }));
        }
        this.isExpanded = !this.isExpanded;

    }

    menuHoverHandler(event: Event) {
        // this.width(this.maxWidth);
    }

    menuExpandedHandler(event: any) {
        if (!!event.data) {
            this.width(this.maxWidth);
        } else {
            this.width(this.salceWidth);
        }
    }

    menuLeaveHandler(event: Event) {
        // this.width(this.salceWidth);
    }

    isShowRight: boolean = true;
    showRightSidebar() {
        let rightActions = new AppRightSiderActions();
        if (this.isShowRight) {
            this.appStore.dispatch(rightActions.hideRightSiderAction({
                state: this.minWidth
            }));
        } else {
            this.appStore.dispatch(rightActions.showRightSiderAction({
                state: this.maxWidth
            }));
        }
        this.isShowRight = !this.isShowRight;
    }

    get Styles() {
        return {
            "hide-left": !this.isShowLeft
        }
    }
    isShowLeft: boolean = true;
    showLeftSidebar() {
        if (this.isShowLeft) {
            this.appStore.dispatch(this.leftActions.hideLeftSiderAction({
                sender: this.leftLayout.key,
                state: this.minWidth
            }));
        } else {
            if (!this.isExpanded) {
                this.appStore.dispatch(this.leftActions.showLeftSiderAction({
                    sender: this.leftLayout.key,
                    state: this.salceWidth
                }));
            } else {
                this.appStore.dispatch(this.leftActions.showLeftSiderAction({
                    sender: this.leftLayout.key,
                    state: this.maxWidth
                }));
            }
        }
        this.isShowLeft = !this.isShowLeft;
    }

    isShowFooter: boolean = true;
    showFooter() {
        this.isShowFooter = !this.isShowFooter;
        let appFooterActions = new AppFooterActions();
        this.appStore.dispatch(appFooterActions.showFooterAction({}), true)
            .subscribe(state => {
            }).unsubscribe();
    }

}
