import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { NavTreeNode } from './nav-tree-node';
import { AppStoreService } from '../../services/app.store.service';
import { AppTaskBarActions } from '../../actions/app-main-tab/app-main-tab-actions';


@Component({
    selector: 'x-nav-treeview-item',
    templateUrl: 'nav-tree-view-item.html',
    styleUrls: ['./nav-tree-view-item.css']
})
export class NavTreeViewItemComponent {
    @Input() root: NavTreeNode;
    @Output() itemClick: EventEmitter<NavTreeNode> = new EventEmitter<NavTreeNode>();

    @Output() itemCloseClick: EventEmitter<NavTreeNode> = new EventEmitter<NavTreeNode>();
    constructor(private appStore: AppStoreService) {
    }
    ngOnInit() {
    }

    onClick(node: NavTreeNode) {
        this.itemClick.emit(node);
    }

    onItemCloseClick(node: NavTreeNode) {
        this.itemCloseClick.emit(node);
    }

    expand() {
        this.root.expanded = !this.root.expanded;
    }
    itemClass(node: NavTreeNode) {
        return {
            parent: node.level == 100,
            root: node.level == 100,
            active: node.selected
        };
    }
    getHitArea(node: NavTreeNode) {
        return {
            "bbit-tree-elbow-minus": node.expanded && node.hasChildren,
            "bbit-tree-elbow-plus": !node.expanded && node.hasChildren,
            "bbit-tree-elbow-end-minus": node.isLast && node.expanded && node.hasChildren,
            "bbit-tree-elbow-end-plus ": node.isLast && node.hasChildren && !node.expanded,
            "bbit-tree-elbow-end": node.isLast && !node.hasChildren,
            "bbit-tree-elbow": !node.hasChildren && !node.isLast
        }
    }
    getItemIcon(node: NavTreeNode) {
        return {
            "bbit-tree-node-collapsed": node.hasChildren && !node.expanded,
            "bbit-tree-node-leaf": !node.hasChildren,
            "bbit-tree-node-expanded": node.hasChildren && node.expanded
        }
    }
    getCheckBoxState(node: NavTreeNode) {
        return {
            "bbit-tree-node-checkBox-false": !node.checked,
            "bbit-tree-node-checkBox-true": node.checked,
            "bbit-tree-node-checkBox-semi": node.isSemi
        }
    }
}