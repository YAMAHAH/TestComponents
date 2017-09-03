import { Component, OnInit, Input, ElementRef, EventEmitter } from '@angular/core';
import { UUID } from '../../untils/uuid';
import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';
import { AppStoreService } from '../../services/app.store.service';
import { PurOrderActions, RemovePurOrderAction } from '../../actions/pur/pur-order-actions';
import { IFormModel } from '../../basic/IFormModel';
import { ShowTypeEnum } from '../../basic/show-type-enum';
import { IComponentBase } from '../../basic/IComponentBase';
import { FormOptions } from '../../components/form/FormOptions';
import { NavTreeNode } from '../../components/nav-tree-view/nav-tree-node';


@Component({
    selector: 'x-pur-detail',
    templateUrl: './pur.detail.html'
})
export class PurDetailComponent implements OnInit, IComponentBase {
    setOtherParent(godFather: IFormModel): IFormModel {
        if (godFather) {
            godFather.childs.push(this.formModel);
            this.formModel.godFather = godFather;
            if (this.formModel.tag) {
                //设置关联的结点在导航树不可见,关闭TAB时也要考虑这种情况
                let nd = this.formModel.tag as NavTreeNode;
                nd.showNode = false;
                nd.getParents().forEach(val => val.showNode = false);
            }
        }
        return this.formModel;
    }

    closeBeforeCheckFn: Function;
    @Input() title: string = "采购订单";
    modalResult: EventEmitter<any>;
    context: any;
    tag: any;

    @Input() formModel: IFormModel;

    purOrder: any;
    constructor(private appStore: AppStoreService,
        private elementRef: ElementRef) { }
    ngOnInit() {
        this.purOrder = { pono: this.formModel.key, ptnno: "JL-" + UUID.uuid(8, 10) };
        console.log(this.purOrder);
        // this.formModel.instance = this;
        // this.show();
        if (this.formModel.showType === ShowTypeEnum.showForm) {
            this.show();
        }
        if (this.formModel.showType === ShowTypeEnum.showFormModal) {
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


    closeAfterFn: Function = () => {
        this.formModel.componentFactoryRef.removeFormModel(this.formModel);
    };
    show(modalOptions?: FormOptions) {
        this.formModel.title = this.title;
        this.formModel.elementRef = this.elementRef.nativeElement;
        this.formModel.closeAfterFn = this.closeAfterFn;
        return this.appStore.taskManager.show(this.formModel, modalOptions);
    }
    showModal(modalOptions?: FormOptions) {
        this.formModel.title = this.title;
        this.formModel.elementRef = this.elementRef.nativeElement;
        this.formModel.closeAfterFn = this.closeAfterFn;
        return this.appStore.taskManager.showModal(this.formModel, modalOptions);
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