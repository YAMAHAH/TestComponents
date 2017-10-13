var InstallTrigger: any;
export default class Browser {
    static isFirefox() {
        return typeof InstallTrigger !== 'undefined';
    };
    // Internet Explorer 6-11
    static isIE() {
        return navigator.userAgent.indexOf('MSIE') !== -1 || !!document['documentMode'];
    }
    // Edge 20+
    static isEdge() {
        return !this.isIE() && !!window['StyleMedia'];
    }
    // Chrome 1+
    static isChrome() {
        return !!window['chrome'] && !!window['chrome'].webstore;
    }
    // At least Safari 3+: "[object HTMLElementConstructor]"
    static isSafari() {
        return Object.prototype.toString.call(window['HTMLElement']).indexOf('Constructor') > 0 ||
            navigator.userAgent.toLowerCase().indexOf('safari') !== -1;
    }
}