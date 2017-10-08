declare var System: SystemJS;

interface SystemJS {
    import: (path?: string) => Promise<any>;
}

interface String {
    like(value: string): boolean;
}
// interface StringConstructor {
//     bar(): string;
// }

interface Array<T> {
    intersect(...params: T[]): T[];
    uniquelize(): T[];
    union(...params: T[]): T[];
    except(second: T[]): T[];
    contains(value: T): boolean;
    each(predicate: (element: T, index?: number) => T): T[];
    intersect2(second: T[]): T[];
    uniquelize2(): T[];
    complement(second: T[]): T[];
    union2(second: T[]): T[];
    except2(second: T[]): T[];

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