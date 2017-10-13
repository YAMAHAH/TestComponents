import Modal from './modal';
import Pdf from './pdf';
import Html from './html';
import Image from './image';
import Json from './json';
import Browser from '../../untils/browser';

let printTypes = ['pdf', 'html', 'image', 'json'];

export default class PrintJS {
    static init(params: string | printJsOptions, type?: printJSType) {
        let defualtParams: printJsOptions = {
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
                defualtParams.printable = encodeURI(args);
                defualtParams.type = arguments[1] || defualtParams.type;
                break;

            case 'object':
                defualtParams.printable = args.printable;
                defualtParams.type = typeof args.type !== 'undefined' ? args.type : defualtParams.type;
                defualtParams.frameId = typeof args.frameId !== 'undefined' ? args.frameId : defualtParams.frameId;
                defualtParams.header = typeof args.header !== 'undefined' ? args.header : defualtParams.header;
                defualtParams.maxWidth = typeof args.maxWidth !== 'undefined' ? args.maxWidth : defualtParams.maxWidth;
                defualtParams.font = typeof args.font !== 'undefined' ? args.font : defualtParams.font;
                defualtParams.font_size = typeof args.font_size !== 'undefined' ? args.font_size : defualtParams.font_size;
                defualtParams.honorMarginPadding = typeof args.honorMarginPadding !== 'undefined' ? args.honorMarginPadding : defualtParams.honorMarginPadding
                defualtParams.properties = typeof args.properties !== 'undefined' ? args.properties : defualtParams.properties;
                defualtParams.showModal = typeof args.showModal !== 'undefined' ? args.showModal : defualtParams.showModal;
                defualtParams.modalMessage = typeof args.modalMessage !== 'undefined' ? args.modalMessage : defualtParams.modalMessage;
                break;
            default:
                throw new Error('Unexpected argument type! Expected "string" or "object", got ' + typeof args);
        }

        if (!defualtParams.printable) {
            throw new Error('Missing printable information.');
        }

        if (!defualtParams.type || typeof defualtParams.type !== 'string' || printTypes.indexOf(defualtParams.type.toLowerCase()) === -1) {
            throw new Error('Invalid print type. Available types are: pdf, html, image and json.');
        }

        // Check if we are showing a feedback message to the user (useful for large files)
        if (defualtParams.showModal) {
            Modal.show(defualtParams);
        }

        // To prevent duplication and issues, remove printFrame from the DOM, if it exists
        let usedFrame = document.getElementById(defualtParams.frameId);

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
        printFrame.setAttribute('id', defualtParams.frameId);

        // For non pdf printing in Chrome and Safari, pass an empty html document to srcdoc (force onload callback)
        if (defualtParams.type !== 'pdf' && (Browser.isChrome() || Browser.isSafari())) {
            printFrame.srcdoc = '<html><head></head><body></body></html>';
        }

        // Check printable type
        switch (defualtParams.type) {
            case 'pdf':
                // Check browser support for pdf and if not supported we will just open the pdf file instead
                if (Browser.isFirefox() || Browser.isEdge() || Browser.isIE()) {
                    console.log('PrintJS currently doesn\'t support PDF printing in Firefox, Internet Explorer and Edge.');
                    let win = window.open(defualtParams.printable, '_blank');
                    win.focus();
                    // Make sure there is no loading modal opened
                    if (defualtParams.showModal) Modal.close();
                } else {
                    Pdf.directPrint(defualtParams, printFrame);
                }
                break;
            case 'image':
                Image.directPrint(defualtParams, printFrame);
                break;
            case 'html':
                Html.directPrint(defualtParams, printFrame);
                break;
            case 'json':
                Json.directPrint(defualtParams, printFrame);
                break;
            default:
                throw new Error('Invalid print type. Available types are: pdf, html, image and json.');
        }
    }
}

