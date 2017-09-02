
export class TreeNode {
    constructor(key?: string, name?: string) {
        this.key = key;
        this.name = name;
    }
    key: string;
    name: string;
    path: string;
    level: number;
    nodes: TreeNode[] = [];
    tag: Object;
}