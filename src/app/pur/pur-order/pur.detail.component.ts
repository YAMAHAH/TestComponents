import { Component, OnInit, Input, ElementRef, EventEmitter, Injector, AfterContentInit } from '@angular/core';
import { UUID } from '../../untils/uuid';
import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';
import { AppStoreService } from '../../services/app.store.service';
import { PurOrderActions, RemovePurOrderAction } from '../../actions/pur/pur-order-actions';
import { IPageModel } from '../../basic/IFormModel';
import { ShowTypeEnum } from '../../basic/show-type-enum';
import { IComponentBase } from '../../basic/IComponentBase';
import { FormOptions } from '../../components/form/FormOptions';
import { NavTreeNode } from '../../components/nav-tree-view/nav-tree-node';
import { ComponentBase } from './ComponentBase';
import { styleUntils } from '../../untils/style';


@Component({
    selector: 'x-pur-detail',
    host: {
        '[class.flex-column-container-item]': 'true',
        '[class.el-hide]': '!visible && !!!pageModel?.modelRef',
        '[class.el-flex-show]': 'visible && !!pageModel?.modelRef'
    },
    templateUrl: './pur.detail.html'
})
export class PurDetailComponent extends ComponentBase implements OnInit, AfterContentInit {
    ngAfterContentInit(): void {
        // this.setHostElementStyle();
    }

    closeBeforeCheckFn: Function;
    @Input() title: string = "采购订单";

    purOrder: any;
    constructor(protected injector: Injector) {
        super(injector);
    }
    ngOnInit() {

        this.purOrder = { pono: this.pageModel.key, ptnno: "JL-" + UUID.uuid(8, 10) };
        if (this.pageModel.showType === ShowTypeEnum.showForm) {
            this.show();
        }
        if (this.pageModel.showType === ShowTypeEnum.showFormModal) {
            this.showModal();
        }
    }
    autoDisappear = false;
    closed = false;
    closeAlertBox() {
        this.closed = true;
    }

    clickAlertBox(alert: any) {
        console.log(alert);
    }

    appTaskBarActions = new AppTaskBarActions;

    purOrderActions = new PurOrderActions();


    // closeAfterFn: Function = () => {
    //     this.formModel.componentFactoryRef.removePageModel(this.formModel);
    // };
    show(modalOptions?: FormOptions) {
        this.pageModel.title = this.title;
        this.pageModel.elementRef = this.elementRef.nativeElement;
        this.pageModel.closeAfterFn = this.closeAfterFn;
        return this.appStore.navTabManager.show(this.pageModel, modalOptions);
    }
    showModal(modalOptions?: FormOptions) {
        this.pageModel.title = this.title;
        this.pageModel.elementRef = this.elementRef.nativeElement;
        this.pageModel.closeAfterFn = this.closeAfterFn;
        return this.appStore.navTabManager.showModal(this.pageModel, modalOptions);
    }
    setHostElementStyle() {
        let elStyle = ` 
        x-page-viewer {
            display: flex;
            flex: 1 0 auto;
        }
        .el-hide {
            display:none;
        } 
        .el-flex-show { 
            display:flex;flex:1 0 100%;
        }
        `;
        styleUntils.setElementStyle(this.elementRef.nativeElement, elStyle);
    }
    close() {

    }
    hide() {

    }
    ok(event: any) {
        this.modalResult && this.modalResult.emit({ status: 'ok', modalResult: 'ok' });
    }
    cancel(event: any) {
        this.modalResult && this.modalResult.emit({ status: 'cancel', modalResult: 'cancel' });
    }


}