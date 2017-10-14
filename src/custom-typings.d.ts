declare var System: SystemJS;

interface SystemJS {
    import: (path?: string) => Promise<any>;
}

declare var printJS: PrintJS;

type printJSType = "pdf" | "html" | "json" | "image";
interface printJsOptions {
    htmlOptions?: htmlOptions;
    elementRef?: HTMLElement;
    /**
     * 打印目标
     */
    printable?: any;
    /**
     * 打印类型
     */
    type?: printJSType;
    contentType?: string;
    frameId?: string;
    /**
     * 打印头信息
     */
    header?: string;
    //请求数据
    data?: any;
    htmlData?: string;
    maxWidth?: number; //800
    font?: string; //TimesNewRoman
    font_size?: string; //12pt
    honorMarginPadding?: boolean;
    honorColor?: boolean;
    border?: boolean;
    properties?: string[];
    showModal?: boolean;
    modalMessage?: string;
}
interface PrintJS {
    /**
     * There are four print document types available: 'pdf', 'html', 'image' and 'json'.

    *The default type is 'pdf'.

    *It's basic usage is to call printJS() and just pass in a PDF document url: printJS('docs/PrintJS.pdf').

    *For image files, the idea is the same, but you need to pass a second argument: printJS('images/PrintJS.jpg', 'image').

    *To print HTML elements, in a similar way, pass in the element id and type: printJS('myElementId', 'html').

    *When printing JSON data, pass in the data, type and the data properties that you want to print: 
    
    *printJS({printable: myData, type: 'json', properties: ['prop1', 'prop2', 'prop3']});
     */
    (params: string | printJsOptions, type?: printJSType): void;
}

interface htmlOptions {
    elementRef?: HTMLElement;
    htmlString?: string;
    printMode?: string;
    pageTitle?: string;
    templateString?: string;
    popupProperties?: string;
    stylesheets?: string | string[];
    styles?: string | string[];
}

interface HTMLIFrameElement extends HTMLElement, GetSVGDocument {
    srcdoc: string;
}
interface Window {
    printjs: PrintJS;
}
interface Document {
    frames: any;
}

interface StringConstructor {
    isNullOrEmpty(value: any): boolean;
    isNotNullOrEmpty(value: any): boolean;
    isBlank(value: any): boolean;
    isNotBlank(value: any): boolean;
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

    GetFileName: string;
    GetExtensionName: string;
    hasExtensionName: boolean;
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

    currentStyle: any;
}

