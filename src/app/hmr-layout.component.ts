import { Component } from '@angular/core';
import { DesktopItem } from './Models/desktop-Item';
import { AuthService } from './services/auth.service';


@Component({
    selector: 'x-pc-layout',
    template: `
        <x-header></x-header>
        <x-content>
            <x-left-sidebar></x-left-sidebar>
            <x-center-content></x-center-content>
            <x-right-sidebar></x-right-sidebar>
        </x-content>
        <x-footer></x-footer>
        <x-pageloading globalLoad="true"></x-pageloading>
    `,
    styleUrls: ['pc.layout.css']
})
export class HMRLayoutComponent {
    items: DesktopItem[] = [
        { title: "计划采购订单", favicon: "assets/img/home.png", path: "/pc/news", subsystem: "news" },
        { title: "采购订单", favicon: "assets/img/save.png", path: "/pc/staticnews", subsystem: "news" },
        { title: "销售订单", favicon: "assets/img/setting.png", path: "/pc/home", subsystem: "news" },
        { title: "销售订单明细查询", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "外协订单", favicon: "assets/img/save.png", path: "/pc/d3", subsystem: "news" },
        { title: "外协订单明细查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "计划外协订单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "生产订单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
        { title: "生产订单物料查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "生产领料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "仓库调拨单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
        { title: "生产入库单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "销售送货单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "news" },
        { title: "生产计划MPS", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "news" },
        { title: "外协领料单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "news" },
        { title: "生产订单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
        { title: "生产订单物料查询", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
        { title: "生产领料单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "snews" },
        { title: "仓库调拨单", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
        { title: "生产入库单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },
        { title: "销售送货单", favicon: "assets/img/home.png", path: "/auth/login", subsystem: "snews" },
        { title: "生产计划MPS", favicon: "assets/img/save.png", path: "/auth/login", subsystem: "snews" },
        { title: "外协领料单", favicon: "assets/img/setting.png", path: "/auth/login", subsystem: "snews" },

    ];
    constructor(private authService: AuthService) {
    }

    logout() {
        this.authService.logout('/auth/login');
    }
}
