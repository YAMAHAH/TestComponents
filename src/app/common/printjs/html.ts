import { collectStyles, loopNodesCollectStyles, addWrapper, addHeader } from './functions';
import Print from './print';

export default class html {
    static makeHtmlData(params: printJsOptions) {
        // Get HTML printable element
        let printElement = params.elementRef || document.getElementById(params.printable);

        // Check if element exists
        if (!printElement) {
            window.console.error('Invalid HTML element id: ' + params.printable);

            return false;
        }

        // Make a copy of the printElement to prevent DOM changes
        let printableElement = document.createElement('div');
        printableElement.appendChild(printElement.cloneNode(true));

        // Add cloned element to DOM, to have DOM element methods available. It will also be easier to colect styles
        printableElement.setAttribute('style', 'display:none;');
        printableElement.setAttribute('id', 'printJS-html');
        printElement.parentNode.appendChild(printableElement);

        // Update printableElement variable with newly created DOM element
        // printableElement = 
        console.log(document.getElementById('printJS-html'));

        // Get main element styling
        printableElement.setAttribute('style', collectStyles(printableElement, params) + 'margin:0 !important;');

        // Get all children elements
        let elements = printableElement.children;

        // Get styles for all children elements
        loopNodesCollectStyles(elements, params);

        // Add header if any
        if (params.header) {
            addHeader(printableElement, params.header);
        }

        // Remove DOM printableElement
        printableElement.parentNode.removeChild(printableElement);

        // Store html data
        params.htmlData = addWrapper(printableElement.innerHTML, params);
    }
    static directPrint(params: printJsOptions, printFrame: HTMLIFrameElement) {
        //make html data
        this.makeHtmlData(params);
        // Print html element contents
        Print.send(params, printFrame);
    }
    static preview(params: printJsOptions, printFrame: HTMLIFrameElement) {
        this.makeHtmlData(params);
        //preview to the printFrame
        // Print.preview(params, printFrame);
    }
    static print(params: printJsOptions, printFrame: HTMLIFrameElement) {
        // Print html element contents
        Print.finishPrint(printFrame, params);
    }

}
