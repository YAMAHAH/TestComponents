
import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, EventEmitter, ViewEncapsulation, Renderer2, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPDFPluginInstall } from '../../untils/pdf-plugin';
import { HttpParams } from "@angular/common/http";
import { LoadScriptService } from '../../services/load-script-service';
import { AnimateEffectEnum } from '../page-loading/animate-effect-enum';
import { DownloadManager } from '../../services/download.manager';
import { PageLoadingComponent } from '../page-loading/page-loading-comp';
import { Observable } from 'rxjs/Rx';
import { ReportManagerService } from './report-manager.service';
import json from '../printjs/json';
import html from '../printjs/html';
import image from '../printjs/image';
import Browser from '../../untils/browser';

@Component({
    moduleId: module.id,
    selector: 'x-report-viewer',
    host: {
        '[class.flex-column-container-item]': 'true',
    },
    templateUrl: 'report.viewer.html',
    styleUrls: ['report.viewer.css']
})
export class ReportViewer implements OnInit, AfterViewInit, OnDestroy {


    @Input() src: string;
    pdfViewerSrc: SafeResourceUrl;
    pdfSrc: SafeResourceUrl;
    @ViewChild(PageLoadingComponent) loading: PageLoadingComponent;
    constructor(private sanitizer: DomSanitizer,
        private loadScriptService: LoadScriptService,
        private reportMan: ReportManagerService,
        private cdRef: ChangeDetectorRef,

        private renderer: Renderer2,
        private httpClient: HttpClient) {
        this.loadScriptService
            .loadSnapSvg
            .then(snap => {

            });
    }
    buildInPlugin: boolean;
    reportType: printJSType;

    ngOnInit() {
        this.buildInPlugin = isPDFPluginInstall();
        this.silent = true;
        this.reportType = this.context.type;
        switch (this.reportType) {
            case 'pdf':
                this.reportMan.getReportBlobUrl(this.context.baseUrl, this.context.data)
                    .then(res => {
                        this.fileUrl = res;
                        if (this.buildInPlugin)
                            this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
                        else
                            this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/pdfjs/web/viewer.html?file=" + this.fileUrl);
                        this.dataLoaded = true;
                        this.onLoad(null);
                    });
                break;
            case 'json':
                json.preview(this.context.options, this.iFrameRef.nativeElement);
                this.dataLoaded = true;
                this.onLoad(null);
                break;
            case 'html':
                html.preview(this.context.options, this.iFrameRef.nativeElement);
                this.dataLoaded = true;
                this.onLoad(null);
                break;
            case 'image':
                image.preview(this.context.options, this.iFrameRef.nativeElement)
                    .then(htmlData => {
                        this.dataLoaded = true;
                        this.onLoad(null);
                    });
                break;
            default:
                break;
        }
        // this.getDefaultUrl("0", null, "")
        // setTimeout(() => this.print(), 10000);
        //  setTimeout(() => this.getPdfBlobUrl(null, null), 6000);
    }

    ngAfterViewInit(): void {

        this.loading.showLoading(AnimateEffectEnum.random);
        setTimeout(() => {
            // this.reportMan.print(this.fileUrl, null);
            // this.reportMan.download(this.fileUrl, null);
        }, 10000);
    }
    ngOnDestroy(): void {
        URL.revokeObjectURL(this.fileUrl);
        this.animate_id.unsubscribe();
    }
    //返回结果
    modalResult: EventEmitter<any>;
    //传递进来的参数
    context: any;
    silent: boolean = true;
    // @ViewChild("pdfViewer", { read: ElementRef }) pdfViewerRef: ElementRef;
    @ViewChild("pdfPlugin", { read: ElementRef }) iFrameRef: ElementRef;
    print() {
        // if (this.pdfViewerRef)
        //     this.pdfViewerRef.nativeElement.contentWindow.print();
        // if (this.pdfPluginRef)
        //     this.pdfPluginRef.nativeElement.contentWindow.print();
    }

    animate_id = Observable.interval(150).subscribe(res => this.animate());
    pos: number = 0;
    dir: number = 21;
    len: number = 0;

    @ViewChild("progress_ref") progess_ref: ElementRef;
    animate() {
        let elem = this.progess_ref.nativeElement;
        if (this.pos == 0) this.len += this.dir;
        if (this.len > 32 || this.pos > 179) this.pos += this.dir;
        if (this.pos > 179) this.len -= this.dir;
        if (this.pos > 179 && this.len == 0) this.pos = 0;
        this.renderer && this.renderer.setStyle(elem, 'left', this.pos + 'px');
        this.renderer && this.renderer.setStyle(elem, 'width', this.len + 'px');
    }

    @ViewChild("loader_container_ref") loader_container_ref: ElementRef;
    remove_loading() {
        this.showOverlay = false;
        this.animate_id.unsubscribe();
        if (this.loader_container_ref) {
            this.loader_container_ref.nativeElement.style.display = 'none';
            this.loader_container_ref.nativeElement.style.visibility = 'hidden';
        }
    }
    showOverlay: boolean = false;
    show_loading() {
        this.showOverlay = true;
        this.pos = 0;
        this.len = 0;
        this.cdRef.detectChanges();

        // if (this.loader_container_ref) {
        this.loader_container_ref.nativeElement.style.display = 'block';
        this.loader_container_ref.nativeElement.style.visibility = 'visible';
        if (this.animate_id) this.animate_id.unsubscribe();
        this.animate_id = Observable.interval(150).subscribe(res => this.animate());
        // }
    }

    default_url: string | Uint8Array;
    async getPdf() {
        //(this.pdfViewerRef.nativeElement as HTMLIFrameElement)
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

    dataLoaded: boolean
    onLoad(event: Event) {
        if (this.dataLoaded) {
            if (this.reportType === 'pdf' && (Browser.isIE() || Browser.isEdge())) {
            } else {
                if (this.reportType === 'pdf') {
                    ;
                } else {
                    let iframeElement: HTMLIFrameElement = this.iFrameRef.nativeElement;
                    // Get iframe element document
                    let printDocument: any;
                    if (iframeElement.contentWindow)
                        printDocument = iframeElement.contentWindow;
                    else
                        printDocument = iframeElement.contentDocument;

                    if ((printDocument as any).document) printDocument = (printDocument as any).document;

                    // Inject printable html into iframe body
                    printDocument.body.innerHTML = this.context.options.htmlData;
                }
            }
            setTimeout(() => {
                this.silent = false;
                this.dataLoaded = false;
                this.loading.Hide();
            }, 1000);
        }
    }
    fileUrl: string;
    getPdfBlobUrl(baseUrl: string, fileType: string) {
        this.silent = true;
        this.loading.showLoading(AnimateEffectEnum.random);
        // this.show_loading();

        let requestHeaders = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'q=0.8;application/json;q=0.9');

        if (typeof (Storage) !== "undefined") {
            let token = localStorage.getItem("jwt_token");
            requestHeaders = requestHeaders.set('Authorization', token);
        }

        this.httpClient.get('http://localhost:9500/home/pdf?report=2',
            { headers: requestHeaders, responseType: "arraybuffer", withCredentials: true })
            .subscribe(data => {
                let blobFile = new Blob([new Uint8Array(data)], { type: "application/pdf" }); //application/octet-stream
                this.fileUrl = URL.createObjectURL(blobFile);
                // fileURL = encodeURIComponent(fileURL).replace("blob:http", "blob:https");
                // fileURL = fileURL.replace("%3A9090", "");

                if (this.buildInPlugin)
                    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
                else
                    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/pdfjs/web/viewer.html?file=" + this.fileUrl);
                this.dataLoaded = true;
            });
    }
    /**
     * 
     * @param reportId 报表ID
     * @param data  报表数据
     */
    getDefaultUrl(reportId: string, data: any, reportUrl: string = null) {
        this.loading.showLoading(AnimateEffectEnum.random);
        // this.show_loading();
        let requestHeaders = new HttpHeaders()
            .append('Content-Type', 'application/json')
            .append('Accept', 'q=0.8;application/json;q=0.9');
        if (typeof (Storage) !== "undefined") {
            let token = localStorage.getItem("jwt_token");
            requestHeaders = requestHeaders.append('Authorization', token);
        }
        let rptUrl = reportUrl || 'http://localhost:9500/home/pdf';
        let httpParams = new HttpParams().set("report", reportId);
        this.httpClient.get(rptUrl,
            { headers: requestHeaders, params: httpParams, withCredentials: true, responseType: "arraybuffer" })
            .subscribe(data => {
                let uInt8Array = new Uint8Array(data);
                let file = new Blob([uInt8Array], { type: "application/pdf" });
                this.fileUrl = window.URL.createObjectURL(file);
                // this.downloadManager.downloadData(uInt8Array, "myfile.pdf", "application/pdf");
                if (this.buildInPlugin)
                    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
                else
                    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/pdfjs/web/viewer.html?file=" + this.fileUrl);
                this.dataLoaded = true;
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
