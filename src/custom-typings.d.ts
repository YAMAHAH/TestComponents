declare var System: SystemJS;

interface SystemJS {
    import: (path?: string) => Promise<any>;
}

interface String {
    like(value: string): boolean;
    /**
     * 从左截取指定长度的字串 
     */
    left(n: number): string;
    /**
     * 从右截取指定长度的字串 
     */
    right(n: number): string;
    isNullOrEmpty(): boolean;
    isNotNullOrEmpty(): boolean;
    isBlank(): boolean;
    isNotBlank(): boolean;
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
    isNotEmpty(): boolean;
    clone(): T[];
    clear(): void;
    contains(value: T): boolean;
    notContains(value: T): boolean;
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