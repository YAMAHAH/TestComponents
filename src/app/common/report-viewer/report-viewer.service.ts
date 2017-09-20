import { Injectable } from '@angular/core';
import { DownloadManager } from '../../services/download.manager';

@Injectable()
export class ReportViewerService {

    constructor(private downloadManager: DownloadManager) {

    }
    preview(reportId: string, data: any) {
        //
    }
    print(reportId: string, data: any) {

    }

    download(reportId: string, data: ArrayBuffer, fileName: string, contentType: string = "application/pdf") {
        //获取报表的PDFblob数据
        let reportBlob: Uint8Array = new Uint8Array(data);
        //
        this.downloadManager.downloadData(reportBlob, fileName, "application/pdf");
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