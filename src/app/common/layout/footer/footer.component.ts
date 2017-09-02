import { Component, ElementRef, Renderer } from '@angular/core';
import { AppStoreService } from '../../../services/app.store.service';
import { AppFooterActions, ShowAppFooterAction, HideAppFooterAction, ShowFooterAction } from '../../../actions/layout/app-footer-actions';
import { ISubject } from '../../../Models/IAction';

@Component({
    selector: 'x-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.css']
})
export class FooterComponent {
    minHeight: string = "0px";
    maxHeight: string = "60px";
    scaleHeight: string = "100px";

    appFooterActions = new AppFooterActions();
    footerSubject: ISubject;

    constructor(
        private appStore: AppStoreService,
        private self: ElementRef,
        private renderer: Renderer
    ) {
        // this.renderer.setElementClass(this.self.nativeElement, "footer-wrap", true);

        this.footerSubject = this.appStore.select(this.appFooterActions.key);
        this.footerSubject.subject.subscribe(act => {
            switch (true) {
                case act instanceof ShowFooterAction:
                    this.showFooter();
                    if (act.data.sender) act.data.sender.next({ footer: 'return message' });
                    break;
                case act instanceof ShowAppFooterAction:
                    act.data && this.width(act.data.state);
                    this.renderer.setElementClass(this.self.nativeElement, "hide-footer", false);
                    break;
                case act instanceof HideAppFooterAction:
                    act.data && this.width(act.data.state);
                    this.renderer.setElementClass(this.self.nativeElement, "hide-footer", true);
                    break;
                default:
                    break;
            }
        });
    }
    width(value: string) {
        this.renderer.setElementStyle(this.self.nativeElement, "width", value);
    }
    height(value: string) {
        this.renderer.setElementStyle(this.self.nativeElement, "height", value);
    }
    isExpanded: boolean = true;
    expanded() {
        if (this.isExpanded) {
            this.appStore.dispatch({
                target: "footer", actionType: "show",
                data: { sender: "footer", state: this.scaleHeight }
            });
        } else {
            this.appStore.dispatch({
                target: "footer", actionType: "show",
                data: { sender: "footer", state: this.maxHeight }
            });
        }
        this.isExpanded = !this.isExpanded;
    }
    isShowFooter: boolean = true;

    showFooter() {
        if (this.isShowFooter) {
            this.appStore.dispatch(this.appFooterActions.hideAppFooterAction({
                sender: this,
                state: this.minHeight
            }));
        } else {
            if (!this.isExpanded) {
                this.appStore.dispatch(this.appFooterActions.showAppFooterAction({
                    sender: this,
                    state: this.scaleHeight
                }));
            } else {
                this.appStore.dispatch(this.appFooterActions.showAppFooterAction({
                    sender: this,
                    state: this.maxHeight
                })
                );
            }
        }
        this.isShowFooter = !this.isShowFooter;
    }
}
