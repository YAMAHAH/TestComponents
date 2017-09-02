import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { treeUntils } from '../untils/tree';
import { IndexModule } from '../common/pc-index/index.module';
import { AppStoreService } from '../services/app.store.service';
import { AppTaskBarActions } from '../actions/app-main-tab/app-main-tab-actions';
import { NavTreeViewComponent } from '../components/nav-tree-view/nav-tree-view.component';
import { NavTreeNode } from '../components/nav-tree-view/nav-tree-node';
export interface purList {
    title: string;
    details: purDetail[];
    active: boolean,

}

export interface purDetail {
    key: string;
    active: boolean;
    parent?: purList;
}

@Component({
    selector: 'x-pur',
    templateUrl: './pur.html',
    styles: ['.el-hide{display:none;} .el-flex-show{ display:flex;flex:1;}']

})
export class PurComponent implements OnInit {
    constructor(private appStore: AppStoreService) {
    }
    purLists: purList[] = [
        { title: "采购订单组件列表-1", active: false, details: [{ key: "采购订单明细-1", active: false }, { key: "采购订单明细-2", active: false }] },
        { title: "采购订单组件列表-2", active: true, details: [{ key: "采购订单明细-3", active: true }, { key: "采购订单明细-4", active: false }] },
        { title: "采购订单组件列表-3", active: false, details: [{ key: "采购订单明细-5", active: false }, { key: "采购订单明细-6", active: false }] },
        { title: "采购订单组件列表-4", active: false, details: [{ key: "采购订单明细-7", active: false }, { key: "采购订单明细-8", active: false }] },
        { title: "采购订单组件列表-5", active: false, details: [{ key: "采购订单明细-9", active: false }, { key: "采购订单明细-10", active: false }] },
    ];

    @ViewChild(NavTreeViewComponent) navTreeView: NavTreeViewComponent;
    ngOnInit() {
        this.purLists.forEach(pl => {
            pl.details.forEach(dl => dl.parent = pl);
        });
    }

    getClass(purList: purList) {
        return {
            "el-hide": !purList.active,
            "el-flex-show": purList.active
        };
    }

    current: purList;

    setCurrent(purlist: purList) {
        if (this.current) {
            this.setChildActiveState(this.current, false);
        }
        purlist.active = true;
    }
    addPurList(purlist: purList) {
        if (purlist) {
            this.purLists.push(purlist);
            // this.navTreeView.addNode();
        }
    }
    removePurList(purlist: purList) {
        let idx = this.purLists.findIndex(pl => pl == purlist);
        if (idx > -1) {
            //this.navTreeView.
            this.purLists.splice(idx, 1);
        }
    }
    onItemClick(navNode: NavTreeNode) {
        let mainTabActions = new AppTaskBarActions();
        this.appStore.dispatch(mainTabActions.existTabAction({ state: "pur" }), true)
            .subscribe(res => console.log(res)).unsubscribe();
    }

    // setParentCheckState(node: pu) {
    //     let pnode = this.parent;
    //     while (pnode != null) {
    //         if (pnode.childs.every(nd => nd.checked == true && nd.isSemi == false)) {
    //             pnode.checked = true;
    //             pnode.isSemi = false;
    //         } else if (pnode.childs.find(nd => nd.checked == true || nd.isSemi == true)) {
    //             pnode.isSemi = true;
    //             pnode.checked = false;
    //         } else {
    //             pnode.checked = false;
    //             pnode.isSemi = false;
    //         }
    //         pnode = pnode.parent;
    //     }
    // }

    setChildActiveState(pl: purList, state: boolean) {
        pl.active = state;
        pl.details.forEach(dl => dl.active = state);
    }


}