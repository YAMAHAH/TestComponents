import { Injectable } from '@angular/core';

@Injectable()
export class DownloadManager {
    createBlob(data: any, contentType: string) {
        if (typeof Blob !== 'undefined') {
            return new Blob([data], { type: contentType });
        }
        console.warn('The "Blob" constructor is not supported.');
    };
    createObjectURL(data: any, contentType: string, forceDataSchema: any) {
        let digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        if (!forceDataSchema && typeof URL !== 'undefined' && URL.createObjectURL) {
            var blob = this.createBlob(data, contentType);
            return URL.createObjectURL(blob);
        }
        var buffer = 'data:' + contentType + ';base64,';
        for (var i = 0, ii = data.length; i < ii; i += 3) {
            var b1 = data[i] & 0xFF;
            var b2 = data[i + 1] & 0xFF;
            var b3 = data[i + 2] & 0xFF;
            var d1 = b1 >> 2,
                d2 = (b1 & 3) << 4 | b2 >> 4;
            var d3 = i + 1 < ii ? (b2 & 0xF) << 2 | b3 >> 6 : 64;
            var d4 = i + 2 < ii ? b3 & 0x3F : 64;
            buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
        }
        return buffer;
    }
    private download(blobUrl: string, filename: string) {
        var a = document.createElement('a');
        if (a.click) {
            a.href = blobUrl;
            a.target = '_parent';
            if ('download' in a) {
                a.download = filename;
            }
            (document.body || document.documentElement).appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        } else {
            if (window.top === window && blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                var padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
        }
    }
    isValidProtocol(url: URL) {
        if (!url) {
            return false;
        }
        switch (url.protocol) {
            case 'http:':
            case 'https:':
            case 'ftp:':
            case 'mailto:':
            case 'tel:':
                return true;
            default:
                return false;
        }
    }
    createValidAbsoluteUrl(url: string, baseUrl: string) {
        if (!url) {
            return null;
        }
        try {
            var absoluteUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);
            if (this.isValidProtocol(absoluteUrl)) {
                return absoluteUrl;
            }
        } catch (ex) { }
        return null;
    }
    downloadUrl(url: string, filename: string) {
        if (!this.createValidAbsoluteUrl(url, 'http://example.com')) {
            return;
        }
        this.download(url + '#pdfjs.action=download', filename);
    }
    downloadData(data: any, filename: string, contentType: string) {
        let blobFile = new Blob([data], { type: contentType });
        if (navigator.msSaveBlob) {
            return navigator.msSaveBlob(blobFile, filename);
        }
        var blobUrl = this.createObjectURL(data, contentType, false);
        this.download(blobUrl, filename);
    }
    downloadFile(blob: any, url: string, filename: string) {
        if (navigator.msSaveBlob) {
            if (!navigator.msSaveBlob(blob, filename)) {
                this.downloadUrl(url, filename);
            }
            return;
        }
        // if (pdfjsLib.PDFJS.disableCreateObjectURL) {
        //     this.downloadUrl(url, filename);
        //     return;
        // }
        var blobUrl = URL.createObjectURL(blob);
        this.download(blobUrl, filename);
    }

    webViewerOpenFile() {
        // var openFileInputName = PDFViewerApplication.appConfig.openFileInputName;
        // document.getElementById(openFileInputName).click();
    }
    webViewerOpenFileViaURL(file: any) {
        if (file && file.lastIndexOf('file:', 0) === 0) {
            //  PDFViewerApplication.setTitleUsingUrl(file);
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                // PDFViewerApplication.open(new Uint8Array(xhr.response));
            };
            try {
                xhr.open('GET', file);
                xhr.responseType = 'arraybuffer';
                xhr.send();
            } catch (e) {
                //  PDFViewerApplication.error(mozL10n.get('loading_error', null, 'An error occurred while loading the PDF.'), e);
            }
            return;
        }
        if (file) {
            // PDFViewerApplication.open(file);
        }
    }

    openFile() {
        // var parameters = Object.create(null),
        //     scale;
        // if (typeof file === 'string') {
        //     this.setTitleUsingUrl(file);
        //     parameters.url = file;
        // } else if (file && 'byteLength' in file) {
        //     parameters.data = file;
        // } else if (file.url && file.originalUrl) {
        //     this.setTitleUsingUrl(file.originalUrl);
        //     parameters.url = file.url;
        // }
    }
    createFileInput(id: string) {
        let fileInput = document.createElement('input');
        fileInput.id = id;
        fileInput.className = 'fileInput';
        fileInput.setAttribute('type', 'file');
        fileInput.oncontextmenu = this.noContextMenuHandler;
    }
    noContextMenuHandler(e: Event) {
        e.preventDefault();
    }


}
