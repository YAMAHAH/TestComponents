import { Component, ElementRef, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DesktopItem } from '../../Models/desktop-Item';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { styleUntils } from '../../untils/style';
import { AppStoreService } from '../../services/app.store.service';
import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';
import { UUID } from '../../untils/uuid';
import { ShowTypeEnum } from '../../basic/show-type-enum';
import { NavTabModel } from '../nav-tabs/NavTabModel';

@Component({
    selector: 'x-desktop',
    templateUrl: 'desktop.component.html',
    styleUrls: ['desktop.component.css']
})
export class DesktopComponent implements OnInit, AfterViewInit {
    // items: DesktopItem[] = [
    //     { title: "计划采购订单", favicon: "assets/img/home.png", path: "/pc/news", subsystem: "news" },
    //     { key: 'pur', title: "采购订单", favicon: "assets/img/save.png", path: "purOrder", outlet: "pur", subsystem: "news" },
    //     { key: 'sale', title: "销售订单", favicon: "assets/img/setting.png", path: "sale", outlet: "sale", subsystem: "news" },
    //     { title: "销售订单明细查询", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
    //     { title: "外协订单", favicon: "assets/img/save.png", path: "/pc/d3", subsystem: "news" },
    //     { title: "外协订单明细查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
    //     { title: "计划外协订单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
    //     { title: "生产订单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
    //     { title: "生产订单物料查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
    //     { title: "生产领料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
    //     { title: "仓库调拨单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
    //     { title: "生产入库单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
    //     { title: "销售送货单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
    //     { title: "生产计划MPS", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
    //     { title: "外协领料单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
    //     { title: "生产报工单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
    //     { title: "生产订单明细查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
    //     { title: "生产退料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "snews" },
    //     { title: "仓库盘点单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
    //     { title: "生产返工单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
    //     { title: "销售退货单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "snews" },
    //     { title: "计划外生产计划单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
    //     { title: "计划外需求分析单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
    //     { title: "产品单层BOM维护", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "myapp" },
    //     { title: "产品层次BOM", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "myapp" },
    //     { title: "生产补料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "myapp" },
    //     { title: "盘点盈亏单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "myapp" },
    //     { title: "生产通知单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "myapp" },
    //     { title: "销售挂账单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "myapp" },
    //     { title: "应收款明细查询", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "myapp" },
    //     { title: "产品资料", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "myapp" },
    // ];

    get items() {
        return this.appStore.commandLinks;
    }
    subSystem: string = "news";
    constructor(
        private appStore: AppStoreService,
        private activeRouter: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef) {
        // this.activeRouter.data.subscribe((data: any) => {
        //     this.subSystem = data.subsystem;
        // });
        // this.activeRouter.params
        //     .map(p => p['id'])
        //     .subscribe(id => {
        //         if (id) this.subSystem = id;
        //     });
        this.activeRouter.queryParams
            .map(p => p['subappid'])
            .subscribe(id => {
                if (id) this.subSystem = id;
            });
    }
    ngOnInit() { }
    ngAfterViewInit() {
        this.setupStyleEl();
    }

    async itemDoubleClickHandler(event: any) {
        // let mainTabActions = new AppTaskBarActions();
        let navItem = event.item as DesktopItem;
        if (navItem.key.length < 8) {
            navItem.key = UUID.uuid(10, 10).toString();
        }
        let taskGrp: NavTabModel = {
            key: navItem.key,
            name: navItem.key,
            title: navItem.title,
            favicon: navItem.favicon,
            outlet: navItem.outlet,
            active: false,
            showTabContent: this.appStore.showType === ShowTypeEnum.tab ? true : false,
            path: navItem.path,
            daemon: false
        };
        var result = await this.appStore.navTabManager.createNavTab(taskGrp);
        result && result.createGroupList({
            showType: this.appStore.showType || ShowTypeEnum.showForm,
            resolve: { data: 'resolve data' }
        });
    }

    get fCallback() {

        return (value: DesktopItem, index: number) => value.subsystem == this.subSystem;
    }

    setupStyleEl() {
        let styleHTML = `
            x-desktop {
                display:flex;
                flex:1 0 100%;
            }
        `;
        styleUntils.setElementStyle(this.elementRef.nativeElement as Element, styleHTML);
    }
}
