declare var System: SystemJS;

interface SystemJS {
    import: (path?: string) => Promise<any>;
}