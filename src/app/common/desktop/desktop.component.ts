import { Component, ElementRef, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DesktopItem } from '../../Models/desktop-Item';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { styleUntils } from '../../untils/style';
import { AppStoreService } from '../../services/app.store.service';
import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';
import { UUID } from '../../untils/uuid';
import { ShowTypeEnum } from '../../basic/show-type-enum';
import { NavTabModel } from '../nav-tabs/NavTabModel';
import { MenuItem } from '../../components/common/api';
import { ContextMenu } from '../../components/contextmenu/contextmenu';

@Component({
    selector: 'x-desktop',
    templateUrl: 'desktop.component.html',
    styleUrls: ['desktop.component.css']
})
export class DesktopComponent implements OnInit, AfterViewInit {


    @ViewChild('desktopItemContextMenu') _itemContextMenu: ContextMenu;
    @ViewChild('desktopContextMenu') _desktopContextMenu: ContextMenu;

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

    desktopItem_contextmenu(event: MouseEvent, itemModel: DesktopItem) {
        this._itemContextMenu.show(event, itemModel);
        event.stopPropagation();
    }
    desktopItemMenuItems: MenuItem[] = [
        {
            label: '打开模板',
            icon: 'fa-chevron-right',
            command: (event) => this.openItem({ event, item: event.data })
        },
        {
            label: '移除模板',
            icon: 'fa-chevron-left',
            command: (event) => console.log(event)
        },
        {
            label: '模板属性',
            icon: 'fa-chevron-left',
            command: (event) => console.log(event)
        }
    ];

    // <!--
    // function document.oncontextmenu()
    // {
    // return false;
    // }


    // function nocontextmenu()
    // {
    // if(document.all) {
    // event.cancelBubble=true;
    // event.returnvalue=false;
    // return false;
    // }
    // }
    // -->
    // </script>
    // 第二种方法：在body里加入onmousedown="rclick()" oncontextmenu= "nocontextmenu()"
    // <br>
    // <script language="javascript">
    // <!--
    // function rclick()
    // {
    // if(document.all) {
    // if (event.button == 2){
    // event.returnvalue=false;
    // }
    // }
    // }
    desktop_contextmenu(event: MouseEvent) {
        this._desktopContextMenu.show(event);
        event.stopPropagation();
    }
    desktopMenuItems: MenuItem[] = [
        {
            label: '添加模板',
            icon: 'fa-plus',
            command: (event) => console.log(event.data)
        },
        {
            label: '刷新',
            icon: 'fa-refresh',
            command: (event) => location.reload(true)
        },
        {
            label: '桌面配置',
            icon: 'fa-cog',
            command: (event) => console.log(event)
        }
    ];

    private async openItem(event: any) {
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
    async itemDoubleClickHandler(event: any) {
        this.openItem(event);
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
