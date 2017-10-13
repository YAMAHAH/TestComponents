import Print from './print'
import Browser from "../../untils/browser";

export default class pdf {
    static directPrint(params: printJsOptions, printFrame: HTMLIFrameElement) {
        // If showing feedback to user, pre load pdf files (hacky)
        if (params.showModal || Browser.isIE()) {
            let req = new XMLHttpRequest()
            req.addEventListener('load', () => this.send(params, printFrame));
            req.open('GET', window.location.href + params.printable, true);
            req.send();
        } else {
            this.send(params, printFrame);
        }
    }
    static send(params: printJsOptions, printFrame: HTMLIFrameElement) {
        // Set iframe src with pdf document url
        printFrame.setAttribute('src', params.printable);

        Print.send(params, printFrame);
    }
    static preview(params: printJsOptions, printFrame: HTMLIFrameElement) {
        printFrame.setAttribute('src', params.printable);
    }
    static print(params: printJsOptions, printFrame: HTMLIFrameElement) {
        Print.finishPrint(printFrame, params);
    }
}

