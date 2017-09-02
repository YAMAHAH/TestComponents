import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { Router } from '@angular/router';

@Injectable()
export class AuthService2 {
    isLoggedIn: boolean = false;
    jwt: any;
    decodedJwt: any;
    private port = 9000;
    private signupUrl = 'http://localhost:' + this.port + '/users';
    private loginUrl = 'http://localhost:' + this.port + '/sessions/create';

    public authError: Subject<string> = new BehaviorSubject<string>(null);
    public userJoined: Subject<string> = new BehaviorSubject<string>(null);
    data:any;

    constructor(private http: Http, private router: Router) {
        this.jwt = null;
        this.decodedJwt = null;
        this.isLoggedIn = false;
        this.data = new Date().getTime();
    }

    logout(url: string = null) {
        this.isLoggedIn = false;
        localStorage.removeItem('jwt');
        this.jwt = null;
        this.decodedJwt = null;
        if (url) this.router.navigateByUrl(url);
    }

    signup(username: string, password: string, avatar: string): Promise<void> {
        return this.post(this.signupUrl, username, password, 'avatar');
    }

    login(username: string, password: string): Promise<void> {
        return this.post(this.loginUrl, username, password);
    }

    private post(url: string, username: string, password: string, avatar?: string): Promise<void> {
        this.isLoggedIn = true;
        return Promise.resolve();
        // let body = JSON.stringify({ username, password, avatar });
        // let contentHeaders = new Headers();
        // contentHeaders.append('Accept', "application/json");
        // contentHeaders.append('Content-Type', 'application/json');
        // return this.http
        //     .post(url, body, { headers: contentHeaders })
        //     .toPromise()
        //     .then(response => {
        //         let userJson = response.json();
        //         this.isLoggedIn = true;
        //         this.jwt = userJson.id_token;
        //         localStorage.setItem('jwt', this.jwt);
        //     }, error => {
        //         this.authError.next(error.text());
        //     });
    }

    relogin() {
    }

}