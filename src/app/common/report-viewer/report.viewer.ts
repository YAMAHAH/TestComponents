
import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPDFPluginInstall } from '../../untils/pdf-plugin';

@Component({
    moduleId: module.id,
    selector: 'x-report-viewer',
    host: {
        '[class.flex-column-container-item]': 'true',
    },
    templateUrl: 'report.viewer.html',
    styleUrls: ['report.viewer.css']
})
export class ReportViewer implements OnInit, OnDestroy {

    @Input() src: string;
    @Input() title: string = "标题";
    pdfViewerSrc: SafeResourceUrl;
    pdfSrc: SafeResourceUrl;
    constructor(private sanitizer: DomSanitizer,
        private httpClient: HttpClient) {
    }
    buildInPlugin: boolean;
    ngOnInit() {
        this.buildInPlugin = isPDFPluginInstall();
        this.getDefaultUrl();
        setTimeout(() => this.print(), 10000);
        setTimeout(() => this.getPdfBlobUrl(null, null), 15000);
        setTimeout(() => this.print(), 25000);
    }
    ngOnDestroy(): void {
        URL.revokeObjectURL(this.fileUrl);
    }
    //返回结果
    modalResult: EventEmitter<any>;
    //传递进来的参数
    contex: any;
    // title: string = "简易ERP系统登录";
    // modalResult: EventEmitter<any>;
    // show() {
    //     let options: FormOptions = new FormOptions();
    //     options.responsive = true;
    //     options.width = 450;
    //     options.height = 310;
    //     options.header = this.title;
    //     options.modal = true;
    //     options.visible = true;
    //     options.closable = false;
    //     options.resizable = false;
    //     options.titleAlign = FormTitleAlignEnum.center;
    //     options.appendComponentRef = this;
    //     options.rootContainer = this.viewContainerRef;
    //     options.injector = this.viewContainerRef.parentInjector;

    //     this.appStore.modalService.showForm(options)
    //         // .delay(50)
    //         .subscribe((res: { action: string, status: string }) => {
    //             switch (res.action) {
    //                 case "login":
    //                     this.test(this.target, this.defaultPage);
    //                     //  this.router.navigateByUrl(this.target ? this.target : this.defaultPage, { skipLocationChange: true });
    //                     this.isLogining = true;
    //                     break;
    //                 case "signup":
    //                     this.router.navigateByUrl('/auth/signup', { skipLocationChange: true })
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         });
    // }
    @ViewChild("pdfViewer", { read: ElementRef }) pdfViewerRef: ElementRef;
    @ViewChild("pdfPlugin", { read: ElementRef }) pdfPluginRef: ElementRef;
    print() {

        if (this.pdfViewerRef)
            this.pdfViewerRef.nativeElement.contentWindow.print();
        if (this.pdfPluginRef)
            this.pdfPluginRef.nativeElement.contentWindow.print();
    }
    default_url: string | Uint8Array;
    async getPdf() {
        let requestHeaders = new HttpHeaders();
        requestHeaders.append('Content-Type', 'application/json');
        requestHeaders.append('Accept', 'q=0.8;application/json;q=0.9');

        if (typeof (Storage) !== "undefined") {
            let token = localStorage.getItem("jwt_token");
            requestHeaders.append('Authorization', token);
        }
        this.httpClient.get('/api/Users/GetPdf', { headers: requestHeaders, responseType: "text" })
            .subscribe(res => {
                localStorage.setItem("default_url", res);
            });
    }
    dataURLtoBlob(data: string) {
        var bstr = atob(data);//解码
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);//转二进制
        }
        return new Blob([u8arr], { type: 'application/pdf' });
    }
    convertToBinary(base64str: string) {
        let raw = atob(base64str);
        let data = new Uint8Array(new ArrayBuffer(raw.length));
        for (var i = 0; i < raw.length; i++) {
            data[i] = raw.charCodeAt(i);
        }
        return data;
    }
    readBlobAsDataURL(blob: Blob, callback: Function) {
        let fileReader = new FileReader();
        fileReader.onload = (e) => { callback(e.target); };
        fileReader.readAsDataURL(blob);
    }

    fileUrl: string;
    getPdfBlobUrl(baseUrl: string, fileType: string) {
        let requestHeaders = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'q=0.8;application/json;q=0.9');

        if (typeof (Storage) !== "undefined") {
            let token = localStorage.getItem("jwt_token");
            requestHeaders = requestHeaders.set('Authorization', token);
        }

        this.httpClient.get('/api/Users/GetBlobPdf',
            { headers: requestHeaders, responseType: "arraybuffer", withCredentials: true })
            .subscribe(data => {
                let blobFile = new Blob([new Uint8Array(data)], { type: "application/pdf" }); //application/octet-stream
                this.fileUrl = URL.createObjectURL(blobFile);
                // fileURL = encodeURIComponent(fileURL).replace("blob:http", "blob:https");
                // fileURL = fileURL.replace("%3A9090", "");
                if (this.buildInPlugin)
                    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
                else
                    this.pdfViewerSrc = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/pdfjs/web/viewer.html?file=" + this.fileUrl);
            });
    }
    getDefaultUrl() {
        let requestHeaders = new HttpHeaders()
            .append('Content-Type', 'application/json')
            .append('Accept', 'q=0.8;application/json;q=0.9');
        if (typeof (Storage) !== "undefined") {
            let token = localStorage.getItem("jwt_token");
            requestHeaders = requestHeaders.append('Authorization', token);
        }
        this.httpClient.get('http://localhost:9500/home/pdf?report=0',
            { headers: requestHeaders, responseType: "arraybuffer" })
            .subscribe(data => {
                let file = new Blob([new Uint8Array(data)], { type: "application/pdf" });
                this.fileUrl = window.URL.createObjectURL(file);
                if (this.buildInPlugin)
                    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
                else
                    this.pdfViewerSrc = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/pdfjs/web/viewer.html?file=" + this.fileUrl);
            });
    }
    _tokenKeyCache = new Map<any, string>();

    tokenKey(token: any): string {
        let key = this._tokenKeyCache.get(token);
        if (!key) {
            key = this.stringify(token) + '_' + this._tokenKeyCache.size;
            this._tokenKeyCache.set(token, key);
        }
        return key;
    }
    stringify(token: any): string {
        if (typeof token === 'string') {
            return token;
        }

        if (token == null) {
            return '' + token;
        }

        if (token.overriddenName) {
            return `${token.overriddenName}`;
        }

        if (token.name) {
            return `${token.name}`;
        }

        const res = token.toString();

        if (res == null) {
            return '' + res;
        }

        const newLineIndex = res.indexOf('\n');
        return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
    }
}
