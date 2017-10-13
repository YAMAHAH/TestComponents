import Print from './print';
import { addHeader } from './functions';

export default class image {
    static async makeToHtmlData(params: printJsOptions, printFrame: HTMLIFrameElement) {
        return new Promise<string>((resolve, reject) => {
            // Create the image element
            let img = document.createElement('img');

            // Set image src with image file url
            img.src = params.printable;

            // Load image
            img.onload = () => {
                img.setAttribute('style', 'width:100%;');
                img.setAttribute('id', 'printableImage');

                // Create wrapper
                let printableElement = document.createElement('div');
                printableElement.setAttribute('style', 'width:100%');
                printableElement.appendChild(img);

                // Check if we are adding a header for the image
                if (params.header) {
                    addHeader(printableElement, params.header);
                }
                // Store html data
                params.htmlData = printableElement.outerHTML;
                resolve(params.htmlData);
            }
        });
    }
    static directPrint(params: printJsOptions, printFrame: HTMLIFrameElement) {

        this.makeToHtmlData(params, printFrame);
        // Print image
        Print.send(params, printFrame);
    }
    static async preview(params: printJsOptions, printFrame: HTMLIFrameElement) {
        let htmlData = await this.makeToHtmlData(params, printFrame);
        return htmlData;
    }
    static print(params: printJsOptions, printFrame: HTMLIFrameElement) {
        let iframeElement: HTMLIFrameElement = printFrame;
        // Get iframe element document
        let printDocument;
        if (iframeElement.contentWindow)
            printDocument = iframeElement.contentWindow;
        else
            printDocument = iframeElement.contentDocument;

        if ((printDocument as any).document) printDocument = (printDocument as any).document;

        // If printing image, wait for it to load inside the iframe (skip firefox)

        Print.loadImageAndFinishPrint(printDocument.getElementById('printableImage'), iframeElement, params);
    }
}
