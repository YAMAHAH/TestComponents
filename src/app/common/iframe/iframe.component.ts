
import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, RequestOptions, Headers } from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'x-iframe',
    templateUrl: 'iframe.component.html',
    styleUrls: ['iframe.component.css']
})
export class IframeComponent implements OnInit, OnDestroy {

    @Input() src: string;
    @Input() title: string = "标题";
    pdfViewerSrc: SafeResourceUrl;
    pdfSrc: SafeResourceUrl;
    constructor(private sanitizer: DomSanitizer,
        private http: Http,
        private httpClient: HttpClient) {
    }
    ngOnInit() {
        this.getDefaultUrl();
        setTimeout(() => this.print(), 5000);
        setTimeout(() => this.getPdfBlobUrl(null, null), 15000);
        setTimeout(() => this.print(), 25000);
    }
    ngOnDestroy(): void {
        URL.revokeObjectURL(this.fileUrl);
    }
    @ViewChild("pdfViewer", { read: ElementRef }) pdfViewerRef: ElementRef;
    @ViewChild("pdfPlugin", { read: ElementRef }) pdfPluginRef: ElementRef;
    print() {
        if (this.pdfViewerRef)
            this.pdfViewerRef.nativeElement.contentWindow.print();
    }
    default_url: string | Uint8Array;
    async getPdf() {
        let requestHeaders = new Headers();
        requestHeaders.append('Content-Type', 'application/json');
        requestHeaders.append('Accept', 'q=0.8;application/json;q=0.9');

        if (typeof (Storage) !== "undefined") {
            let token = localStorage.getItem("jwt_token");
            requestHeaders.append('Authorization', token);
        }
        let options = new RequestOptions({ headers: requestHeaders });

        this.http.get('/api/Users/GetPdf', options)
            .subscribe(res => {
                localStorage.setItem("default_url", res.text());
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
        let requestHeaders = new HttpHeaders();
        requestHeaders.append('Content-Type', 'application/json');
        requestHeaders.append('Accept', 'q=0.8;application/json;q=0.9');

        if (typeof (Storage) !== "undefined") {
            let token = localStorage.getItem("jwt_token");
            requestHeaders.append('Authorization', token);
        }

        this.httpClient.get('/api/Users/GetStreamPdf',
            { headers: requestHeaders, responseType: "arraybuffer" })
            .subscribe(data => {
                let blobFile = new Blob([new Uint8Array(data)], { type: "application/pdf" }); //application/octet-stream
                this.fileUrl = URL.createObjectURL(blobFile);
                // fileURL = encodeURIComponent(fileURL).replace("blob:http", "blob:https");
                // fileURL = fileURL.replace("%3A9090", "");
                this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
                this.pdfViewerSrc = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/pdfjs/web/viewer.html?file=" + this.fileUrl);
            });
    }
    getDefaultUrl() {
        let requestHeaders = new HttpHeaders();
        requestHeaders.append('Content-Type', 'application/json');
        requestHeaders.append('Accept', 'q=0.8;application/json;q=0.9');
        if (typeof (Storage) !== "undefined") {
            let token = localStorage.getItem("jwt_token");
            requestHeaders.append('Authorization', token);
        }
        this.httpClient.get('/label.pdf',
            { headers: requestHeaders, responseType: "arraybuffer" })
            .subscribe(data => {
                let file = new Blob([new Uint8Array(data)], { type: "application/pdf" });
                this.fileUrl = window.URL.createObjectURL(file);
                this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
                this.pdfViewerSrc = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/pdfjs/web/viewer.html?file=" + this.fileUrl);
            });
    }
}
