import { Component, OnInit, Output, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewEncapsulation, EventEmitter, Injectable, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { LoadScriptService } from '../../services/load-script-service';
import { ChromeTabComponent } from './chrome-tab.component';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../services/router.service';
import { AppStoreService } from '../../services/app.store.service';
import { ISubject, IAction } from '../../Models/IAction';
import {
    AppTaskBarActions, AddTabAction, RemoveTabAction, SelectTabAction,
    ExistTabAction, CreateTabAction, ShowFormModalAction, ShowFormAction
} from '../../actions/app-main-tab/app-main-tab-actions';
import { ActionsBase, GetTaskGroupModalAction, CloseTaskGroupAction, CloseAllTaskGroupAction, SaleComponentFactoryType } from '../../actions/actions-base';

import { PurOrderActions } from '../../actions/pur/pur-order-actions';
import { BehaviorSubject } from 'rxjs/Rx';
import { isFunction } from '../toasty/toasty.utils';
import { ModalOptions } from '../modal/modal-options.model';
import { HostViewContainerDirective } from '../directives/host.view.container';
import { FormService } from '../../components/form/FormService';
import { FormOptions } from '../../components/form/FormOptions';
import { IPageModel } from '../../basic/IFormModel';
import { SaleComponent } from '../../sale/sale.component';
import { PageViewerOptions } from '../page-viewer/page-viewer.options';
import { ReportViewer } from '../report-viewer/report.viewer';
declare var Draggabilly: any;

export interface TabModel {
    /**
     * 主键
     */
    key: string;
    /**
     * 名称
     */
    name?: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 图标路径
     */
    favicon: string;
    /**
     * 组件入口
     */
    outlet: string;
    /**
     * 相对访问路径
     */
    path?: string;
    /**
     *  指示是否活动
     */
    active?: boolean;
    /**
     * Tab方式显示
     */
    showTabContent?: boolean;
    /**
     * 后台运行
     */
    daemon?: boolean;
}
let instanceId = 0;

//   
@Component({
    moduleId: module.id,
    selector: 'x-chrome-tabs',
    templateUrl: 'chrome-tabs.component.html',
    styleUrls: [
        'common.css',
        'chrome-tabs.component.css',
        'primeng/resources/primeng.min.css',
        'primeng/resources/themes/omega/theme.css',
        'font-awesome-4.7.0/css/font-awesome.min.css',
        'bootstrap/css/bootstrap.min.css',
        'chrome-themes.css',
        'flexboxgrid/flexboxgrid.css',
        './toasty/style-default.css',
        './toasty/style-bootstrap.css',
        './toasty/style-material.css'
    ],
    encapsulation: ViewEncapsulation.Native
})
export class ChromeTabsComponent implements OnInit, AfterViewInit {
    @ViewChild("tabs") mytabs: ElementRef;
    @ViewChild("bottomBarEl") bottomBarEl: ElementRef;
    @ViewChild("tabContentEl") _tabContentEl: ElementRef;
    @ViewChildren(ChromeTabComponent, { read: ElementRef }) tabComps: QueryList<ElementRef>;
    @ViewChild(HostViewContainerDirective) hostFactoryContainer: HostViewContainerDirective;

    @Output() tabAfterAdd: EventEmitter<TabModel> = new EventEmitter<TabModel>();
    @Output() tabAfterRemove: EventEmitter<TabModel> = new EventEmitter<TabModel>();
    @Output() activeTabChanged: EventEmitter<TabModel> = new EventEmitter<TabModel>();

    @Output() tabBeforeAdd: EventEmitter<TabModel> = new EventEmitter<TabModel>();
    @Output() tabBeforeRemove: EventEmitter<TabModel> = new EventEmitter<TabModel>();

    defaultTapProperties = {
        title: '',
        favicon: '',
        outlet: ''
    };
    homeTab: TabModel = {
        key: 'main',
        title: '系统导航',
        favicon: '/assets/images/google-favicon.png',
        outlet: '',
        active: true,
        showTabContent: true,
        daemon: false
    };
    tabModels: TabModel[] = [this.homeTab];

    get tabHeaders() {
        return this.tabModels.filter(tab => !!!tab.daemon);
    }

    selected: TabModel;
    draggabillyInstances: any[] = [];
    constructor(private loadScript: LoadScriptService,
        private routerService: RouterService,
        private activeRouter: ActivatedRoute,
        private appStore: AppStoreService,
        public viewContainerRef: ViewContainerRef,
        private dialogModalService: FormService,
        private changeDetectorRef: ChangeDetectorRef) {
        this.reducer();
        this.appStore.taskManager = this;

    }

    taskBarSubject: ISubject;
    appTabSetActions = new AppTaskBarActions();
    reducer() {
        this.taskBarSubject = this.appStore.select(this.appTabSetActions.key);
        this.taskBarSubject.subject.subscribe(act => {
            switch (true) {
                case act instanceof AddTabAction:
                    this.addTab(act.data.state);
                    break;
                case act instanceof RemoveTabAction:
                    this.removeTab(act.data.state);
                    break;
                case act instanceof SelectTabAction:
                    this.select(act.data.state);
                    break;
                case act instanceof ExistTabAction:
                    let retValue = this.existTab(act.data.state);
                    if (act.data.sender) {
                        act.data.sender.next(retValue);
                    }
                    break;
                case act instanceof CreateTabAction:
                    this.createTaskGroup(act.data.state);
                    break;
                case act instanceof ShowFormModalAction:
                    this.showModal(act.data.state);
                    break;
                case act instanceof ShowFormAction:
                    this.show(act.data.state);
                    break;
                case act instanceof GetTaskGroupModalAction:
                    let taskGroupModal = this.getTaskGroup(act.data.state.key);
                    if (act.data.sender) {
                        act.data.sender.next(taskGroupModal);
                    }
                    break;
                case act instanceof CloseTaskGroupAction:
                    this.closeTaskGroup(act.data.state.key);
                    break;
                case act instanceof CloseAllTaskGroupAction:
                    this.closeAllTaskGroup();
                    break;
                default:
                    break;
            }
        });
    }

    closeAllTaskGroup() {
        this.tabModels.forEach(taskGrp => {
            this.removeTab(taskGrp);
        });
    }
    closeTaskGroup(key: string | Function) {

        let parseKey: any = key;
        if (isFunction(parseKey)) {
            parseKey = parseKey();
        }
        let taskGrp = this.getTaskGroup(parseKey);
        if (taskGrp) {
            this.removeTab(taskGrp);
        }
    }
    closeTasking(key: string) {
        return this.taskClosing.has(key);
    }
    getTaskGroup(key: string) {
        let taskGrp = this.tabModels.find(t => t.key == key);
        return taskGrp;
    }
    hideTaskGroup(key: string | Function) {
        let parseKey: any = key;
        if (isFunction(parseKey)) {
            parseKey = parseKey();
        }
        let taskGrp = this.getTaskGroup(parseKey);
        this.getNextVisibleTab(taskGrp);
        taskGrp.daemon = true;
        //隐藏后设置当前活动TAB
    }

    getNextVisibleTab(tabModel: TabModel) {
        let enabledModels = this.tabHeaders;
        if (this.tabHeaders.length > 1) enabledModels = this.tabHeaders.filter(tab => tab != this.homeTab);
        let idx = enabledModels.findIndex(value => value == tabModel);
        if (enabledModels[idx - 1]) {
            this.select(enabledModels[idx - 1]);
        } else if (enabledModels[idx + 1]) {
            this.select(enabledModels[idx + 1]);
        }
    }
    async select(tab: TabModel) {
        if (!!!tab) return;
        if (this.selected) this.selected.active = false;
        //Tab页面切换时,隐藏非活动页面所有已打开的非最小化窗体,排除homeTab

        let factoryRef = this.selected && await this.appStore.GetOrCreateComponentFactory(this.selected.key);
        factoryRef && factoryRef.hidePageModels()
        factoryRef = tab && await this.appStore.GetOrCreateComponentFactory(tab.key);
        factoryRef && factoryRef.showPageModels();

        this.selected = tab;
        this.selected.active = true;
        this.emit('activeTabChange', { tab });
    }
    ngOnInit() {
        this.select(this.tabModels[0]);

    }

    ngAfterViewInit() {
        let el = this.mytabs.nativeElement as HTMLElement;
        this.loadScript.loadDraggabilly.then(drag => {
            this.init(el, {
                tabOverlapDistance: 14,
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
        this.appStore.dispatch(this.appTabSetActions.addTabAction({
            sender: this.appTabSetActions.key,
            state: addTabModel
        }));
    }
    async createTaskGroup(tab: TabModel) {
        let factoryRef, formInstance;
        if (this.existTab(tab.key)) {

            let curr = this.tabModels.find(t => t.key == tab.key);
            if (!tab.daemon) {
                curr.daemon = false;
                this.layoutTabs();
            }
            this.select(curr);
            factoryRef = await this.appStore.GetOrCreateComponentFactory(tab.key);
        } else {
            this.addTab(tab);
            let r = {};
            r[tab.outlet] = tab.path;

            this.changeDetectorRef.detectChanges();
            await this.routerService.navigateToOutlet(r, { taskId: tab.key }, this.activeRouter);
            factoryRef = await this.appStore.GetOrCreateComponentFactory(tab.key);
        }
        return factoryRef;
    }


    getContentClass(tabModel: TabModel) {
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
            this.appStore.pageViewerService.showPage(options).subscribe(result);
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
            this.appStore.modalService.showForm(options).subscribe(result);
        }, 10);
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
            return this.appStore.modalService.showForm(options).subscribe(result);
        }, 10);
        let e = new Event('build');
        new CustomEvent("build2", { detail: { item: 234 } })
        let el: Element;
        el.dispatchEvent(e);
        return result;
    }

    showReportViewer(modalOptions: FormOptions = null) {
        let options: FormOptions = new FormOptions();
        options.responsive = true;
        options.width = document.body.clientWidth * 0.618;
        options.height = document.body.clientHeight * 0.618;
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
        this.appStore.modalService.showForm(options)
            .subscribe((res: { action: string, status: string }) => {

            });

    }

    PrintReport(modalOptions: FormOptions = null) {
        let options: FormOptions = new FormOptions();
        options.responsive = true;
        options.width = 800;
        options.height = 600;
        options.modal = true;
        options.visible = true;
        options.closable = true;
        options.resizable = true;
        options.titleAlign = 1;
        options.rootContainer = this.viewContainerRef;
        options.injector = this.viewContainerRef.parentInjector;

        if (modalOptions) {
            Object.assign(options, modalOptions);
        }
        options.componentOutlets = [ReportViewer];
        options.enableFlex = true;
        options.header = "报表查看器";
        this.appStore.modalService.showForm(options)
            .subscribe((res: { action: string, status: string }) => {

            });

    }

    onRemoveTab() {
        this.removeTab(this.selected);
        // this.removeTab(this.el.querySelector('.chrome-tab-current'));
    }
    onToggleTheme() {
        if (this.el.classList.contains('chrome-tabs-dark-theme')) {
            document.documentElement.classList.remove('dark-theme');
            this.el.classList.remove('chrome-tabs-dark-theme');
        } else {
            document.documentElement.classList.add('dark-theme');
            this.el.classList.add('chrome-tabs-dark-theme');
        }
    }

    mouseDownModel: TabModel;
    onTabMouseDown(event: Event, data: TabModel) {
        this.mouseDownModel = data;
    }

    el: HTMLElement;
    options: any;
    init(el: Element, options: any) {
        this.el = el as HTMLElement;
        this.options = options

        // this.instanceId = instanceId
        instanceId += 1;
        this.el.setAttribute('data-chrome-tabs-instance-id', instanceId.toString(10));

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
        this.el.appendChild(this.animationStyleEl);
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
        return Array.prototype.slice.call(this.el.querySelectorAll('.chrome-tab'));
    }

    get tabCount() {
        return this.tabModels.length;
    }

    get tabContentEl() {
        return this._tabContentEl.nativeElement as Element; //this.el.querySelector('.chrome-tabs-content');
    }

    get tabWidth() {
        const tabsContentWidth = this.tabContentEl.clientWidth - this.options.tabOverlapDistance;
        const width = (tabsContentWidth / this.tabEls.length) + this.options.tabOverlapDistance;
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
        this.tabEls.forEach((tabEl: any) => tabEl.style.width = tabWidth + 'px');
        requestAnimationFrame(() => {
            let styleHTML = ''
            this.tabPositions.forEach((left, i) => {
                styleHTML += `
            .chrome-tabs[data-chrome-tabs-instance-id="${instanceId}"] .chrome-tab:nth-child(${i + 1}) {
              transform: translate3d(${left}px, 0, 0)
            }
          `;
            });
            this.animationStyleEl.innerHTML = styleHTML;
        });
    }


    isJustAdded: boolean = false;
    addTab(tabModel: TabModel) {
        this.isJustAdded = true;
        setTimeout(() => this.isJustAdded = false, 500);
        this.tabModels.push(tabModel);

        this.emit('tabAdd', tabModel);
        if (!tabModel.daemon) this.select(tabModel);

        setTimeout(() => {
            this.layoutTabs();
            this.setupDraggabilly();
        }, 20);
    }

    async onTabClick(event: Event, tab: TabModel) {
        let targetEl = event.target as Element;
        if (targetEl.classList.contains('chrome-tab')) {
            this.select(tab);
        } else if (targetEl.classList.contains('chrome-tab-close')) {
            await this.removeTab(tab);
        } else if (targetEl.classList.contains('chrome-tab-title') ||
            targetEl.classList.contains('chrome-tab-favicon')) {
            this.select(tab);
        }
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
    async closeTaskChildPage(taskModal: TabModel) {
        let state$ = new BehaviorSubject<any>(null);
        let eventArgs = { sender: this, cancel: true, data: taskModal };
        let allowClose = await this.closeBeforeCheckFn(eventArgs);
        if (allowClose) {
            let componentFactoryRef = await this.appStore.GetOrCreateComponentFactory(taskModal.key);
            if (componentFactoryRef) {
                componentFactoryRef.closeAllPages({ target: taskModal.key, data: { sender: state$ } });
            } else {
                state$.next({ processFinish: true, result: true });
            }
        }
        return state$;
    }

    taskClosing: Map<string, string> = new Map<string, string>();
    async removeTab(tabModel: TabModel) {
        if (!!!tabModel) return;
        if (tabModel.key == 'main') return;
        if (this.taskClosing.has(tabModel.key)) {
            console.log("TAB正在关闭......");
            return;
        }
        this.taskClosing.set(tabModel.key, tabModel.key);
        let result = await this.closeTaskChildPage(tabModel);
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
                        let tabIndex = this.tabModels.findIndex(value => value == tabModel)
                        let removeTabModel = this.tabModels.splice(tabIndex, 1);

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
                this.taskClosing.delete(tabModel.key);
                result.unsubscribe();
                result = null;
            }
        });
    }

    async removeTabHandler(tabmodel: TabModel) {

    }

    existTab(tabKey: string) {
        return this.tabModels.some(tab => tab.key == tabKey || tab.outlet == tabKey);
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
            if (originalIndex == 0) return;
            const originalTabPositionX = tabPositions[originalIndex]
            const draggabillyInstance = new Draggabilly(tabEl, {
                axis: 'x',
                containment: this.tabContentEl
            });

            this.draggabillyInstances.push(draggabillyInstance);

            draggabillyInstance.on('dragStart', () => {
                this.cleanUpPreviouslyDraggedTabs();
                tabEl.classList.add('chrome-tab-currently-dragged');
                this.el.classList.add('chrome-tabs-sorting');
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
                        this.el.classList.remove('chrome-tabs-sorting');

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
            })
        })
    }

    animateTabMove(tabEl: Element, originIndex: number, destinationIndex: number) {
        if (destinationIndex == 0) { return; }
        if (destinationIndex < originIndex) {
            tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex]);
        } else {
            tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex + 1]);
        }
    }
}