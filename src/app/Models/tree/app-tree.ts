import { TreeNode } from './tree-node';
import { UUID } from '../../untils/uuid';
export class AppTree {

    treeNodeMap: Map<string, TreeNode>;
    root: TreeNode = new TreeNode();
    constructor(key?: string, name?: string) {
        if (key) {
            this.root.key = key;
        } else {
            this.root.key = UUID.uuid(8, 16);
        }
        if (name) {
            this.root.name = name;
        }
        this.treeNodeMap = new Map<string, TreeNode>();
        this.treeNodeMap.set(this.root.key, this.root);
    }

    addNode(treeNode: TreeNode) {
        if (treeNode) {
            this.root.nodes.push(treeNode);
        }
    }
    removeNode(treeNode: TreeNode) {

    }
}