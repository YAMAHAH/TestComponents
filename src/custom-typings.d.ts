declare var System: SystemJS;

interface SystemJS {
    import: (path?: string) => Promise<any>;
}

interface String {
    like(value: string): boolean;
}

interface HTMLElement {
    rightId: string;
    templateId: string;
    readOnly: boolean;
    required: boolean;
    disabled: boolean;
    hidden: boolean;
    observer: MutationObserver;
}