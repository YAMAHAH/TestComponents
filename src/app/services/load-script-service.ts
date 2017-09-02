import { Injectable } from '@angular/core';

@Injectable()
export class LoadScriptService {
    constructor() { }

    private loadlibs: Map<string, string> = new Map<string, string>();
    load(src: string): Promise<any> {
        if (!!!this.loadlibs.has(src)) {
            let doc = document;
            return new Promise((resolve, reject) => {
                let script = doc.createElement('script');
                if (!src) {
                    new Error('src');
                }
                script.src = src;
                doc.querySelector('head').appendChild(script);

                script.onload = () => {
                    resolve();
                    this.loadlibs.set(src, src);
                    script.remove()
                }
                script.onerror = function () {
                    reject()
                }
            });
        }
        return Promise.resolve(true);
    }
    loadCSS(src: string): Promise<any> {
        if (!!!this.loadlibs.has(src)) {
            let doc = document;
            return new Promise((resolve, reject) => {
                let link = doc.createElement('link');
                if (!src) {
                    new Error('src');
                }
                link.href = src;
                link.rel = "stylesheet";
                doc.querySelector('head').appendChild(link);

                link.onload = () => {
                    resolve();
                    this.loadlibs.set(src, src);
                }
                link.onerror = function () {
                    reject();
                }
            });
        }
        return Promise.resolve(true);
    }
    get loadDraggabilly() {
        return this.load('/assets/js/draggabilly.js');
    }
    get loadSnapSvg() {
        return this.load('/assets/js/snap.svg.js');
    }
    get loadCryptoJS() {
        return this.load('/assets/js/crypto-js.js');
    }
    get loadLodash() {
        return this.load('/assets/js/lodash.min.js');
    }
    get loadBootstrapCSS() {
        return this.loadCSS("/assets/css/bootstrap.min.css");
    }
    get loadFlexboxGridCSS() {
        return this.loadCSS("/assets/css/flexboxgrid.min.css");
    }
    get loadAnimateCSS() {
        return this.loadCSS("/assets/css/animate.css");
    }

    get loadfontAwesomeCSS() {
        return this.loadCSS("/assets/css/font-awesome-4.7.0/css/font-awesome.min.css");
    }
    get loadPrimeNGCSS() {
        return this.loadCSS("/assets/css/primeng/resources/primeng.min.css");
    }
    get loadPrimeNGThemeCSS() {
        return this.loadCSS("/assets/css/primeng/resources/themes/omega/theme.css");
    }

}
