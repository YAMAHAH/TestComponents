import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { Headers, RequestOptions } from '@angular/http';
import { BlockUIService } from './blockui.service';


@Injectable()
export class HttpService {

    constructor(private http: Http, private blockUIService: BlockUIService) {
    }

    public httpPost(object: any, url: string): Observable<any> {

        this.blockUIService.blockUIEvent.emit({
            value: true
        });

        let body = JSON.stringify(object);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'q=0.8;application/json;q=0.9');

        if (typeof (Storage) !== "undefined") {

            let token = localStorage.getItem("jwt_token");
            headers.append('Authorization', token);
        }

        let options = new RequestOptions({ headers: headers });

        return this.http.post(url, body, options)
            .map((response) => this.parseResponse(response, this.blockUIService, true))
            .catch((err) => this.handleError(err, this.blockUIService, true));

    }


    public httpPostWithNoBlock(object: any, url: string): Observable<any> {

        let body = JSON.stringify(object);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'q=0.8;application/json;q=0.9');

        if (typeof (Storage) !== "undefined") {

            let token = localStorage.getItem("jwt_token");
            headers.append('Authorization', token);
        }

        let options = new RequestOptions({ headers: headers });

        return this.http.post(url, body, options)
            .map((response) => this.parseResponse(response, this.blockUIService, false))
            .catch((err) => this.handleError(err, this.blockUIService, false));

    }


    private handleError(error: any, blockUIService: BlockUIService, blocking: Boolean) {

        let body = error.json();

        if (blocking) {
            blockUIService.blockUIEvent.emit({
                value: false
            });
        }
        return Observable.throw(body);

    }

    private parseResponse(response: Response, blockUIService: BlockUIService, blocking: Boolean) {

        let authorizationToken = response.headers.get("Authorization");
        if (authorizationToken != null) {

            if (typeof (Storage) !== "undefined") {
                localStorage.setItem("jwt_token", authorizationToken);
            }
        }

        if (blocking) {
            blockUIService.blockUIEvent.emit({
                value: false
            });
        }

        let body = response.json();

        return body;
    }


}