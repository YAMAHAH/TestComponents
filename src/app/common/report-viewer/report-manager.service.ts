import { Injectable } from '@angular/core';
import { DownloadManager } from '../../services/download.manager';
import { LoadScriptService } from '../../services/load-script-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppStoreService } from '../../services/app.store.service';
import image from '../printjs/image';
import PrintJS from '../printjs';

@Injectable()
export class ReportManagerService {
    constructor(private downloadManager: DownloadManager,
        private httpClient: HttpClient,
        private globalService: AppStoreService,
        private loadScriptService: LoadScriptService) {
    }
    preview(resource: string | printJsOptions, data: any = null, type: printJSType = "pdf", contentType: string = "application/pdf") {

        let defaultParams: printJsOptions = {
            printable: null,
            type: type || 'pdf',
            contentType: contentType || "application/pdf",
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
            htmlData: '',
            data: data || null
        };

        let htmlOpts: htmlOptions = {
            elementRef: null,
            htmlString: "",
            printMode: '', //opts.printMode || '',
            pageTitle: '', //opts.pageTitle || '',
            templateString: '',//opts.templateString || '',
            popupProperties: '',//opts.popupProperties || '',
            stylesheets: null,//opts.stylesheets || null,
            styles: null //opts.styles || null
        };

        if (typeof resource === 'object') {
            defaultParams = Object.assign(defaultParams, resource);
            if (resource.htmlOptions) {
                htmlOpts = Object.assign(htmlOpts, resource.htmlOptions);
                if (resource.htmlOptions.elementRef)
                    htmlOpts.htmlString = htmlOpts.elementRef.outerHTML;
            }
        }

        if (typeof resource === 'string')
            defaultParams.printable = resource;

        return this.globalService.taskManager
            .showReportViewer({
                resolve: {
                    data: defaultParams.data,
                    baseUrl: defaultParams.printable,
                    type: defaultParams.type,
                    contentType: defaultParams.contentType,
                    options: defaultParams,
                    htmlString: htmlOpts.htmlString,
                    htmlOptions: htmlOpts
                }
            });
    }
    async print(
        resource: string | printJsOptions,
        bodyData: any = null,
        fileType: string = "application/pdf",
        type: printJSType = "pdf"
    ) {
        let defaultParams: printJsOptions = {
            printable: null,
            type: type || 'pdf',
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
            htmlData: '',
            data: bodyData || null
        };

        if (typeof resource === 'object')
            defaultParams = Object.assign(defaultParams, resource);

        if (typeof resource === 'string')
            defaultParams.printable = resource;

        if (!defaultParams.printable) {
            throw new Error('Missing printable information.');
        }

        switch (defaultParams.type) {
            case "pdf" || 'image':
                defaultParams.printable = await this.getResourceUrl(defaultParams.printable, bodyData, fileType);
                break;
            case "json":
                if (!Array.isArray(defaultParams.printable))
                    defaultParams.printable = await this.getResourceUrl(defaultParams.printable, bodyData, fileType);
                break;
            case "html":
                break;
            default:
                break;
        }
        this.loadScriptService.loadPrintCSS
            .then(css => {
                PrintJS(defaultParams, type);
            });
    }

    async download(baseUrl: string, bodyData: any, fileName: string = null, contentType: string = "application/pdf") {
        if (String.isBlank(baseUrl)) throw new Error("print url is null.");
        //  //获取报表的PDFblob数据
        // let reportBlob: Uint8Array = new Uint8Array(data);
        // this.downloadManager.downloadData(reportBlob, fileName, "application/pdf");

        let fileUrl: string = await this.getResourceUrl(baseUrl, bodyData, contentType);

        if (String.isNullOrEmpty(fileName))
            fileName = baseUrl.GetFileName;

        if (fileUrl.startsWith("blob:"))
            this.downloadManager.downloadBlobUrl(fileUrl, fileName);
        else
            this.downloadManager.downloadUrl(fileUrl, fileName);
    }

    async getResourceUrl(baseUrl: string, data: any, fileType: string = "application/pdf") {

        if (baseUrl.hasExtensionName || baseUrl.startsWith("blob:"))
            return baseUrl;

        let requestHeaders = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'q=0.8;application/json;q=0.9');

        if (typeof (Storage) !== "undefined") {
            let token = localStorage.getItem("jwt_token");
            requestHeaders = requestHeaders.set('Authorization', token);
        }

        return new Promise<string>((resolve, reject) => {
            if (data) {
                this.httpClient.post(baseUrl, data,
                    { headers: requestHeaders, responseType: "arraybuffer", withCredentials: true })
                    .subscribe(data => {
                        let blobFile = new Blob([new Uint8Array(data)], { type: fileType });
                        let fileUrl = URL.createObjectURL(blobFile);
                        resolve(fileUrl);
                    }, (error) => reject(error));
            } else {
                this.httpClient.get(baseUrl,
                    { headers: requestHeaders, responseType: "arraybuffer", withCredentials: true })
                    .subscribe(data => {
                        let blobFile = new Blob([new Uint8Array(data)], { type: fileType });
                        let fileUrl = URL.createObjectURL(blobFile);
                        resolve(fileUrl);
                    }, (error) => reject(error));
            }
        });
    }
    async getResource(baseUrl: string, data: any, contentType: string = "application/pdf") {

        let requestHeaders = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'q=0.8;application/json;q=0.9');

        if (typeof (Storage) !== "undefined") {
            let token = localStorage.getItem("jwt_token");
            requestHeaders = requestHeaders.set('Authorization', token);
        }

        return new Promise<any>((resolve, reject) => {
            if (data) {
                this.httpClient.post(baseUrl, data,
                    { headers: requestHeaders, responseType: "json", withCredentials: true })
                    .subscribe(data => {

                        resolve(data);
                    }, (error) => reject(error));
            } else {
                this.httpClient.get(baseUrl,
                    { headers: requestHeaders, responseType: "json", withCredentials: true })
                    .subscribe(data => {
                        resolve(data);
                    }, (error) => reject(error));
            }
        });
    }

    convertToBinary(base64str: string) {
        let raw = atob(base64str);
        let data = new Uint8Array(new ArrayBuffer(raw.length));
        for (var i = 0; i < raw.length; i++) {
            data[i] = raw.charCodeAt(i);
        }
        return data;
    }

}