declare var System: SystemJS;

interface SystemJS {
    import: (path?: string) => Promise<any>;
}

interface String {
    like(value: string): boolean;
}

interface HTMLElement {
    //权限ID
    rightId: string;
    subscribed:boolean;
    _rightId: string;
    templateId: string;
    //权限设置方法
    applyRight(): void;
    //权限事件
}