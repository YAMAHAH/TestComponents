// import { Component, OnInit, Input, ElementRef, EventEmitter } from '@angular/core';
// // import { PurDetail, PurList } from './pur-order.component';

// import { UUID } from '../../untils/uuid';
// import { AppStoreService } from '../../services/app.store.service';
// import { SetCurrentAction, PurComponentFactoryType } from '../../actions/actions-base';
// import { PurOrderActions, RemovePurOrderAction } from '../../actions/pur/pur-order-actions';
// import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';
// import { DialogService } from '../../common/dialog/dialog.service';
// import { ModalPosition } from '../../common/modal/modal.position.enum';

// import { PurDetailComponent } from './pur.detail.component';
// import { IComponentBase } from '../../basic/IComponentBase';
// import { IFormModel } from '../../basic/IFormModel';
// import { FormTypeEnum } from '../../basic/FormTypeEnum';
// import { NavTreeNode } from '../../components/nav-tree-view/nav-tree-node';
// import { ShowTypeEnum } from '../../basic/show-type-enum';
// import { FormOptions } from '../../components/form/FormOptions';
// import { PurOrderService } from './purOrderService';

// @Component({
//     selector: 'x-pur-list',
//     templateUrl: './pur.list.html',
//     styles: [' .el-hide{display:none} .el-flex-show{ display:flex;flex:1 }']
// })
// export class PurListComponent implements OnInit, IComponentBase {
//     closePage(formModel: IFormModel): Promise<any> {
//         throw new Error("Method not implemented.");
//     }
//     setOtherParent(godFather: IFormModel): IFormModel {
//         if (godFather) {
//             godFather.childs.push(this.formModel);
//             this.formModel.godFather = godFather;
//             if (this.formModel.tag) {
//                 //设置关联的结点在导航树不可见,关闭TAB时也要考虑这种情况
//                 let nd = this.formModel.tag as NavTreeNode;
//                 nd.showNode = false;
//                 nd.getParents().forEach(val => val.showNode = false);
//             }
//         }
//         return this.formModel;
//     }

//     @Input() title: string = "采购订单清单";
//     modalResult: EventEmitter<any>;
//     context: any;
//     tag: any;


//     @Input() formModel: IFormModel; //PurList

//     constructor(private appStore: AppStoreService,
//         private elementRef: ElementRef,
//         private dialogService: DialogService,
//         private purOrderService: PurOrderService) {

//     }

//     getClass(detail: IFormModel) { //PurDetail
//         return {
//             "el-hide": !detail.active,
//             "el-flex-show": detail.active
//         }
//     }

//     async onDblClick(item: any) {
//         //create detail
//         let detail: IFormModel;
//         let idx = this.formModel.parent.childs.findIndex(detail => detail.key === item.pono);
//         if (idx > -1) {
//             // get node
//             detail = this.formModel.parent.childs[idx];
//             detail.modalRef && detail.modalRef.instance.moveOnTop();
//         } else {
//             //create node
//             detail = {
//                 formType: FormTypeEnum.detail,
//                 showType: this.appStore.showType || ShowTypeEnum.showForm,
//                 key: item.pono,
//                 title: item.pono,
//                 active: false,
//                 tag: null,
//                 componentFactoryRef: this.formModel.componentFactoryRef,
//                 parent: this.formModel.parent,
//                 resolve: this.appStore.handleResolve({ data: item })
//             };
//             this.formModel.parent.childs.push(detail);
//             let nd = new NavTreeNode(UUID.uuid(8, 10), item.pono, '/skdd', 'sndwd', 0);
//             nd.tag = detail;
//             detail.tag = nd;

//             let node = this.formModel.tag as NavTreeNode;
//             if (node && node.parent) {
//                 node.parent.addNode(nd);
//             }
//             if (this.formModel.componentRef) {
//                 let factoryRef = await this.appStore.CreateComponentFactory(PurComponentFactoryType);
//                 if (factoryRef) {
//                     detail.showType = ShowTypeEnum.tab;
//                     let ins = factoryRef.getComponentRef(PurDetailComponent, detail).instance;
//                     ins.context = detail.resolve; //{ data: 'Context:手工创建组件,传递参数,显示窗体' };

//                     ins.setOtherParent(this.formModel.godFather);
//                     ins.show().subscribe((res: any) => console.log(res));
//                 }
//             }

//         }
//         //setcurrent

//         // let purOrderActions = new PurOrderActions();
//         // this.appStore.dispatch(purOrderActions.setCurrentAction({ state: detail }));
//         this.formModel.componentFactoryRef.setCurrent(detail);
//         this.createBill(item);
//     }

//     createBill(item: any) {
//         let detail;

//         detail = {
//             formType: FormTypeEnum.detail,
//             key: UUID.uuid(8, 10),
//             title: UUID.uuid(8, 10),
//             active: false,
//             tag: null,
//             componentFactoryRef: this.formModel.componentFactoryRef,
//             parent: this.formModel.parent,
//             showType: this.appStore.showType || ShowTypeEnum.showForm,
//             resolve: this.appStore.handleResolve({ data: item })
//         };
//         this.formModel.parent.childs.push(detail);

//         let ndKey = UUID.uuid(8, 10);
//         let nd = new NavTreeNode(ndKey, ndKey, '/skdd', 'sndwd', 0);
//         nd.tag = detail;
//         detail.tag = nd;

//         let node = this.formModel.tag as NavTreeNode;
//         if (node && node.parent) {
//             node.parent.addNode(nd);
//         }
//         // }
//         //setcurrent
//         this.formModel.componentFactoryRef.setCurrent(detail);
//         // let purOrderActions = new PurOrderActions();
//         // this.appStore.dispatch(purOrderActions.setCurrentAction({ state: detail }));
//     }
//     purListData: any[] = [];
//     closeBeforeCheckFn: Function = async (event: any) => {
//         return new Promise<any>(resolve => {
//             let subscription = this.dialogService.confirmAsync({
//                 title: '确认',
//                 content: '关闭当前窗体吗？',
//                 yes: '是',
//                 no: '否',
//                 html: true,
//                 modalPosition: ModalPosition.center,
//                 backdrop: false,
//                 modal: true
//             }).subscribe(res => {
//                 if (res !== 3) {
//                     event.cancel = false;
//                 }
//                 return resolve(() => { subscription.unsubscribe(); });
//             });

//         });

//     }
//     purOrderActions = new PurOrderActions();
//     closeAfterFn: Function = () => {
//         // let curnode = this.purList.tag as NavTreeNode;
//         // this.purList.childs.forEach(form => form.modalRef.instance.close(null));
//         if (this.formModel && this.formModel.godFather) {
//             let idx = this.formModel.godFather.childs.findIndex((value) => value === this.formModel);
//             if (idx > -1) {
//                 this.formModel.godFather.childs.splice(idx, 1);
//             }

//         }
//         this.formModel.componentFactoryRef.removeFormModel(this.formModel);

//         // this.appStore.dispatch(new RemovePurOrderAction(this.purOrderActions.key, { state: this.formModel }))
//     };

//     show = (modalOptions?: FormOptions) => {
//         if (this.formModel) {
//             this.formModel.title = this.title;
//             this.formModel.elementRef = this.elementRef.nativeElement;
//             this.formModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
//             this.formModel.closeAfterFn = this.closeAfterFn;
//             //  this.formModel.instance = this;
//         }
//         return this.appStore.taskManager.show(this.formModel, modalOptions);
//     }
//     showModal = (modalOptions?: FormOptions): any => {
//         if (this.formModel) {
//             this.formModel.title = this.title;
//             this.formModel.elementRef = this.elementRef.nativeElement;
//             this.formModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
//             this.formModel.closeAfterFn = this.closeAfterFn;
//             //  this.formModel.instance = this;
//         }
//         return this.appStore.taskManager.showModal(this.formModel, modalOptions);
//     }

//     ngOnInit() {
//         this.purOrderService.showMessage();
//         this.purListData = [
//             { pono: "PO-16120001", title: "采购订单", active: false },
//             { pono: "PO-16120002", title: "采购订单", active: false },
//             { pono: "PO-16120003", title: "采购订单", active: false },
//             { pono: "PO-16120004", title: "采购订单", active: false },
//             { pono: "PO-16120005", title: "采购订单", active: false }
//         ];
//         // let appTabSetActions = new AppTaskBarActions;
//         if (this.formModel) {
//             this.formModel.title = this.title;
//             this.formModel.elementRef = this.elementRef.nativeElement;
//             this.formModel.closeBeforeCheckFn = this.closeBeforeCheckFn;
//             this.formModel.closeAfterFn = this.closeAfterFn;
//             // this.formModel.instance = this;
//             // this.appStore.dispatch(appTabSetActions.showFormAction({
//             //     sender: appTabSetActions.key,
//             //     state: this.formModel
//             // }));
//             if (this.formModel.showType === ShowTypeEnum.showForm) {
//                 this.appStore.taskManager.show(this.formModel);
//             }
//             if (this.formModel.showType === ShowTypeEnum.showFormModal) {
//                 this.appStore.taskManager.showModal(this.formModel);
//             }
//         }

//     }

// }