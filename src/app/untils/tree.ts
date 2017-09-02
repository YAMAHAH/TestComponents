

export class treeUntils {
    static expand(node: any, getChilds: (node: any) => any[], cb: (node: any) => void) {
        cb(node);
        getChilds(node).forEach(nd => {
            this.expand(nd, getChilds, cb);
        });
    }
}