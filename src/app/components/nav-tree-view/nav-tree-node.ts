export class NavTreeNode {
    showIcon = false;
    expanded = true;
    selected = false;
    checked = false;
    isSemi = false;
    icon: string = null;
    leftIcon: string = null;
    rightIcon: string = null;
    showExpandIon: boolean = true;
    childs: NavTreeNode[] = [];
    parent: NavTreeNode;
    isGroup: boolean = false;
    showNode: boolean = true;
    /**
     * 指示是否依赖引用结点
     */
    isDependRef: boolean = false;
    /**附加对象 */
    tag: any;
    /**
     * 附加对象2
     */
    extras: any;
    constructor(public key: string,
        public name: string,
        public path: string,
        public param: string,
        public level: number = 0
    ) {

    }

    expand() {
        this.expanded = !this.expanded;
    }
    checkBoxClick() {
        this.checked = !this.checked;
        this.isSemi = false;
        this.setParentCheckState(this);
        this.setChildCheckState(this);
    }
    get geticon() {
        if (this.showExpandIon && this.childs.length > 0) {
            if (this.expanded) {
                return "-";
            }
            return "+";
        }
        return "";
    }
    get isLast() {
        return this.parent && this.parent.childs[this.parent.childs.length - 1] == this;
    }

    get hasChildren() {
        return this.childs.length > 0;
    }

    addNode(node: NavTreeNode) {
        node.parent = this;
        node.level = this.level + 1;
        this.childs.push(node);
        return node;
    }
    removeNode(node: NavTreeNode) {
        let idx = this.childs.findIndex(nd => nd == node);
        return idx > -1 ? this.childs.splice(idx, 1)[0] : null;
    }

    getParents() {
        let parents = [];
        let pnode = this.parent;
        while (pnode != null && pnode.level > -1) {
            parents.push(pnode);
            pnode = pnode.parent;
        }
        return parents.reverse();
    }



    setParentCheckState(node: NavTreeNode) {
        let pnode = this.parent;
        while (pnode != null) {
            if (pnode.childs.every(nd => nd.checked == true && nd.isSemi == false)) {
                pnode.checked = true;
                pnode.isSemi = false;
            } else if (pnode.childs.find(nd => nd.checked == true || nd.isSemi == true)) {
                pnode.isSemi = true;
                pnode.checked = false;
            } else {
                pnode.checked = false;
                pnode.isSemi = false;
            }
            pnode = pnode.parent;
        }
    }

    setChildCheckState(node: NavTreeNode) {
        node.checked = this.checked;
        node.isSemi = false;
        node.childs.forEach(nd => this.setChildCheckState(nd));
    }

    toList() {
        let treeList: Array<NavTreeNode> = new Array<NavTreeNode>();
        this.expandTree(this, (nd) => treeList.push(nd));
        return treeList;
    }
    expandTree(node: NavTreeNode, callback: (node: NavTreeNode) => void) {
        callback(node);
        node.childs.forEach(c => {
            this.expandTree(c, callback);
        });
    }

}