import { Component, OnInit, Output, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewEncapsulation, EventEmitter, Injectable, ViewContainerRef, ChangeDetectorRef, Renderer2, AfterViewChecked } from '@angular/core';
import { LoadScriptService } from '../../services/load-script-service';
import { NavTabComponent } from './nav-tab.component';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../services/router.service';
import { AppStoreService } from '../../services/app.store.service';
import { ISubject, IAction } from '../../Models/IAction';
import {
    AppTaskBarActions, AddTabAction, RemoveTabAction, SelectTabAction,
    ExistTabAction, CreateTabAction, ShowFormModalAction, ShowFormAction
} from '../../actions/app-main-tab/app-main-tab-actions';
import {
    ActionsBase, GetTaskGroupModalAction, CloseTaskGroupAction,
    CloseAllTaskGroupAction, SaleComponentFactoryType
} from '../../actions/actions-base';

import { BehaviorSubject } from 'rxjs/Rx';
import { isFunction } from '../toasty/toasty.utils';
import { ModalOptions } from '../modal/modal-options.model';
import { HostViewContainerDirective } from '../directives/host.view.container';
import { FormOptions } from '../../components/form/FormOptions';
import { IPageModel } from '../../basic/IFormModel';

import { PageViewerOptions } from '../page-viewer/page-viewer.options';
import { ReportViewer } from '../report-viewer/report.viewer';
import { NavTabModel } from './NavTabModel';
import { OverlayPanel } from '../../components/overlaypanel/overlaypanel';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from '../../components/common/api';
import { ContextMenu } from '../../components/contextmenu/contextmenu';


let instanceId = 0;

//   // 'flexboxgrid/flexboxgrid.css',
// './toasty/style-default.css',
// './toasty/style-bootstrap.css',
// './toasty/style-material.css'
// 'primeng/resources/primeng.min.css',
// 'primeng/resources/themes/omega/theme.css',
// 'font-awesome-4.7.0/css/font-awesome.min.css',
// 'bootstrap/css/bootstrap.min.css',

@Component({
    moduleId: module.id,
    selector: 'gx-nav-tabs',
    templateUrl: 'nav-tabs.component.html',
    styleUrls: [
        'common.css',
        'nav-tabs.component.css',
        'chrome-themes.css'
    ],
    encapsulation: ViewEncapsulation.None
})
export class NavTabsComponent implements OnInit, AfterViewInit {

    @ViewChild("tabs") navTabSetRef: ElementRef;
    @ViewChild("bottomBarEl") bottomBarEl: ElementRef;
    @ViewChild("tabContentEl") _tabContentEl: ElementRef;
    @ViewChild("menuPopup") _popupMenuRef: OverlayPanel;
    @ViewChild("tabContextMenu") _navTabContextMenu: ContextMenu;

    @ViewChildren(NavTabComponent, { read: ElementRef }) navTabComps: QueryList<ElementRef>;
    @ViewChild(HostViewContainerDirective) hostFactoryContainer: HostViewContainerDirective;

    @Output() tabAfterAdd: EventEmitter<NavTabModel> = new EventEmitter<NavTabModel>();
    @Output() tabAfterRemove: EventEmitter<NavTabModel> = new EventEmitter<NavTabModel>();
    @Output() activeTabChanged: EventEmitter<NavTabModel> = new EventEmitter<NavTabModel>();

    @Output() tabBeforeAdd: EventEmitter<NavTabModel> = new EventEmitter<NavTabModel>();
    @Output() tabBeforeRemove: EventEmitter<NavTabModel> = new EventEmitter<NavTabModel>();

    defaultTapProperties = {
        title: '',
        favicon: '',
        outlet: ''
    };
    homeTab: NavTabModel = {
        order: 1,
        key: 'main',
        title: '系统导航',
        favicon: '/assets/images/google-favicon.png',
        outlet: '',
        active: true,
        showTabContent: true,
        daemon: false
    };
    navTabModels: NavTabModel[] = [this.homeTab];

    navTabModelOrders: NavTabModel[] = [this.homeTab];

    getNavTabModelOrderList() {
        this.navTabModelOrders = this.navTabModels.sort((a, b) => a.order - b.order);
        return this.navTabModelOrders;
    }
    get tabHeaders() {
        return this.navTabModels.filter(tab => !!!tab.daemon);
    }

    selected: NavTabModel;
    draggabillyInstances: any[] = [];
    constructor(private loadScript: LoadScriptService,
        private routerService: RouterService,
        private activeRouter: ActivatedRoute,
        private globalService: AppStoreService,
        public viewContainerRef: ViewContainerRef,
        private changeDetectorRef: ChangeDetectorRef,
        private renderer: Renderer2) {
        this.reducer();
        this.globalService.navTabManager = this;

    }

    taskBarSubject: ISubject;
    appTabSetActions = new AppTaskBarActions();
    reducer() {
        this.taskBarSubject = this.globalService.select(this.appTabSetActions.key);
        this.taskBarSubject.subject.subscribe(act => {
            switch (true) {
                case act instanceof AddTabAction:
                    this.addTab(act.data.state);
                    break;
                case act instanceof RemoveTabAction:
                    this.removeNavTab(act.data.state);
                    break;
                case act instanceof SelectTabAction:
                    this.select(act.data.state);
                    break;
                case act instanceof ExistTabAction:
                    let retValue = this.hasNavTab(act.data.state);
                    if (act.data.sender) {
                        act.data.sender.next(retValue);
                    }
                    break;
                case act instanceof CreateTabAction:
                    this.createNavTab(act.data.state);
                    break;
                case act instanceof ShowFormModalAction:
                    this.showModal(act.data.state);
                    break;
                case act instanceof ShowFormAction:
                    this.show(act.data.state);
                    break;
                case act instanceof GetTaskGroupModalAction:
                    let taskGroupModal = this.getNavTab(act.data.state.key);
                    if (act.data.sender) {
                        act.data.sender.next(taskGroupModal);
                    }
                    break;
                case act instanceof CloseTaskGroupAction:
                    this.closeNavTab(act.data.state.key);
                    break;
                case act instanceof CloseAllTaskGroupAction:
                    this.closeNavTabs();
                    break;
                default:
                    break;
            }
        });
    }

    closeNavTabs() {
        this.navTabModels.forEach(taskGrp => {
            this.removeNavTab(taskGrp);
        });
    }
    closeNavTab(key: string | Function) {

        let parseKey: any = key;
        if (isFunction(parseKey)) {
            parseKey = parseKey();
        }
        let taskGrp = this.getNavTab(parseKey);
        if (taskGrp) {
            this.removeNavTab(taskGrp);
        }
    }
    navTabInClosing(key: string) {
        return this.navTabClosingMap.has(key);
    }
    getNavTab(key: string) {
        let taskGrp = this.navTabModels.find(t => t.key == key);
        return taskGrp;
    }
    hideNavTab(key: string | Function) {
        let parseKey: any = key;
        if (isFunction(parseKey)) {
            parseKey = parseKey();
        }
        let taskGrp = this.getNavTab(parseKey);
        this.getNextVisibleTab(taskGrp);
        taskGrp.daemon = true;
        //隐藏后设置当前活动TAB
    }

    getNextVisibleTab(tabModel: NavTabModel) {
        let enabledModels = this.tabHeaders;
        if (this.tabHeaders.length > 1) enabledModels = this.tabHeaders.filter(tab => tab != this.homeTab);
        let idx = enabledModels.findIndex(value => value == tabModel);
        if (enabledModels[idx - 1]) {
            this.select(enabledModels[idx - 1]);
        } else if (enabledModels[idx + 1]) {
            this.select(enabledModels[idx + 1]);
        }
    }
    async select(tab: NavTabModel) {
        if (!!!tab) return;
        if (this.selected) this.selected.active = false;
        //Tab页面切换时,隐藏非活动页面所有已打开的非最小化窗体,排除homeTab

        let factoryRef = this.selected && await this.globalService.GetOrCreateComponentFactory(this.selected.key);
        factoryRef && factoryRef.hidePageModels()
        factoryRef = tab && await this.globalService.GetOrCreateComponentFactory(tab.key);
        factoryRef && factoryRef.showPageModels();

        this.selected = tab;
        this.selected.active = true;
        this.emit('activeTabChange', { tab });
    }
    ngOnInit() {
        this.select(this.navTabModels[0]);
    }
    private hasElement(element: any) {
        for (let index = 0; index < this.menuItems.length; index++) {
            if (this.menuItems[index] === element) return true;
        }
        return false;
    }
    menuItems: NodeListOf<Element>;
    mouseOverSubscription: Subscription;
    mouseLeaveSubscription: Subscription;

    private menuItemHandler() {
        this.menuItems = this._popupMenuRef.el.nativeElement.querySelectorAll("div.flex-row-col.flex-col-xs");
        let active: any;
        if (this.mouseOverSubscription) this.mouseOverSubscription.unsubscribe();
        this.mouseOverSubscription = Observable.fromEvent<Event>(this.menuItems, 'mouseover')
            .filter(e => this.hasElement(e.currentTarget))
            .map(e => {
                event.preventDefault();
                event.stopPropagation();
                return e.currentTarget;
            })
            .switchMap(e => [e])
            .subscribe(el => {
                if (el != active) {
                    this.renderer.addClass(el, "menuStandartItemOver_Mouse");
                    active = el;
                }
            });
        if (this.mouseLeaveSubscription) this.mouseLeaveSubscription.unsubscribe();
        this.mouseLeaveSubscription = Observable.fromEvent<Event>(this.menuItems, 'mouseleave')
            .filter(e => this.hasElement(e.currentTarget))
            .map(e => {
                event.preventDefault();
                event.stopPropagation();
                return e.currentTarget;
            })
            .switchMap(e => [e])
            .subscribe((el) => {

                this.renderer.removeClass(el, "menuStandartItemOver_Mouse");
                active = null;
            });
        //<div> <i class="fa fa-fw fa-times-circle">
        // Observable.fromEvent<Event>(this.menuItems, 'click')
        //     .filter(e => this.hasElement(e.currentTarget))
        //     .switchMap(e => [e])
        //     .subscribe(el => {
        //         this.itemPopupMenuRef.close();
        //     });
    }
    ngAfterViewInit() {
        let navTabSet = this.navTabSetRef.nativeElement as HTMLElement;
        this.loadScript.loadDraggabilly.then(drag => {
            this.init(navTabSet, {
                tabOverlapDistance: 0, //14
                minWidth: 45,
                maxWidth: 243
            });
        });


    }

    onAddTab() {
        let addTabModel = {
            title: '新增订单-New',
            favicon: '/assets/images/google-favicon.png',
            outlet: 'sborder' + new Date().getTime(),
            active: true
        };
        this.globalService.dispatch(this.appTabSetActions.addTabAction({
            sender: this.appTabSetActions.key,
            state: addTabModel
        }));
    }
    async createNavTab(tab: NavTabModel) {
        let factoryRef, formInstance;
        if (this.hasNavTab(tab.key)) {

            let curr = this.navTabModels.find(t => t.key == tab.key);
            if (!tab.daemon) {
                curr.daemon = false;
                this.layoutTabs();
            }
            this.select(curr);
            factoryRef = await this.globalService.GetOrCreateComponentFactory(tab.key);
        } else {
            await this.addTab(tab);
            let r = {};
            r[tab.outlet] = tab.path;

            this.changeDetectorRef.detectChanges();
            await this.routerService.navigateToOutlet(r, { taskId: tab.key }, this.activeRouter);
            factoryRef = await this.globalService.GetOrCreateComponentFactory(tab.key);
        }
        return factoryRef;
    }

    getContentClass(tabModel: NavTabModel) {
        return {
            showTabContent: (tabModel.active && tabModel.showTabContent),
            hideTabContent: !tabModel.active || !tabModel.showTabContent
        };
    }

    showPage(pageModel: IPageModel, pageViewerOptions: PageViewerOptions = null) {
        let result = new EventEmitter<any>();
        setTimeout(() => {
            let options: PageViewerOptions = new PageViewerOptions();
            options.responsive = false;
            options.width = 500;
            options.header = pageModel.title;
            options.visible = true;
            // options.resolve = { target: '1358', playload: 'transmport context data' }
            options.append = pageModel.elementRef;
            // options.appendTo= pageModel
            options.rootContainer = this.viewContainerRef;
            options.injector = this.viewContainerRef.parentInjector;
            options.pageModel = pageModel;
            if (pageViewerOptions) {
                Object.assign(options, pageViewerOptions);
            }
            if (pageModel.closeBeforeCheckFn) options.checkCloseBeforeFn = pageModel.closeBeforeCheckFn;
            if (pageModel.closeAfterFn) options.closeAfterCallBackFn = pageModel.closeAfterFn;
            if (pageModel.componentRef) options.componentRef = pageModel.componentRef;
            this.globalService.pageViewerService.showPage(options).subscribe(result);
        }, 10);
        return result;
    }
    showModal(pageModel: IPageModel, modalOptions: FormOptions = null) {
        let result = new EventEmitter<any>();
        setTimeout(() => {
            let options: FormOptions = new FormOptions();
            options.responsive = false;
            options.width = 500;
            options.header = pageModel.title;
            options.modal = true;
            options.visible = true;
            // options.resolve = { target: '1358', playload: 'transmport context data' }
            options.append = pageModel.elementRef;
            options.rootContainer = this.viewContainerRef;
            options.injector = this.viewContainerRef.parentInjector;
            options.formModel = pageModel;
            if (modalOptions) {
                Object.assign(options, modalOptions);
            }
            if (pageModel.closeBeforeCheckFn) options.checkCloseBeforeFn = pageModel.closeBeforeCheckFn;
            if (pageModel.closeAfterFn) options.closeAfterCallBackFn = pageModel.closeAfterFn;
            if (pageModel.componentRef) options.componentRef = pageModel.componentRef;
            this.globalService.modalService.showForm(options).subscribe(result);
        }, 20);
        return result;
    }

    show(pageModel: IPageModel, modalOptions: FormOptions = null) {
        // this.changeDetectorRef.detectChanges();
        let result = new EventEmitter<any>();
        setTimeout(() => {
            let options: FormOptions = new FormOptions();
            options.responsive = false;
            options.width = 500;
            options.header = pageModel.title;
            options.modal = false;
            options.visible = true;
            // options.resolve = { target: '1358', playload: 'transmport context data' }
            options.append = pageModel.elementRef;
            options.rootContainer = this.viewContainerRef;
            options.injector = this.viewContainerRef.parentInjector;
            options.formModel = pageModel;
            if (modalOptions) {
                Object.assign(options, modalOptions);
            }
            if (pageModel.closeBeforeCheckFn) options.checkCloseBeforeFn = pageModel.closeBeforeCheckFn;
            if (pageModel.closeAfterFn) options.closeAfterCallBackFn = pageModel.closeAfterFn;
            if (pageModel.componentRef) options.componentRef = pageModel.componentRef;
            return this.globalService.modalService.showForm(options).subscribe(result);
        }, 20);
        return result;
    }

    showReportViewer(modalOptions: FormOptions = null) {
        let result = new EventEmitter<any>();
        setTimeout(() => {
            let options: FormOptions = new FormOptions();
            options.responsive = true;
            options.width = document.body.clientWidth * 0.8;
            options.height = document.body.clientHeight * 0.8;
            options.modal = true;
            options.visible = true;
            options.closable = true;
            options.resizable = true;
            options.titleAlign = 1;
            options.rootContainer = this.viewContainerRef;
            options.injector = this.viewContainerRef.parentInjector;
            options.minimizeBox = false;
            options.fullscreenBox = false;
            options.maximizeBox = false;

            if (modalOptions) {
                Object.assign(options, modalOptions);
            }
            options.componentOutlets = [ReportViewer];
            options.enableFlex = true;
            options.header = "报表查看器";
            this.globalService.modalService.showForm(options)
                .subscribe(result);
        }, 20);
        return result;
    }

    onRemoveTab() {
        this.removeNavTab(this.selected);
        // this.removeTab(this.el.querySelector('.chrome-tab-current'));
    }
    onToggleTheme() {
        if (this.navTabSetElRef.classList.contains('chrome-tabs-dark-theme')) {
            document.documentElement.classList.remove('dark-theme');
            this.navTabSetElRef.classList.remove('chrome-tabs-dark-theme');
        } else {
            document.documentElement.classList.add('dark-theme');
            this.navTabSetElRef.classList.add('chrome-tabs-dark-theme');
        }
    }

    mouseDownModel: NavTabModel;
    onTabMouseDown(event: Event, data: NavTabModel) {
        this.mouseDownModel = data;
    }

    navTabSetElRef: HTMLElement;
    options: any;
    init(el: Element, options: any) {
        this.navTabSetElRef = el as HTMLElement;
        this.options = options

        // this.instanceId = instanceId
        instanceId += 1;
        this.navTabSetElRef.setAttribute('data-chrome-tabs-instance-id', instanceId.toString(10));

        this.setupStyleEl();
        this.setupEvents();
        this.layoutTabs();
        //  this.fixZIndexes();
        this.setupDraggabilly();
    }

    emit(eventName: string, data: any) {
        // this.el.dispatchEvent(new CustomEvent(eventName, { detail: data }));
        switch (eventName) {
            case "tabAdd":
                this.tabAfterAdd.emit(data);
                break;
            case "tabRemove":
                this.tabAfterRemove.emit(data);
                break;
            case "activeTabChange":
                this.activeTabChanged.emit(data);
                break;
            default:
                break;
        }
    }

    animationStyleEl: HTMLStyleElement;
    setupStyleEl() {
        this.animationStyleEl = document.createElement('style');
        this.navTabSetElRef.appendChild(this.animationStyleEl);
    }

    setupEvents() {
        window.addEventListener('resize', event => this.layoutTabs());
        // this.el.addEventListener('dblclick', event => this.addTab({
        //     title: 'New Tab',
        //     favicon: '/assets/images/default-favicon.png',
        //     outlet: 'aux' + (new Date).getTime.toLocaleString()
        // }));

        // this.el.addEventListener('click', ({ target }) => {
        //     let targetEl = target as Element;
        //     if (targetEl.classList.contains('chrome-tab')) {
        //         this.setCurrentTab(targetEl);
        //     } else if (targetEl.classList.contains('chrome-tab-close')) {
        //         this.removeTab(targetEl.parentNode as Element);
        //     } else if (targetEl.classList.contains('chrome-tab-title') ||
        //         targetEl.classList.contains('chrome-tab-favicon')) {
        //         this.setCurrentTab(targetEl.parentNode as Element);
        //     }
        // });
    }

    get tabEls(): Element[] {
        // return this.tabComps.map(tab => tab.nativeElement);
        return Array.prototype.slice.call(this.navTabSetElRef.querySelectorAll('.chrome-tab'));
    }

    get tabCount() {
        return this.navTabModels.length;
    }

    get tabContentEl() {
        return this._tabContentEl.nativeElement as Element; //this.el.querySelector('.chrome-tabs-content');
    }

    get tabWidth() {
        const tabsContentWidth = this.tabContentEl.clientWidth - this.options.tabOverlapDistance - 25;
        const width = (tabsContentWidth / (this.tabEls.length - 1)) + this.options.tabOverlapDistance;
        return Math.max(this.options.minWidth, Math.min(this.options.maxWidth, width));
    }

    get tabEffectiveWidth() {
        return this.tabWidth - this.options.tabOverlapDistance;
    }

    get tabPositions() {
        const tabEffectiveWidth = this.tabEffectiveWidth;
        let left = 0;
        let positions: any[] = [];

        this.tabEls.forEach((tabEl: Element, i: number) => {
            positions.push(left);
            left += tabEffectiveWidth;
        });
        return positions;
    }

    layoutTabs() {
        const tabWidth = this.tabWidth;

        this.cleanUpPreviouslyDraggedTabs();
        this.tabEls.forEach((tabEl: any, i) => {
            if (i == this.tabEls.length - 1) {
                tabEl.style.width = 25 + 'px';
                tabEl.style.height = 43 + 'px';
            }
            else tabEl.style.width = tabWidth + 'px';
        });
        requestAnimationFrame(() => {
            let styleHTML = ''
            this.tabPositions.forEach((left, i) => {

                let currLeft = left;
                if (i == this.tabEls.length - 1) currLeft = left + 1;
                styleHTML += `
            .chrome-tabs[data-chrome-tabs-instance-id="${instanceId}"] .chrome-tab:nth-child(${i + 1}) {
              transform: translate3d(${currLeft}px, 0, 0)
            }
          `;
            });
            this.animationStyleEl.innerHTML = styleHTML;
        });
    }

    isJustAdded: boolean = false;
    async addTab(tabModel: NavTabModel) {
        this.isJustAdded = true;
        tabModel.order = this.navTabModels.length + 1;
        setTimeout(() => this.isJustAdded = false, 15);
        this.navTabModels.push(tabModel);

        this.emit('tabAdd', tabModel);
        if (!tabModel.daemon) this.select(tabModel);
        this.getNavTabModelOrderList();
        setTimeout(() => {
            this.layoutTabs();
            this.setupDraggabilly();
        }, 20);
    }

    async onTabClick(event: Event, tab: NavTabModel) {
        let targetEl = event.target as Element;
        if (targetEl.classList.contains('chrome-tab')) {
            this.select(tab);
        } else if (targetEl.classList.contains('chrome-tab-close')) {
            await this.removeNavTab(tab);
        } else if (targetEl.classList.contains('chrome-tab-title') ||
            targetEl.classList.contains('chrome-tab-favicon')) {
            this.select(tab);
        }
    }

    navTab_contextmenu(event: MouseEvent, navTabModel: NavTabModel) {
        this._navTabContextMenu.show(event, navTabModel);
    }
    tabMenuItems: MenuItem[] = [
        {
            label: '关闭标签页',
            icon: 'fa-chevron-right',
            command: (event) => this.removeNavTab(event.data)
        },
        {
            label: '关闭左侧标标签页',
            icon: 'fa-chevron-left',
            command: (event) => console.log(event)
        }
    ];
    onMenuPopup(event: Event, navTabModel: NavTabModel) {
        event.stopPropagation();
        this.navTabModels.forEach(item => {
            item.checked = false;
        });
        this.selectedItems = [];
        this._popupMenuRef.toggle(event);
        this.select(navTabModel);
        this.menuItemHandler();
    }
    onMenuItemClick(event: Event, navTabModel: NavTabModel) {
        // event.stopPropagation();
        this.select(navTabModel);
        this.closePopupMenu();
    }
    closeAll_MenuItemClick(event: Event) {
        event.stopPropagation();
        this.closeNavTabs();
        this.closePopupMenu();
    }
    close_menuItemClick(event: Event, navItem: NavTabModel) {
        event.stopPropagation();
        this.closePopupMenu();
        this.removeNavTab(navItem);
    }
    check_menuItemClick(event: Event, navItem: NavTabModel) {
        event.stopPropagation();
        navItem.checked = !navItem.checked;
        this.selectedItems = this.navTabModels.filter(navItem => {
            return navItem.checked;
        }) || [];
    }
    closePopupMenu() {
        this._popupMenuRef.close();
        this.selectedItems = [];
    }
    selectedItems: NavTabModel[] = [];
    closeSelected_MenuItemClick(event: Event) {
        event.stopPropagation();
        this._popupMenuRef.close();
        for (var index = 0; index < this.selectedItems.length; index++) {
            this.removeNavTab(this.selectedItems[index]);
        }
    }
    close_mouseoverHandler(event: Event) {
        event.stopPropagation();
        this.renderer.addClass(event.target, "fa-times-circle");
    }
    close_mouseleaveHandler(event: Event) {
        event.stopPropagation();
        this.renderer.removeClass(event.target, "fa-times-circle");
    }

    closeBeforeCheckFn: Function = async (event: any) => {
        return new Promise<any>(resolve => {
            return resolve(event.cancel);
        });
    }

    /**
     * close self sucessful callback
     */
    closeAfterFn: Function = () => { };
    async closeNavTabChildPage(taskModal: NavTabModel) {
        let state$ = new BehaviorSubject<any>(null);
        let eventArgs = { sender: this, cancel: true, data: taskModal };
        let allowClose = await this.closeBeforeCheckFn(eventArgs);
        if (allowClose) {
            let componentFactoryRef = await this.globalService.GetOrCreateComponentFactory(taskModal.key);
            if (componentFactoryRef) {
                componentFactoryRef.closeAllPages({ target: taskModal.key, data: { sender: state$ } });
            } else {
                state$.next({ processFinish: true, result: true });
            }
        }
        return state$;
    }

    resetNavTabModelOrder() {
        for (var index = 0; index < this.navTabModels.length; index++) {
            this.navTabModels[index].order = index + 1;
        }
        this.getNavTabModelOrderList();
    }
    navTabClosingMap: Map<string, string> = new Map<string, string>();
    async removeNavTab(tabModel: NavTabModel) {
        if (!!!tabModel) return;
        if (tabModel.key == 'main') return;
        if (this.navTabClosingMap.has(tabModel.key)) {
            console.log("TAB正在关闭......");
            return;
        }
        this.navTabClosingMap.set(tabModel.key, tabModel.key);
        let result = await this.closeNavTabChildPage(tabModel);
        result.subscribe((res: { processFinish: boolean; result: boolean }) => {
            if (res && res.processFinish) {
                if (res.result) {
                    let enabledModels = this.tabHeaders;
                    if (this.tabHeaders.length > 2) enabledModels = this.tabHeaders.filter(tab => tab != this.homeTab);
                    let idx = enabledModels.findIndex(value => value == tabModel);
                    if (idx > -1) {
                        if (enabledModels[idx - 1]) {
                            this.select(enabledModels[idx - 1]);
                        } else if (enabledModels[idx + 1]) {
                            this.select(enabledModels[idx + 1]);
                        }
                        let tabIndex = this.navTabModels.findIndex(value => value == tabModel)
                        let removeTabModel = this.navTabModels.splice(tabIndex, 1);
                        this.resetNavTabModelOrder();

                        let r = {};
                        r[tabModel.outlet] = null;
                        this.routerService.navigateToOutlet(r, null, this.activeRouter);
                        this.emit('tabRemove', { removeTabModel });
                        setTimeout(() => {
                            this.layoutTabs();
                            this.setupDraggabilly();
                        }, 10);
                    }
                }
                this.navTabClosingMap.delete(tabModel.key);
                result.unsubscribe();
                result = null;
            }
        });
    }

    hasNavTab(tabKey: string) {
        return this.navTabModels.some(tab => tab.key == tabKey || tab.outlet == tabKey);
    }


    cleanUpPreviouslyDraggedTabs() {
        this.tabEls.forEach((tabEl: Element) => tabEl.classList.remove('chrome-tab-just-dragged'));
    }

    setupDraggabilly() {
        const tabEls = this.tabEls;
        const tabEffectiveWidth = this.tabEffectiveWidth;
        const tabPositions = this.tabPositions;

        this.draggabillyInstances.forEach(draggabillyInstance => draggabillyInstance.destroy());

        tabEls.forEach((tabEl: Element, originalIndex: number) => {
            if (originalIndex == 0 || originalIndex == tabEls.length - 1) return;
            const originalTabPositionX = tabPositions[originalIndex]
            const draggabillyInstance = new Draggabilly(tabEl, {
                axis: 'x',
                containment: this.tabContentEl
            });

            this.draggabillyInstances.push(draggabillyInstance);

            draggabillyInstance.on('dragStart', () => {
                this.cleanUpPreviouslyDraggedTabs();
                tabEl.classList.add('chrome-tab-currently-dragged');
                this.navTabSetElRef.classList.add('chrome-tabs-sorting');
                (tabEl as HTMLStyleElement).style.zIndex = '9999999';
                // this.fixZIndexes();
            });

            draggabillyInstance.on('dragEnd', () => {
                const finalTranslateX = parseFloat((tabEl as HTMLStyleElement).style.left);
                (tabEl as HTMLStyleElement).style.transform = `translate3d(0, 0, 0)`;

                // Animate dragged tab back into its place
                requestAnimationFrame(() => {
                    (tabEl as HTMLStyleElement).style.left = '0';
                    (tabEl as HTMLStyleElement).style.transform = `translate3d(${finalTranslateX}px, 0, 0)`;

                    requestAnimationFrame(() => {
                        tabEl.classList.remove('chrome-tab-currently-dragged');
                        this.navTabSetElRef.classList.remove('chrome-tabs-sorting');

                        // this.setCurrentTab(tabEl);
                        if (this.mouseDownModel) {
                            this.select(this.mouseDownModel);
                            this.mouseDownModel = null;
                        }

                        tabEl.classList.add('chrome-tab-just-dragged');

                        requestAnimationFrame(() => {
                            (tabEl as HTMLStyleElement).style.transform = '';

                            this.setupDraggabilly();
                        })
                    })
                })
            })

            draggabillyInstance.on('dragMove', (event: Event, pointer: any, moveVector: any) => {

                // Current index be computed within the event since it can change during the dragMove
                const tabEls = this.tabEls;
                const currentIndex = tabEls.indexOf(tabEl);

                const currentTabPositionX = originalTabPositionX + moveVector.x;
                const destinationIndex = Math.max(0, Math.min(tabEls.length, Math.floor((currentTabPositionX + (tabEffectiveWidth / 2)) / tabEffectiveWidth)));

                if (currentIndex !== destinationIndex) {
                    this.animateTabMove(tabEl, currentIndex, destinationIndex);
                }
            });
        })
    }

    animateTabMove(tabEl: Element, originIndex: number, destinationIndex: number) {
        if (destinationIndex == 0 || destinationIndex == this.tabEls.length - 1) return;
        let moved: boolean = false;
        if (destinationIndex < originIndex) {
            tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex]);
            moved = true;
        } else {
            tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex + 1]);
            moved = true;
        }
        if (moved) {
            let originTab = this.navTabModels[originIndex];
            let destTab = this.navTabModels[destinationIndex];
            [originTab.order, destTab.order] = [destTab.order, originTab.order];
            this.getNavTabModelOrderList();
        }
    }
}