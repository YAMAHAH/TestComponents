import { Injectable } from '@angular/core';
import { DownloadManager } from '../../services/download.manager';
import { LoadScriptService } from '../../services/load-script-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppStoreService } from '../../services/app.store.service';

@Injectable()
export class ReportManagerService {
    constructor(private downloadManager: DownloadManager,
        private httpClient: HttpClient,
        private globalService: AppStoreService,
        private loadScriptService: LoadScriptService) {
    }
    preview(baseUrl: string, data: any, type: printJSType = "pdf",
        options: printJsOptions = { type: "pdf" }) {

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
        if (options)
            defaultParams = Object.assign(defaultParams, options);
        return this.globalService.taskManager
            .showReportViewer({
                resolve: { data, baseUrl, type, options: defaultParams }
            });
    }
    async print(baseUrl: string, bodyData: any,
        fileType: string = "application/pdf",
        printOptions: printJsOptions = { type: "pdf" }) {
        if (String.isBlank(baseUrl)) throw new Error("print url is null.");
        let fileUrl: string;
        if (baseUrl.hasExtensionName || baseUrl.startsWith("blob:")) {
            fileUrl = baseUrl;
        } else {
            //从远程获取数据流,转换成URL
            fileUrl = await this.getReportBlobUrl(baseUrl, bodyData, fileType);
        }
        this.loadScriptService.loadPrintCSS
            .then(css => {
                this.loadScriptService.loadPrintjs
                    .then(print => {
                        printJS(fileUrl);
                    });
            });
    }

    async download(baseUrl: string, bodyData: any, fileName: string = null, contentType: string = "application/pdf") {
        if (String.isBlank(baseUrl)) throw new Error("print url is null.");
        //  //获取报表的PDFblob数据
        // let reportBlob: Uint8Array = new Uint8Array(data);
        // this.downloadManager.downloadData(reportBlob, fileName, "application/pdf");
        let fileUrl: string;

        if (baseUrl.hasExtensionName || baseUrl.startsWith("blob:")) {
            fileUrl = baseUrl;
        } else {
            //从远程获取数据流,转换成URL
            fileUrl = await this.getReportBlobUrl(baseUrl, bodyData, contentType)
        }
        if (String.isNullOrEmpty(fileName)) {
            fileName = baseUrl.GetFileName;
        }

        if (fileUrl.startsWith("blob:")) {
            this.downloadManager.downloadBlobUrl(fileUrl, fileName);
        } else {
            this.downloadManager.downloadUrl(fileUrl, fileName);
        }
    }

    async getReportBlobUrl(baseUrl: string, data: any, fileType: string = "application/pdf") {
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

    convertToBinary(base64str: string) {
        let raw = atob(base64str);
        let data = new Uint8Array(new ArrayBuffer(raw.length));
        for (var i = 0; i < raw.length; i++) {
            data[i] = raw.charCodeAt(i);
        }
        return data;
    }

}