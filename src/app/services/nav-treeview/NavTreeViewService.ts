import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NavTreeNode } from '../../components/nav-tree-view/nav-tree-node';


@Injectable()
export class NavTreeNodeService {
    constructor() {
    }

    items: NavTreeNode;

    getTreeNodes(key: string): Observable<NavTreeNode> {
        // return this._store.getTreeNodes(key);
        return Observable.of(this.items);
    }

    loadTreeNodes(root: string) {
        // if (root.url) {
        //     this._store.dispatchAction({ key: root.key, url: root.url, name: 'LOAD_NODES' });
        // }
        // this._store['show']('show');
        return this;
    }
    //   private handleAction() {
    //     // fs.stat("c:\test",(err,stats)=>{console.log(stats); });
    //     let contentHeaders = new Headers();
    //     contentHeaders.append('Accept', 'application/json');
    //     contentHeaders.append('Content-Type', 'application/json');
    //     // if (action.name === 'LOAD_NODES') {
    //     //     if (this.nodes[action.key]) {
    //     //         this.treeNodes[action.key].next(this.nodes[action.key]);
    //     //     }
    //     //     else {
    //             this.http
    //                 .get(action.url, { headers: contentHeaders })
    //                 .map((res: Response) => { return res.json(); })
    //                 .subscribe(res => {
    //                     this.nodes[action.key] = treeNodeReducer(res, action);
    //                     this.treeNodes[action.key].next(this.nodes[action.key]);
    //                 });
    //         }
    //     }

    // }

    // getTreeNodes(key) {
    //     // if (!this.treeNodes.hasOwnProperty(key)) {
    //     //     this.treeNodes[key] = new Subject<Array<TreeNode>>();
    //     // }
    //     // return this.treeNodes[key].asObservable();
    // }
}