import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavTreeNode } from './nav-tree-node';


@Component({
    selector: 'x-nav-tree-view',
    template: `<x-nav-treeview-item  (itemClick)="onItemClick($event)" (itemCloseClick)="onItemCloseClick($event)" [root]="root"></x-nav-treeview-item>`,
    styleUrls: ['nav-tree-view.component.css']
})
export class NavTreeViewComponent implements OnInit {
    @Input() root: NavTreeNode = new NavTreeNode("root", "root", "/pc/desktop", "", -1);

    @Output() itemClick: EventEmitter<NavTreeNode> = new EventEmitter<NavTreeNode>();

    @Output() itemCloseClick: EventEmitter<NavTreeNode> = new EventEmitter<NavTreeNode>();
    @Output() selectChanged: EventEmitter<NavTreeNode> = new EventEmitter<NavTreeNode>();
    constructor() {
    }

    current: NavTreeNode;
    onItemClick(navNode: NavTreeNode) {
        this.setCurrent(navNode);
        this.itemClick.next(navNode);
        this.selectChanged.emit(navNode);
    }

    onItemCloseClick(navNode: NavTreeNode) {
        this.itemCloseClick.next(navNode);
    }
    ngOnInit() {

    }
    expand(node: NavTreeNode, cb: (node: NavTreeNode) => void) {
        cb(node);
        node.childs.forEach(nd => {
            nd.parent = node;
            this.expand(nd, cb);
        });
    }

    setCurrent(node: NavTreeNode) {
        if (this.current) {
            this.current.selected = false;
        }

        if (!node) { this.current = null; return; }
        node.selected = true;
        this.current = node;
    }
    addNode(treeNode: NavTreeNode) {
        let nd = this.root.addNode(treeNode);
        this.setCurrent(treeNode);
        return nd;
    }
    removeNode(treeNode: NavTreeNode) {
        //设置当前项，先处理兄弟，然后再父亲，然后在祖父。。。。
        return this.root.removeNode(treeNode);
    }

    treeMap: Map<string, NavTreeNode>;

    toMap() {
        let treeMap: Map<string, NavTreeNode>;
        this.expandTree(this.root, (nd) => treeMap.set(nd.key, nd));
        return treeMap;
    }

    toList() {
        let treeList: Array<NavTreeNode> = new Array<NavTreeNode>();
        this.expandTree(this.root, (nd) => treeList.push(nd));
        return treeList;
    }
    expandTree(node: NavTreeNode, callback: (node: NavTreeNode) => void) {
        callback(node);
        node.childs.forEach(c => {
            this.expandTree(c, callback);
        });
    }
    treeNodeDict: { [key: string]: NavTreeNode };
    getNodeTreeDict() {
        let expand = (comp: NavTreeNode): { [key: string]: NavTreeNode } => {
            let dict: { [key: string]: NavTreeNode } = {};
            dict[comp.name] = comp;
            comp.childs.forEach(child => {
                dict = Object.assign(dict, expand(child));
            });
            return dict;
        }
        return expand(this.root);
    }

    getNode(key: string) {
        let findComp = this.treeNodeDict[key];
        return findComp ? findComp : null;
    }
}


