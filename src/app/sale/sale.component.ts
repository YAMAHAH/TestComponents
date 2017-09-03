import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, ComponentFactoryResolver, ViewChild, ComponentRef, Type, ViewContainerRef, ElementRef, EventEmitter, Input } from '@angular/core';
import { AppStoreService } from '../services/app.store.service';
import { AppTaskBarActions } from '../actions/app-main-tab/app-main-tab-actions'
import { ActionsBase, AddAction, RemoveAction, SetCurrentAction, GetformModelArrayAction, CloseTaskGroupAction, ComponentFactoryType, SaleComponentFactoryType, PurComponentFactoryType } from '../actions/actions-base';
import { LoadScriptService } from '../services/load-script-service';
import { DialogService } from '../common/dialog/dialog.service';
import { ModalService } from '../common/modal/modal.service';
import { ModalPosition } from '../common/modal/modal.position.enum';
import { ActionItem } from '../common/action-button/action-item.model';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from '../common/toasty/toasty.service';
import { PanelComponent } from '../common/panel/panel.component';
import { PanelTestComponent } from './panel.test.component';
import { Observable } from 'rxjs/Observable';

import { SaleOrderActions, AddSaleOrderAction, RemoveSaleOrderAction } from '../actions/sale/sale-order-actions';
import { ISubject, IAction } from '../Models/IAction';
import { PurOrderActions } from '../actions/pur/pur-order-actions';
import { ActivatedRoute } from '@angular/router';
import { PurListComponent } from '../pur/pur-order/pur.list.component';
import { Modal } from '../common/modal/modal.model';
import { ModalTestComponent } from './modal.test.component';
import { PurDetailComponent } from '../pur/pur-order/pur.detail.component';
import { reducer } from '../basic/IReducer';
import { IFormModel } from '../basic/IFormModel';
import { FormExtras } from '../basic/FormExtras';
import { IComponentFactoryContainer } from '../basic/IComponentFactoryContainer';
import { ShowTypeEnum } from '../basic/show-type-enum';
import { NavTreeViewComponent } from '../components/nav-tree-view/nav-tree-view.component';
import { FormService } from '../components/form/FormService';
import { FormOptions } from '../components/form/FormOptions';
import { ToastPositionEnum } from '../common/toasty/toastPositionEnum';
import { SelectItem, LazyLoadEvent } from '../components/common/api';
import { CarService } from '../services/car/carService';
import { Car } from '../Models/car/car';
import { ColumnBodyComponent } from './columnBody';
import { DateColumnBodyComponent } from './dateColumnBody';
import { CellEditorComponent } from './cellEditor';
import { NavTreeNode } from '../components/nav-tree-view/nav-tree-node';



@Component({
    moduleId: module.id,
    selector: 'sale',
    templateUrl: 'sale.component.html',
    styleUrls: ['sale.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleComponent implements reducer, OnInit, OnDestroy, IComponentFactoryContainer {
    setOtherParent(godFather: IFormModel): IFormModel {
        if (godFather) {
            godFather.childs.push(this.formModel);
            this.formModel.godFather = godFather;
            if(this.formModel.tag){
                //设置关联的结点在导航树不可见,关闭TAB时也要考虑这种情况
                let nd =  this.formModel.tag  as NavTreeNode;
                nd.showNode = false;
                nd.getParents().forEach(val=>val.showNode = false);
            }
        }
        return this.formModel;
    }

    subject: ISubject;
    subjectActions: any;

    createGroupDetail(formExtras?: FormExtras): IFormModel {
        throw new Error('Method not implemented.');
    }


    options = {
        buttons: [{
            //    action: () => this.modalService.closeAll()
        }]
    };
    constructor(private appStore: AppStoreService,
        private loadScript: LoadScriptService,
        private dialogService: DialogService,
        private modalService: ModalService,
        public componentFactoryResolver: ComponentFactoryResolver,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private changeDetectorRef: ChangeDetectorRef,
        public viewContainerRef: ViewContainerRef,
        private dialogModalService: FormService,
        private activeRouter: ActivatedRoute,
        private carService: CarService) {


        this.cars = [];
        this.cars.push({ label: 'Audi', value: 'Audi' });
        this.cars.push({ label: 'BMW', value: 'BMW' });
        this.cars.push({ label: 'Fiat', value: 'Fiat' });
        this.cars.push({ label: 'Ford', value: 'Ford' });
        this.cars.push({ label: 'Honda', value: 'Honda' });
        this.cars.push({ label: 'Jaguar', value: 'Jaguar' });
        this.cars.push({ label: 'Mercedes', value: 'Mercedes' });
        this.cars.push({ label: 'Renault', value: 'Renault' });
        this.cars.push({ label: 'VW', value: 'VW' });
        this.cars.push({ label: 'Volvo', value: 'Volvo' });

        this.reducer();
        this.formModel = {
            showType: this.appStore.showType || ShowTypeEnum.showForm,
            title: "SaleOrder Group",
            active: true,
            componentFactoryRef: this,
            // treeView: this.navTreeView,
            childs: []
        };
        this.activeRouter.queryParams
            .map(params => params['taskId'])
            .subscribe(param => {
                if (this.formModel) {
                    this.formModel.key = param;
                }
            }).unsubscribe();
        this.componentFactoryDestroyFn = this.appStore.registerComponentFactoryRef(new SaleComponentFactoryType(this.formModel.key, this));

    }
    componentFactoryDestroyFn: any;
    saleOrderActions = new SaleOrderActions();
    salOrderSubject: ISubject;
    childFormLists: IFormModel[] = [];
    childFormInstances: IFormModel[] = [];
    navTreeView: NavTreeViewComponent;
    @Input() title: string = "销售订单Container";
    @Input() groupTitle: string = "销售订单分组";
    modalResult: EventEmitter<any>;
    context: any;
    tag: any;
    createGroupList(extras?: any): IFormModel {
        return this.formModel;
    }
    removeFormModel(formModel: IFormModel): void { };
    setCurrent(formModel: IFormModel): void { }
    getComponentRef<T>(componentType: Type<T>, formModel?: IFormModel): ComponentRef<T> { return null; }
    createGroup(): IFormModel {
        return null;
    }
    createList(groupformModel: IFormModel): IFormModel {
        return null;
    }
    createDetail(groupformModel: IFormModel): IFormModel {
        return null;
    }
    selectNextVisibleForm(formModel: IFormModel): void { }
    show(modalOptions?: FormOptions): any {

    }
    showModal(modalOptions?: FormOptions): any {

    }
    reducer() {
        this.salOrderSubject = this.appStore.select(this.saleOrderActions.key);
        this.salOrderSubject.subject.subscribe(act => {
            switch (true) {
                case act instanceof AddSaleOrderAction:
                    //  this.addFormList(act.data.state);
                    break;
                case act instanceof RemoveSaleOrderAction:
                    //  this.removePurList(act.data.state);
                    break;
                case act instanceof AddAction:
                    // this.addNewPurList(act.data.state);
                    break;
                case act instanceof RemoveAction:
                    //  this.deleteCurrent();
                    break;
                case act instanceof SetCurrentAction:
                    // this.setCurrent(act.data.state);
                    break;
                case act instanceof GetformModelArrayAction:
                    if (act.data.sender) {
                        // act.data.sender.next(this.purLists);
                    }
                    break;
                case act instanceof CloseTaskGroupAction:
                    this.closeAllForm(act);
                    break;
                default:
                    break;
            }
        });
    }

    closeAfterFn: Function = () => {
        // this.saleformModel = null;
        this.appStore.taskManager.closeTaskGroup(this.formModel.key);
        this.formModel.childs = [];
        // let taskGroupActions = new AppTaskBarActions();
        // this.appStore.dispatch(taskGroupActions.closeTaskGroupAction({ state: { key: this.saleOrderActions.key } }));
    };
    async closeAllForm(action: IAction) {
        // if (!this.saleformModel) {
        //     if (action.data.sender) action.data.sender.next(true);
        //     return;
        // }
        Observable.of(this.formModel).flatMap(form => {
            if (form && form.modalRef) {
                return Observable.fromPromise(form.modalRef.instance.forceClose(null));
            } else {
                return Observable.of(true);
            }
        }).every((val: boolean) => val === true).subscribe((res: boolean) => {
            let result = { processFinish: true, result: res };
            if (this.childFormInstances.length > 0) {
                result.result = false;
            }
            if (action.data.sender) action.data.sender.next(result);
        });
    }

    alert() {
        this.dialogService.alert({
            title: '销售订单',
            content: '数据<strong>保存</strong>成功.',
            yes: '确定',
            html: true,
            cssClass: 'x-alert', backdrop: false
        }).subscribe(
            data => console.log('Rebirth alert get yes result:', data),
            error => console.error('Rebirth alert get no result:', error)
            );
    }

    confirm() {
        this.dialogService.confirm({
            title: '确认',
            content: '确认要<strong>删除</strong>该单据！',
            yes: '确定',
            no: '取消',
            html: true,
            cssClass: "x-confirm",
            modalPosition: ModalPosition.bottomCenter,
            backdrop: false,
            modal: true

        }).subscribe(
            data => console.log('Rebirth confirm get yes result:', data),
            error => console.error('Rebirth confirm get no result:', error)
            );
    }

    prompt() {
        this.dialogService.prompt({
            title: '输入框',
            content: '请输入文本:',
            resolve: { text: 0 },
            yes: '确定',
            no: '取消',
            html: true,
            cssClass: "x-prompt",
            modalPosition: ModalPosition.center,
            backdrop: false,
            modal: true
        }).subscribe(
            data => console.log('确认返回结果:', data),
            error => console.error('取消返回结果:', error)
            );
    }


    componentOutlet: any = PanelTestComponent;
    selectResult(event: any) {
        console.log(event);
    }
    swap: boolean = false;
    addToast() {
        // Just add default Toast with title only
        // this.toastyService.default('Hi there');
        // Or create the instance of ToastOptions
        var toastOptions: ToastOptions = {
            title: "",
            msg: "销售订单正在处理中，请稍候......",
            showClose: false,
            timeout: 3000,
            theme: 'default',
            position: ToastPositionEnum.topRight,
            posCss: 'top:185px;right:12px;',
            manual: false,
            // componentOutlet: PanelTestComponent,
            onAdd: (toast: ToastData) => {
                // console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: (toast: ToastData) => {
                // console.log('Toast ' + toast.id + ' has been removed!');
                this.changeDetectorRef.markForCheck();
            }
        };
        // Add see all possible types in one shot
        // this.toastyService.info(toastOptions);

        if (!this.swap) {
            let toast = this.toastyService.wait(toastOptions);
        } else {
            this.toastyService.success(toastOptions);
        }
        this.swap = !this.swap;
        // this.toastyService.error(toastOptions);
        // this.toastyService.warning(toastOptions);

        // setTimeout(() => { if (toastOptions.manual) toast.onClose(); }, 500000);
    }
    openModal() {
        this.modalService.showModal<string>({
            component: ModalTestComponent,
            componentFactoryResolver: this.componentFactoryResolver,
            resolve: {
                text: 'I am from resolve data!'
            },
            modal: true,
            backdrop: false,
            minWidth: 800,
            minHeight: 600
        })
            .subscribe(data => {
                // console.log('Rebirth Modal -> Get ok with result:', data);
            }, error => {
                // console.error('Rebirth Modal -> Get cancel with result:', error);
            });
    }

    @ViewChild('xpanel', { read: PanelComponent }) xxPanel: PanelComponent;
    @ViewChild('appendToModal') appendToModal: ElementRef;
    clickMe(panel: PanelComponent) {
        // console.log(this.xxPanel);
    }
    closeMe(panel: any) {
        // console.log(panel);
        return this.xxPanel ? this.xxPanel.closeMe : false;
    }
    closeMe1: boolean = false;
    // closePanel(event: Event) {
    //     this.toastyService.clearAll();
    //     this.closeMe1 = true;
    //     (event as any).closeMe = true;
    //     // this.changeDetectorRef.detectChanges();
    // }
    compOutlets: Type<any>[] = [PanelTestComponent];
    modalResulthandler(event: any) {
        console.log(event);
    }

    items = [
        { id: 1, title: 'Panel header 1', content: 'Panel header 1' },
        { id: 2, title: 'Panel header 2', content: 'Panel header 2' }
    ];
    appendItems() {
        const len = this.items.length + 1;
        this.items.push({ id: len, title: `Panel header ${len}`, content: `Panel header ${len}` });
    }

    removeLastItem() {
        const len = this.items.length;
        this.items.splice(len - 1, 1);
    };

    isActionOpen: boolean;
    disabledActionOpen = true;
    actions: ActionItem[] = [{ id: 1, text: 'Save' }, { id: 2, text: 'Refresh' }, { divider: true }, {
        id: 3,
        text: 'Remove'
    }];


    onActionClick(item: ActionItem) {
        console.log(`Action item ${item.id} clicked`, item);
    }
    group: IFormModel;
    async open() {
        // let mainTabActions = new AppTaskBarActions();
        // let tab = {
        //     key: 'pur',
        //     name: 'pur',
        //     title: '采购订单',
        //     favicon: '/assets/images/facebook-favicon.ico',
        //     outlet: 'pur',
        //     active: false,
        //     path: 'purOrder'
        // };
        // this.appStore.dispatch(mainTabActions.createTabAction({ state: tab }));
        let factoryRef = await this.appStore.CreateComponentFactory(PurComponentFactoryType);
        if (factoryRef) {
            this.group = factoryRef.createGroup();
            let detail = factoryRef.createDetail(this.group, { showType: ShowTypeEnum.showFormModal });
            let ins = factoryRef.getComponentRef(PurListComponent).instance;
            ins.formModel.resolve = { data: '手工创建组件,传递参数,显示窗体' };
            ins.context = { data: 'Context:手工创建组件,传递参数,显示窗体' };
            //设置关联
            ins.setOtherParent(this.formModel);
            ins.show().subscribe((res: any) => console.log(res));
        }


    }
    async close() {
        // let purOrderActions = new PurOrderActions();
        // let tab = {
        //     key: 'pur',
        //     name: 'pur',
        //     title: '采购订单',
        //     favicon: '/assets/images/facebook-favicon.ico',
        //     outlet: 'pur',
        //     active: false,
        //     path: 'purOrder'
        // };
        // this.appStore.dispatch(purOrderActions.removeAction({ state: tab }));
        // let factoryRef = await this.appStore.getComponentFactoryRef(PurComponentFactoryType);
        // if (factoryRef) {
        //     let group = factoryRef.createGroup();
        //     let list = factoryRef.createList(group, { showType: ShowTypeEnum.showForm });
        //     this.group && factoryRef.createList(this.group, { showType: ShowTypeEnum.showForm });
        // }
        let factoryRef = await this.appStore.CreateComponentFactory(PurComponentFactoryType);
        if (factoryRef) {
            let compRef = factoryRef.getComponentRef(PurDetailComponent);
            let options = new FormOptions();
            options.resolve = { data: '代码创建组件数据传递' };
            options.modal = false;
            if (compRef) {
                let compIns = compRef.instance;
                compIns.formModel.title = compIns.title;
                compIns.setOtherParent(this.formModel);
                compIns.show(options).subscribe((res: any) => console.log(res));
            }
        }
    }
    display: boolean;
    showDialog() {
        this.display = !this.display;
        let options: FormOptions = new FormOptions();
        options.componentOutlets = this.compOutlets;
        options.checkCloseBeforeFn = this.closeBeforeCheckFn;
        options.responsive = true;
        options.width = 500;
        options.header = "SaleOrder";
        options.modal = false;
        options.visible = true;
        options.resolve = { target: '1358', playload: 'transmport context data' }
        // options.append = this.appendToModal.nativeElement;
        options.rootContainer = this.viewContainerRef;
        options.injector = this.viewContainerRef.parentInjector;
        this.dialogModalService
            .showForm(options)
            .subscribe(result => {
                console.log(result);
            });
    }

    closeBeforeCheckFn: Function = async (event: any) => {
        return new Promise<any>(resolve => {
            let subscription = this.dialogService.confirmAsync({
                title: '确认',
                content: '充许关闭当前窗体吗？',
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
    async beforeHide(event: any) {
        event.sender.checkCloseBeforeFn = async (event: any) => {
            return new Promise<any>(resolve => {
                if (true) {
                    this.dialogService.confirmAsync({
                        title: '确认',
                        content: '充许关闭当前窗体吗？',
                        yes: '是',
                        no: '否',
                        html: true,
                        modalPosition: ModalPosition.center,
                        backdrop: false,
                        modal: true
                    }).subscribe(res => {
                        if (res === 3) {
                            return resolve(event);
                        } else {
                            event.cancel = false;
                            return resolve(event);
                        }
                    });
                }
            });
        }
    }

    formModel: IFormModel = { title: '销售订单', active: true, childs: [] };
    ngOnInit() {
        this.formModel.closeAfterFn = this.closeAfterFn;
        this.formModel.elementRef = this.viewContainerRef.element.nativeElement;
        this.formModel.title = this.title;
        // this.formModel.instance = this;
        if (this.formModel.showType === ShowTypeEnum.showForm) {
            this.appStore.taskManager.show(this.formModel);
        }
        if (this.formModel.showType === ShowTypeEnum.showFormModal) {
            this.appStore.taskManager.showModal(this.formModel);
        }


        this.carService.getCarsMedium().then(cars => {

            this.datasource = cars;
            this.totalRecords = this.datasource.length;
            this.mycars = this.datasource.slice(0, 10);
            this.mycars.forEach(item => {
                item.saleDate = new Date().getTime();
            })
            this.changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy() {
        if (this.componentFactoryDestroyFn) {
            this.componentFactoryDestroyFn();
        }
    }


    selectedCar: string = 'BMW';
    cars: SelectItem[];

    brand: any;
    brands: string[] = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'];

    filteredBrands: any[];

    filterBrands(event: any) {
        this.filteredBrands = [];
        for (let i = 0; i < this.brands.length; i++) {
            let brand = this.brands[i];
            if (brand.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.filteredBrands.push(brand);
            }
        }
    }
    handleDropdownClick(event: any) {
        this.filteredBrands = [];
        //mimic remote call
        setTimeout(() => {
            this.filteredBrands = this.brands;
            this.changeDetectorRef.detectChanges();
        }, 100)
    }

    date3: Date;
    date6: Date;
    date7: Date;

    mycars: Car[];


    datasource: Car[];
    totalRecords: number;
    columnBody: Type<any> = ColumnBodyComponent;
    dateColumnBody: Type<any> = DateColumnBodyComponent;

    cellEditor: Type<any> = CellEditorComponent;

    cols: any[] = [
        { field: 'vin', header: 'Vin', cellComponent: null, cellEditor: null },
        { field: 'year', header: 'Year', cellComponent: DateColumnBodyComponent, cellEditor: null },
        { field: 'brand', header: 'Brand', cellComponent: null, cellEditor: this.cellEditor },
        { field: 'color', header: 'Color', cellComponent: this.columnBody, cellEditor: null }
    ];
    loadCarsLazy(event: LazyLoadEvent) {
        //in a real application, make a remote request to load data using state metadata from event
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        //imitate db connection over a network
        setTimeout(() => {
            if (this.datasource) {
                this.mycars = this.datasource.slice(event.first, (event.first + event.rows));
                this.mycars.forEach(item => {
                    item.saleDate = new Date().getTime();
                })
                this.changeDetectorRef.markForCheck();
            }
        }, 250);
    }

}
