import { collectStyles, loopNodesCollectStyles, addWrapper, addHeader } from './functions';
import Print from './print';

export default class html {

    private static _getBaseHref() {
        let port = window.location.port ? ':' + window.location.port : '';
        return window.location.protocol + '//' + window.location.hostname + port + window.location.pathname;
    }
    private static getMarkup(elementHtml: string, opts: htmlOptions) {
        let template = opts.templateString,
            templateRegex = new RegExp(/{{\s*printBody\s*}}/gi),
            stylesheets,
            styles,
            html: any[] = [];

        if (template && templateRegex.test(template)) {
            elementHtml = template.replace(templateRegex, elementHtml);
        }

        html.push('<html><head><title>' + (opts.pageTitle || '') + '</title>');

        // If stylesheet URL's or list of stylesheet URL's are specified, override page stylesheets
        if (opts.stylesheets) {
            stylesheets = Array.isArray(opts.stylesheets) ? opts.stylesheets : [opts.stylesheets];
        } else {
            stylesheets = Array.prototype.slice.call(document.getElementsByTagName('link')).map((link: HTMLLinkElement) => {
                return link.href;
            });
        }

        stylesheets.forEach((href: string) => {
            html.push('<link rel="stylesheet" href="' + href + '">');
        });

        // If inline styles or list of inline styles are specified, override inline styles
        if (opts.styles) {
            styles = Array.isArray(opts.styles) ? opts.styles : [opts.styles];
        } else {
            styles = Array.prototype.slice.call(document.getElementsByTagName('style')).map((style: HTMLStyleElement) => {
                return style.innerHTML;
            });
        }

        styles.forEach((style: string) => {
            html.push('<style type="text/css">' + style + '</style>');
        });

        // Ensure that relative links work
        html.push('<base href="' + this._getBaseHref() + '" />');
        html.push('</head><body class="pe-body">');
        html.push(elementHtml);
        html.push('<script type="text/javascript">function printPage(){focus();print();' + (opts.printMode.toLowerCase() == 'popup' ? 'close();' : '') + '}</script>');
        html.push('</body></html>');

        return html.join('');
    }
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
    /**
     * 
     * @param elementHtml  元素的outerHTML或者直接HTMLSTRING
     * @param opts 
     * @param params 
     */
    static previewHtmlElemet(elementHtml: string, opts: htmlOptions, params: printJsOptions) {
        params.htmlData = this.getMarkup(elementHtml, opts);
    }
    static print(params: printJsOptions, printFrame: HTMLIFrameElement) {
        // Print html element contents
        Print.finishPrint(printFrame, params);
    }

}
