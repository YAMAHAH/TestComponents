import { Component, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';
import { AppStoreService } from '../../../services/app.store.service';
import { AppRightSiderActions, ShowAppRightSiderAction, HideAppRightSiderAction } from '../../../actions/layout/app-right-sider-actions';

@Component({
    selector: 'x-right-sidebar',
    templateUrl: 'rigth-sidebar.component.html',
    styleUrls: ['rigth-sidebar.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RightSidebarComponent {

    constructor(
        private self: ElementRef,
        private renderer: Renderer,
        private appStateServie: AppStoreService) {

        // this.renderer.setElementClass(this.self.nativeElement, "right-wrap", true);
        this.reducer();

    }

    rightActions = new AppRightSiderActions();
    reducer() {
        this.appStateServie.select(this.rightActions.key).subject.subscribe(act => {
            switch (true) {
                case act instanceof ShowAppRightSiderAction:
                    act.data && this.width(act.data.state);
                    this.renderer.setElementClass(this.self.nativeElement, "hide-right", false);
                    this.isShowRight = !this.isShowRight;
                    break;
                case act instanceof HideAppRightSiderAction:
                    act.data && this.width(act.data.state);
                    this.renderer.setElementClass(this.self.nativeElement, "hide-right", true);
                    this.isShowRight = !this.isShowRight;
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
    isShowRight: boolean = true;
    showRightSidebar() {
        if (this.isShowRight) {
            this.appStateServie.dispatch({
                target: "right", actionType: "hide",
                data: { sender: "right", state: "0px" }
            });
        } else {
            this.appStateServie.dispatch({
                target: "right", actionType: "show",
                data: { sender: "right", state: "188px" }
            });
        }
        this.isShowRight = !this.isShowRight;
    }
}
