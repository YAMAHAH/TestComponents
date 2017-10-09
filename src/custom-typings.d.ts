declare var System: SystemJS;

interface SystemJS {
    import: (path?: string) => Promise<any>;
}

interface String {
    like(value: string): boolean;
}
interface ArrayConstructor {
    intersect(...params: any[]): any[];
    union(...params: any[]): any[];
    uniquelize(first: any[]): any[];
    except(first: any[], second: any[]): any[];
}

interface Array<T> {
    remove(item: T): T;
    removeAt(index: number): T;
    insertAt(index: number, item: T): void;
    isEmpty(): boolean;
    clone(): T[];
    clear(): void;
    contains(value: T): boolean;
    each(predicate: (element: T, index?: number) => T): T[];
    intersectWith(second: T[]): T[];
    uniquelizeWith(): T[];
    complementWith(second: T[]): T[];
    unionWith(second: T[]): T[];
    exceptWith(second: T[]): T[];

}
interface HTMLElement {
    objectId: string;
    _objectId: string;
    objectName: string;
    dataSourceName: string;
    moduleId: string;
    templateId: string;
    _templateId: string;
    readOnly: boolean;
    required: boolean;
    disabled: boolean;
    hidden: boolean;
    observer: MutationObserver;
    isProxy: boolean;
}