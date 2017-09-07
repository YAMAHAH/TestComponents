import { Component, OnInit, Input, ElementRef, EventEmitter, Injector } from '@angular/core';
// import { PurDetail, PurList } from './pur-order.component';

import { UUID } from '../../untils/uuid';
import { AppStoreService } from '../../services/app.store.service';
import { SetCurrentAction, PurComponentFactoryType } from '../../actions/actions-base';
import { PurOrderActions, RemovePurOrderAction } from '../../actions/pur/pur-order-actions';
import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';
import { DialogService } from '../../common/dialog/dialog.service';
import { ModalPosition } from '../../common/modal/modal.position.enum';

import { PurDetailComponent } from './pur.detail.component';
import { IComponentBase } from '../../basic/IComponentBase';
import { IPageModel } from '../../basic/IFormModel';
import { FormTypeEnum } from '../../basic/FormTypeEnum';
import { NavTreeNode } from '../../components/nav-tree-view/nav-tree-node';
import { ShowTypeEnum } from '../../basic/show-type-enum';
import { FormOptions } from '../../components/form/FormOptions';
import { PurOrderService } from './purOrderService';
import { ComponentBase } from './ComponentBase';

@Component({
    selector: 'x-pur-list',
    templateUrl: './pur.list.html',
    styles: [' .el-hide{display:none} .el-flex-show{ display:flex;flex:1 }']
})
export class PurListComponent extends ComponentBase implements OnInit {
    @Input() title: string = "采购订单清单";
    constructor(protected injector: Injector,
        private dialogService: DialogService,
        private purOrderService: PurOrderService) {
        super(injector);
    }

    getClass(detail: IPageModel) {
        return {
            "el-hide": !detail.active,
            "el-flex-show": detail.active
        }
    }

    async onDblClick(item: any) {
        //create detail
        let detail: IPageModel;
        let idx = this.pageModel.parent.childs.findIndex(detail => detail.key === item.pono);
        if (idx > -1) {
            // get node
            detail = this.pageModel.parent.childs[idx];
            detail.modalRef && detail.modalRef.instance.moveOnTop();
        } else {
            //create node
            detail = {
                formType: FormTypeEnum.detail,
                showType: this.appStore.showType || ShowTypeEnum.showForm,
                key: item.pono,
                title: item.pono,
                active: false,
                tag: null,
                childs: [],
                componentFactoryRef: this.pageModel.componentFactoryRef,
                parent: this.pageModel.parent,
                resolve: this.appStore.handleResolve({ data: item })
            };
            this.pageModel.parent.childs.push(detail);
            let nd = new NavTreeNode(UUID.uuid(8, 10), item.pono, '/skdd', 'sndwd', 0);
            nd.tag = detail;
            detail.tag = nd;

            let node = this.pageModel.tag as NavTreeNode;
            if (node && node.parent) {
                node.parent.addNode(nd);
            }
            if (this.pageModel.componentRef) {
                debugger;
                let factoryRef = await this.appStore.GetOrCreateComponentFactory(PurComponentFactoryType);
                if (factoryRef) {
                    detail.showType = ShowTypeEnum.tab;
                    let ins = factoryRef.getComponentRef(PurDetailComponent, detail).instance;
                    ins.context = detail.resolve; //{ data: 'Context:手工创建组件,传递参数,显示窗体' };

                    ins.setOtherParent(this.pageModel.godFather);
                    ins.show().subscribe((res: any) => console.log(res));
                }
            }
        }
        //setcurrent
        this.pageModel.componentFactoryRef.setCurrent(detail);
        this.createBill(item);
    }

    createBill(item: any) {
        let detail: IPageModel;
        detail = {
            formType: FormTypeEnum.detail,
            key: UUID.uuid(8, 10),
            title: UUID.uuid(8, 10),
            active: false,
            tag: null,
            childs: [],
            componentFactoryRef: this.pageModel.componentFactoryRef,
            parent: this.pageModel.parent,
            showType: this.appStore.showType || ShowTypeEnum.showForm,
            resolve: this.appStore.handleResolve({ data: item }),
        };
        this.pageModel.parent.childs.push(detail);

        let ndKey = UUID.uuid(8, 10);
        let nd = new NavTreeNode(ndKey, ndKey, '/skdd', 'sndwd', 0);
        nd.tag = detail;
        detail.tag = nd;

        let node = this.pageModel.tag as NavTreeNode;
        if (node && node.parent) {
            node.parent.addNode(nd);
        }
        this.pageModel.componentFactoryRef.setCurrent(detail);
    }
    purListData: any[] = [];
    closeBeforeCheckFn: Function = async (event: any) => {
        return new Promise<any>(resolve => {
            let subscription = this.dialogService.confirmAsync({
                title: '确认',
                content: '关闭当前窗体吗？',
                yes: '是',
                no: '否',
                html: true,
                modalPosition: ModalPosition.center,
                backdrop: false,
                modal: true
            }).subscribe(res => {
                if (res !== 3) {
                    event.cancel = false;
                }
                return resolve(() => { subscription.unsubscribe(); });
            });

        });

    }
    closeAfterFn: Function = () => {
        // if (this.formModel && this.formModel.godFather) {
        //     let idx = this.formModel.godFather.childs.findIndex((value) => value === this.formModel);
        //     if (idx > -1) {
        //         this.formModel.godFather.childs.splice(idx, 1);
        //     }
        // }
        // this.formModel.componentFactoryRef.removePageModel(this.formModel);
    };

    show(modalOptions?: FormOptions) {
        if (this.pageModel) {
            this.pageModel.title = this.title;
            this.pageModel.elementRef = this.elementRef.nativeElement;
            this.pageModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
            this.pageModel.closeAfterFn = this.closeAfterFn;
        }
        return this.appStore.taskManager.show(this.pageModel, modalOptions);
    }
    showModal(modalOptions?: FormOptions): any {
        if (this.pageModel) {
            this.pageModel.title = this.title;
            this.pageModel.elementRef = this.elementRef.nativeElement;
            this.pageModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
            this.pageModel.closeAfterFn = this.closeAfterFn;
        }
        return this.appStore.taskManager.showModal(this.pageModel, modalOptions);
    }

    ngOnInit() {
        this.purOrderService.showMessage();
        this.purListData = [
            { pono: "PO-16120001", title: "采购订单", active: false },
            { pono: "PO-16120002", title: "采购订单", active: false },
            { pono: "PO-16120003", title: "采购订单", active: false },
            { pono: "PO-16120004", title: "采购订单", active: false },
            { pono: "PO-16120005", title: "采购订单", active: false }
        ];
        if (this.pageModel) {
            this.pageModel.title = this.title;
            this.pageModel.elementRef = this.elementRef.nativeElement;
            this.pageModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
            this.pageModel.closeAfterFn = this.closeAfterFn;

            if (this.pageModel.showType === ShowTypeEnum.showForm) {
                this.appStore.taskManager.show(this.pageModel);
            }
            if (this.pageModel.showType === ShowTypeEnum.showFormModal) {
                this.appStore.taskManager.showModal(this.pageModel);
            }
        }

    }

}