import Modal from './modal';
import Pdf from './pdf';
import Html from './html';
import Image from './image';
import Json from './json';
import Browser from '../../untils/browser';

let printTypes = ['pdf', 'html', 'image', 'json'];

export default class PrintJS {
    static init(params: string | printJsOptions, type?: printJSType) {
        let defaultParams: printJsOptions = {
            printable: null,
            type: 'pdf',
            header: null,
            maxWidth: 800,
            font: 'TimesNewRoman',
            font_size: '12pt',
            honorMarginPadding: true,
            honorColor: false,
            properties: null,
            showModal: false,
            modalMessage: 'Retrieving Document...',
            frameId: 'printJS',
            border: true,
            htmlData: ''
        };

        // Check if a printable document or object was supplied
        let args = arguments[0];
        if (args === undefined) {
            throw new Error('printJS expects at least 1 attribute.')
        }

        switch (typeof args) {
            case 'string':
                defaultParams.printable = encodeURI(args);
                defaultParams.type = arguments[1] || defaultParams.type;
                break;

            case 'object':
                defaultParams.printable = args.printable;
                defaultParams.type = typeof args.type !== 'undefined' ? args.type : defaultParams.type;
                defaultParams.frameId = typeof args.frameId !== 'undefined' ? args.frameId : defaultParams.frameId;
                defaultParams.header = typeof args.header !== 'undefined' ? args.header : defaultParams.header;
                defaultParams.maxWidth = typeof args.maxWidth !== 'undefined' ? args.maxWidth : defaultParams.maxWidth;
                defaultParams.font = typeof args.font !== 'undefined' ? args.font : defaultParams.font;
                defaultParams.font_size = typeof args.font_size !== 'undefined' ? args.font_size : defaultParams.font_size;
                defaultParams.honorMarginPadding = typeof args.honorMarginPadding !== 'undefined' ? args.honorMarginPadding : defaultParams.honorMarginPadding
                defaultParams.properties = typeof args.properties !== 'undefined' ? args.properties : defaultParams.properties;
                defaultParams.showModal = typeof args.showModal !== 'undefined' ? args.showModal : defaultParams.showModal;
                defaultParams.modalMessage = typeof args.modalMessage !== 'undefined' ? args.modalMessage : defaultParams.modalMessage;
                break;
            default:
                throw new Error('Unexpected argument type! Expected "string" or "object", got ' + typeof args);
        }

        if (!defaultParams.printable) {
            throw new Error('Missing printable information.');
        }

        if (!defaultParams.type || typeof defaultParams.type !== 'string' || printTypes.indexOf(defaultParams.type.toLowerCase()) === -1) {
            throw new Error('Invalid print type. Available types are: pdf, html, image and json.');
        }

        // Check if we are showing a feedback message to the user (useful for large files)
        if (defaultParams.showModal) {
            Modal.show(defaultParams);
        }

        // To prevent duplication and issues, remove printFrame from the DOM, if it exists
        let usedFrame = document.getElementById(defaultParams.frameId);

        if (usedFrame) {
            usedFrame.parentNode.removeChild(usedFrame);
        }

        // Create a new iframe or embed element (IE prints blank pdf's if we use iframe)
        let printFrame: HTMLIFrameElement;

        // Create iframe element
        printFrame = document.createElement('iframe');

        // Hide iframe
        printFrame.setAttribute('style', 'display:none;');

        // Set element id
        printFrame.setAttribute('id', defaultParams.frameId);

        // For non pdf printing in Chrome and Safari, pass an empty html document to srcdoc (force onload callback)
        if (defaultParams.type !== 'pdf' && (Browser.isChrome() || Browser.isSafari())) {
            printFrame.srcdoc = '<html><head></head><body></body></html>';
        }

        // Check printable type
        switch (defaultParams.type) {
            case 'pdf':
                // Check browser support for pdf and if not supported we will just open the pdf file instead
                if (Browser.isFirefox() || Browser.isEdge() || Browser.isIE()) {
                    console.log('PrintJS currently doesn\'t support PDF printing in Firefox, Internet Explorer and Edge.');
                    let win = window.open(defaultParams.printable, '_blank');
                    win.focus();
                    // Make sure there is no loading modal opened
                    if (defaultParams.showModal) Modal.close();
                } else {
                    Pdf.directPrint(defaultParams, printFrame);
                }
                break;
            case 'image':
                Image.directPrint(defaultParams, printFrame);
                break;
            case 'html':
                Html.directPrint(defaultParams, printFrame);
                break;
            case 'json':
                Json.directPrint(defaultParams, printFrame);
                break;
            default:
                throw new Error('Invalid print type. Available types are: pdf, html, image and json.');
        }
    }
}

