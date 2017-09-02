import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, HttpModule } from '@angular/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { LoadScriptService } from './load-script-service';
import { AppStoreService } from './app.store.service';

@Injectable()
export class AuthService {
    isLoggedIn: boolean = false;
    jwt: any;
    decodedJwt: any;
    private port = 5000;
    //192.168.10.233 127.0.0.1
    private signupUrl = this.appStateService.host + '/api/UserManager/Signup';
    private loginUrl = this.appStateService.host + '/api/token';

    public authError: Subject<string> = new BehaviorSubject<string>(null);
    public userJoined: Subject<string> = new BehaviorSubject<string>(null);

    constructor(private http: Http,
        private httpService: HttpService,
        private router: Router, private appStateService: AppStoreService,
        private loadSrciptService: LoadScriptService) {
        this.jwt = null;
        this.decodedJwt = null;
        this.isLoggedIn = false;
    }

    logout(url: string = null) {
        this.isLoggedIn = false;
        localStorage.removeItem('jwt_token');
        this.jwt = null;
        this.decodedJwt = null;
        if (url) this.router.navigateByUrl(url);
    }

    signup(username: string, password: string): Promise<void> {
        let header = new Headers();
        let requestOptions = new RequestOptions();
        header.append("Content-Type", "application/x-www-form-urlencoded");
        requestOptions.headers = header;
        requestOptions.url = this.signupUrl;
        let postBody: string = "username=" + username + "&password=" + password;
        return this.http.post(this.signupUrl, postBody, requestOptions)
            .toPromise()
            .then(response => {
                let resJson = response.json();
                return this.getToken(this.loginUrl, username, resJson.usersign);
            }, error => {
                this.authError.next(error.text());
            });
    }

    login(username: string, password: string): Promise<void> {
        return this.loadSrciptService.loadCryptoJS.then((js) => {
            let sign = CryptoJS.HmacSHA1(username, password).toString(CryptoJS.enc.Base64);
        //     var keyHex = CryptoJS.enc.Utf8.parse('sblw-3hn8-sqoy19');
        // var encrypted =CryptoJS.AES.encrypt('DesEncrypt',keyHex);
        
        //  CryptoJS.TripleDES.encrypt('DesEncrypt', 'sblw-3hn8-sqoy19', {
             
        //     mode: CryptoJS.mode.ECB,
        //     padding: CryptoJS.pad.Pkcs7
        // });
        // console.log(encrypted.toString());
        // console.log(encrypted.ciphertext.toString(CryptoJS.enc.Base64));
            return this.getToken(this.loginUrl, username, sign);
        });
    }

    private post(url: string, username: string, password: string): Promise<void> {
        return this.loadSrciptService.loadCryptoJS.then((js) => {
            let header = new Headers();
            let requestOptions = new RequestOptions();
            header.append("Content-Type", "application/x-www-form-urlencoded");
            requestOptions.headers = header;
            requestOptions.url = url;
            CryptoJS.AES
            let sign = CryptoJS.HmacSHA1(username, password).toString(CryptoJS.enc.Base64);
            let postBody: string = "username=" + username + "&usersign=" + sign;
            return this.http.post(url, postBody, requestOptions)
                .toPromise()
                .then(response => {
                    let resJson = response.json();
                    this.isLoggedIn = true;
                    this.jwt = resJson.access_token;
                    localStorage.setItem('jwt_token', this.jwt);
                }, error => {
                    this.authError.next(error.text());
                });
        });
    }

    private getToken(url: string, username: string, usersign: string): Promise<void> {

        let header = new Headers();
        let requestOptions = new RequestOptions();
        header.append("Content-Type", "application/x-www-form-urlencoded");
        requestOptions.headers = header;
        requestOptions.url = url;
        let postBody: string = "username=" + username + "&usersign=" + usersign;
        return this.http.post(url, postBody, requestOptions)
            .toPromise()
            .then(response => {
                let resJson = response.json();
                this.isLoggedIn = true;
                this.jwt = resJson.access_token;
                localStorage.setItem('jwt_token', this.jwt);
            }, error => {
                this.authError.next(error.text());
            });
    }



    relogin() {
    }

}