import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    moduleId: module.id,
    selector: 'x-iframe',
    templateUrl: 'iframe.component.html',
    styleUrls: ['iframe.component.css']
})
export class IframeComponent {
    @Input() src: string;
    safeSrc: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/pdfjs/web/viewer.html");
        setTimeout(() => this.print(), 10000);
    }
    @ViewChild("iframeContainer", { read: ElementRef }) iframeContainer: ElementRef;
    print() {
        (this.iframeContainer.nativeElement as HTMLIFrameElement).contentWindow.print(); //[0].contentWindow.print();
    }
}
