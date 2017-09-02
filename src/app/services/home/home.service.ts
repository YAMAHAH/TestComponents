import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable()
export class HomeService {

    constructor(private httpService: HttpService) { }
    getReport(reportId: number, rootId: number) {
        let apiUrl = "http://192.168.10.233:5000/api/Reports/GetReport";
        return this.httpService.httpPostWithNoBlock({ playload: [{ ReportId: reportId, RootId: rootId }] }, apiUrl);
    }
}