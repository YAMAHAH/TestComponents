import { Injectable, EventEmitter, Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { IAction, ISubject } from '../Models/IAction';
import { UUID } from '../untils/uuid';
import { ChromeTabsComponent, TabModel } from '../common/chrome-tabs/chrome-tabs.component';
import { ShowTypeEnum } from '../basic/show-type-enum';
import { IComponentFactoryType } from '../basic/IComponentFactoryType';
import { IComponentFactoryContainer } from '../basic/IComponentFactoryContainer';
import { FormService } from '../components/form/FormService';
import { DesktopItem } from '../Models/desktop-Item';

@Injectable()
export class AppStoreService {
    private _store: Map<string, Subject<IAction>> = new Map<string, Subject<IAction>>();
    _appStore: Subject<IAction>;
    host: string = null;
    dispatch(action: IAction, hasState: boolean = false) {
        let state$ = null;
        if (hasState) {
            state$ = new BehaviorSubject<any>(null);
            action.data.sender = state$;
        }
        if (action.target) {
            this.select(action.target).subject.next(action);
        } else {
            this._appStore.next(action);
        }
        return state$;
    }
    select(subject: string, one: boolean = true): ISubject {
        if (!this._store.has(subject)) {
            this._store.set(subject, new Subject<IAction>());
        } else if (!one) {
            let id = UUID.uuid(8, 16);
            let newSubject = subject + "-" + id;  //idx.toString(10);
            return { key: newSubject, subject: this._store.get(newSubject) };
        }
        return { key: subject, subject: this._store.get(subject) };
    }
    getSubject(action: IAction, callback: (action: IAction) => void) {
        let state$ = new BehaviorSubject<any>(null);
        action.data.sender = state$;
        return { state: state$, callback: () => callback(action) };
    }
    delete(key: string) {
        if (this._store.has(key)) {
            this._store.get(key) && this._store.get(key).unsubscribe();
            this._store.delete(key);
        }
    }
    unsubscribe(key: string) {
        if (this._store.has(key)) {
            this._store.get(key).unsubscribe();
        }
    }

    public blockUIEvent: EventEmitter<any>;

    constructor(public modalService: FormService) {
        this.blockUIEvent = new EventEmitter();
        this._appStore = new Subject<IAction>();
    }

    public startBlock() {
        this.blockUIEvent.emit(true);
    }
    public stopBlock() {
        this.blockUIEvent.emit(false);
    }

    public taskManager: ChromeTabsComponent;
    public showType: ShowTypeEnum = ShowTypeEnum.tab;

    componentFactories: Map<string, IComponentFactoryType> = new Map<string, IComponentFactoryType>();

    registerComponentFactoryRef(factoryComponentType: IComponentFactoryType) {
        if (!!!factoryComponentType || this.componentFactories.has(factoryComponentType.key)) return;
        this.componentFactories.set(factoryComponentType.key, factoryComponentType);
        return () => this.unRegisterComponentFactoryRef(factoryComponentType);
    }
    unRegisterComponentFactoryRef(factoryComponentType: IComponentFactoryType) {
        if (!!!factoryComponentType || !this.componentFactories.has(factoryComponentType.key)) return;
        this.componentFactories.delete(factoryComponentType.key);
    }

    async GetOrCreateComponentFactory(factoryKey: string | Type<IComponentFactoryType>): Promise<IComponentFactoryContainer> {
        let compFactoryType, refEntries, refValue;
        if (typeof factoryKey === 'string') {
            if (factoryKey && this.componentFactories.has(factoryKey)) {
                return this.componentFactories.get(factoryKey).componentFactoryRef;
            }
        } else {

            refEntries = this.componentFactories.values();
            refValue = refEntries.next().value;
            while (refValue) {
                if (refValue instanceof factoryKey) {
                    return refValue.componentFactoryRef;
                }
                refValue = refEntries.next().value;
            }
            compFactoryType = new factoryKey();
        }
        return await this.createComponentFactory(compFactoryType ? compFactoryType.key : null);
    }

    commandLinks: DesktopItem[] = [
        { title: "计划采购订单", favicon: "assets/img/home.png", path: "/pc/news", subsystem: "news" },
        { key: 'pur', title: "采购订单", favicon: "assets/img/save.png", path: "purOrder", outlet: "pur", subsystem: "news" },
        { key: 'sale', title: "销售订单", favicon: "assets/img/setting.png", path: "sale", outlet: "sale", subsystem: "news" },
        { title: "销售订单明细查询", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "外协订单", favicon: "assets/img/save.png", path: "/pc/d3", subsystem: "news" },
        { title: "外协订单明细查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "计划外协订单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "生产订单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
        { title: "生产订单物料查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "生产领料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "仓库调拨单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
        { title: "生产入库单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "销售交货单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "生产计划MPS", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
        { title: "外协领料单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "生产报工单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
        { title: "生产订单明细查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
        { title: "生产退料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "snews" },
        { title: "仓库盘点单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
        { title: "生产返工单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
        { title: "销售退货单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "snews" },
        { title: "计划外生产计划单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
        { title: "计划外需求分析单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
        { title: "产品单层BOM维护", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "myapp" },
        { title: "产品层次BOM", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "myapp" },
        { title: "生产补料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "myapp" },
        { title: "盘点盈亏单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "myapp" },
        { title: "生产通知单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "myapp" },
        { title: "销售挂账单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "myapp" },
        { title: "应收款明细查询", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "myapp" },
        { title: "产品资料", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "myapp" },
    ];
    private async createComponentFactory(factoryKey: string): Promise<IComponentFactoryContainer> {
        let navItem = this.commandLinks.find(item => item.outlet === factoryKey);
        if (!navItem) return null;
        if (navItem.key.length < 8) {
            navItem.key = UUID.uuid(10, 10).toString();
        }
        let taskGrp: TabModel = {
            key: navItem.key,
            name: navItem.key,
            title: navItem.title,
            favicon: navItem.favicon,
            outlet: navItem.outlet,
            active: false,
            showTabContent: this.showType === ShowTypeEnum.tab ? true : false,
            path: navItem.path,
            daemon: true
        };
        return await this.taskManager.createTaskGroup(taskGrp);
    }
    public handleResolve(resolveData: any) {
        const resolve = resolveData || {};
        if (resolve.then) {
            resolve.then((data: any) => data);
        } else if (resolve.subscribe) {
            resolve.subscribe((data: any) => data);
        } else {
            return resolve || {};
        }
        return {};
    }

}
