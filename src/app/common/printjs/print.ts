import Modal from './modal';
import Browser from '../../untils/browser';

export default class Print {
    static preview(params: printJsOptions, printFrame: HTMLIFrameElement) {
        // Get iframe element
        let iframeElement: HTMLIFrameElement = printFrame;
        if (!iframeElement) throw new Error("invalid printFrame.");
        // Wait for iframe to load all content
        if (params.type === 'pdf' && (Browser.isIE() || Browser.isEdge())) {
        } else {
            printFrame.onload = () => {
                if (params.type === 'pdf') {
                    ;
                } else {
                    // Get iframe element document
                    let printDocument;
                    if (iframeElement.contentWindow)
                        printDocument = iframeElement.contentWindow;
                    else
                        printDocument = iframeElement.contentDocument;

                    if ((printDocument as any).document) printDocument = (printDocument as any).document;

                    // Inject printable html into iframe body
                    printDocument.body.innerHTML = params.htmlData;
                }
            }
        }
    }
    static send(params: printJsOptions, printFrame: HTMLIFrameElement) {
        // Append iframe element to document body
        document.getElementsByTagName('body')[0].appendChild(printFrame);

        // Get iframe element
        let iframeElement: HTMLIFrameElement = <HTMLIFrameElement>document.getElementById(params.frameId);

        // Wait for iframe to load all content
        if (params.type === 'pdf' && (Browser.isIE() || Browser.isEdge())) {
            iframeElement.setAttribute('onload', this.finishPrint.bind(this, iframeElement, params));
        } else {
            printFrame.onload = () => {
                if (params.type === 'pdf') {
                    this.finishPrint(iframeElement, params);
                } else {
                    // Get iframe element document
                    let printDocument;
                    if (iframeElement.contentWindow)
                        printDocument = iframeElement.contentWindow;
                    else
                        printDocument = iframeElement.contentDocument;

                    if ((printDocument as any).document) printDocument = (printDocument as any).document;

                    // Inject printable html into iframe body
                    printDocument.body.innerHTML = params.htmlData;

                    // If printing image, wait for it to load inside the iframe (skip firefox)
                    if (params.type === 'image') {
                        this.loadImageAndFinishPrint(printDocument.getElementById('printableImage'), iframeElement, params);
                    } else {
                        this.finishPrint(iframeElement, params)
                    }
                }
            }
        }
    }
    static finishPrint(iframeElement: HTMLIFrameElement, params: printJsOptions) {
        iframeElement.focus();

        // If Edge or IE, try catch with execCommand
        if (Browser.isEdge() || (Browser.isIE())) {
            try {
                iframeElement.contentWindow.document.execCommand('print', false, null);
            } catch (e) {
                iframeElement.contentWindow.print();
            }
        }
        // Other browsers
        if (!Browser.isIE() && !Browser.isEdge()) {
            iframeElement.contentWindow.print();
        }

        // Remove embed on IE (just because it isn't 100% hidden when using h/w = 0)
        if (Browser.isIE() && params.type === 'pdf') {
            setTimeout(() => {
                iframeElement.parentNode.removeChild(iframeElement);
            }, 2000);
        }

        // If we are showing a feedback message to user, remove it
        if (params.showModal) {
            Modal.close();
        }
    }

    static loadImageAndFinishPrint(img: HTMLImageElement, iframeElement: HTMLIFrameElement, params: printJsOptions) {
        if (typeof img.naturalWidth === 'undefined' || img.naturalWidth === 0) {
            setTimeout(() => {
                this.loadImageAndFinishPrint(img, iframeElement, params);
            }, 500)
        } else {
            this.finishPrint(iframeElement, params);
        }
    }

}

