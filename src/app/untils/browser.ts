var InstallTrigger: any;
export default class Browser {
    isFirefox() {
        return typeof InstallTrigger !== 'undefined';
    };
    // Internet Explorer 6-11
    isIE() {
        return navigator.userAgent.indexOf('MSIE') !== -1 || !!document['documentMode'];
    }
    // Edge 20+
    isEdge() {
        return !this.isIE() && !!window['StyleMedia'];
    }
    // Chrome 1+
    isChrome() {
        return !!window['chrome'] && !!window['chrome'].webstore;
    }
    // At least Safari 3+: "[object HTMLElementConstructor]"
    isSafari() {
        return Object.prototype.toString.call(window['HTMLElement']).indexOf('Constructor') > 0 ||
            navigator.userAgent.toLowerCase().indexOf('safari') !== -1;
    }
}