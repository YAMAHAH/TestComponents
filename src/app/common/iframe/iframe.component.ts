import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, RequestOptions, Headers } from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'x-iframe',
    templateUrl: 'iframe.component.html',
    styleUrls: ['iframe.component.css']
})
export class IframeComponent implements OnInit {
    @Input() src: string;
    safeSrc: SafeResourceUrl;

    //?file=qbs.pdf
    constructor(private sanitizer: DomSanitizer, private http: Http) {
        this.getPdf();
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/pdfjs/web/viewer.html");
        setTimeout(() => this.print(), 5000);
    }
    ngOnInit() {

    }
    @ViewChild("iframeContainer", { read: ElementRef }) iframeContainer: ElementRef;
    print() {
        if (this.iframeContainer) this.iframeContainer.nativeElement.contentWindow.print();
    }
    default_url: string | Uint8Array;
    file_url: string;
    isLoad: boolean = true;
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
                //支持字符串,arrayBuffer,Url
                this.file_url = "MaterialPreparation.pdf";
                localStorage.setItem("default_url", res.text());
            });
    }
    dataURLtoBlob(data: any) {//data是文件流
        var bstr = atob(data);//解码
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);//转二进制
        }
        return new Blob([u8arr], { type: 'application/pdf' });//用blob生成pdf文件,返回PDF文件
    }
    convertToBinary(base64str: string) {
        let raw = atob(base64str);
        let data = new Uint8Array(new ArrayBuffer(raw.length));
        for (var i = 0; i < raw.length; i++) {
            data[i] = raw.charCodeAt(i);
        }
        return data;
    }

    convertDataURIToBinary(dataURI: string) {   //编码转换，回答问题3
        let BASE64_MARKER = ';base64,';
        let base64Index = 0; //dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        let base64 = dataURI.substring(base64Index);
        let raw = atob(base64);
        let rawLength = raw.length;
        //转换成pdf.js能直接解析的Uint8Array类型,见pdf.js-4068
        let array = new Uint8Array(new ArrayBuffer(rawLength));
        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }
    readBlobAsDataURL(blob: Blob, callback: Function) {
        let a = new FileReader();

        a.onload = (e) => { callback(e.target); };
        a.readAsDataURL(blob);
    }
    async getPdfStream() {
        await this.getPdf();
        return this.default_url;
    }
}
