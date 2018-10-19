import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { serialize } from 'json-typescript-mapper';


const API_URL = 'https://agentapi.propelrr.com';
// const API_URL = 'http://10.0.1.33:8080';
const API_CLIENT_ID = 'ppep_agent_core';
const API_CLIENT_SECRET = 'c1On0vGm4jebEtM8wPpDFFTv8DCDAfHsC39FaHPKA4U=';
const API_GENERIC_USERNAME = 'pepp_agent_app';
const API_GENERIC_PASSWORD = '3xPrEs$p@dALa';

@Injectable({
    providedIn: 'root'
})
export class HttpManagerService {

    constructor(private http: HttpClient) { }


    static getBasicAuthorization(): string {
        return btoa(API_CLIENT_ID + ':' + API_CLIENT_SECRET);
    }

    static getBasicHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ` + `${HttpManagerService.getBasicAuthorization()}`
            }),
            withCredentials: true
        };
    }

    static getJsonBearerHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + `${HttpManagerService.getToken()}`
            }),
            withCredentials: true
        };
    }

    static setToken(token: string) {
        localStorage.setItem('token', token);
    }

    static setRefreshToken(token: string) {
        localStorage.setItem('refresh_token', token);
    }

    static getUsername() {
        return localStorage.getItem('username');
    }

    static getPassword() {
        return localStorage.getItem('password');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getRefreshToken() {
        return localStorage.getItem('refresh_token');
    }

    static removeTokens() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
    }

    public isLoginWithUserCredentials(): boolean {
        return (HttpManagerService.getPassword() != null && HttpManagerService.getUsername() != null);
    }

    public isAuthenticated(): boolean {
        const token = HttpManagerService.getToken();
        const helper = new JwtHelperService();
        return !helper.isTokenExpired(token);
    }

    public setUserCredentials(username: string, password: string) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
    }

    public removeCredentials() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
    }

    /* Request OAUTH Token */

    requestAccessToken() {
        return new Promise((resolve, reject) => {

            const data = new URLSearchParams();
            const username =
                this.isLoginWithUserCredentials() ?
                    HttpManagerService.getUsername() : API_GENERIC_USERNAME;

            const password = this.isLoginWithUserCredentials() ?
                HttpManagerService.getPassword() : API_GENERIC_PASSWORD;

            data.append('username', username);
            data.append('password', password);
            data.append('grant_type', 'password');

            this.http
                .post(API_URL + '/oauth/token', data.toString(), HttpManagerService.getBasicHttpOptions())
                .subscribe(
                    response => {
                        HttpManagerService.setToken(response['access_token']);
                        HttpManagerService.setRefreshToken(response['refresh_token']);
                        resolve(response);
                    },
                    error => reject(error));
        });
    }

    /* Refresh OAUTH Token */

    refreshAccessToken() {
        return new Promise((resolve, reject) => {

            const data = new URLSearchParams();
            data.append('refresh_token', HttpManagerService.getRefreshToken());
            data.append('grant_type', 'refresh_token');

            this.http
                .post(API_URL + '/oauth/token', data.toString(), HttpManagerService.getBasicHttpOptions())
                .subscribe(
                    response => {
                        HttpManagerService.setToken(response['access_token']);
                        HttpManagerService.setRefreshToken(response['refresh_token']);
                        resolve(response);
                    },
                    error => {
                        this.removeCredentials();
                        HttpManagerService.removeTokens();
                        reject(error);
                    });
        });
    }

    /* HTTP GET METHOD */
    getHttpOnce(url: string) {
        return new Promise((resolve, reject) => {
            this.http.get(API_URL + url, HttpManagerService.getJsonBearerHttpOptions())
                .subscribe(
                    data => { resolve(data); },
                    error => { reject(error); }
                );
        });
    }

    getHttpWithRequestingToken(url: string) {
        return this.requestAccessToken().then(
            () => {
                return this.getHttpOnce(url);
            }
        );
    }

    getHttpWithRefreshingToken(url: string) {
        if (!this.isAuthenticated()) {
            return this.refreshAccessToken().then(
                (data) => {
                    return this.getHttpOnce(url);
                }
            );
        } else {
            return this.getHttpOnce(url);
        }
    }

    /* HTTP POST METHOD */
    postJsonOnce(url: string, object: Object) {
        return new Promise((resolve, reject) => {

            let params;
            if (object) {
                params = JSON.stringify(serialize(object));
            }
            this.http.post(API_URL + url, params, HttpManagerService.getJsonBearerHttpOptions())
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    postJsonDataWithRequestingToken(url: string, object: Object) {
        return this.requestAccessToken().then(
            () => {
                return this.postJsonOnce(url, object);
            }
        );
    }

    postJsonDataWithRefreshingToken(url: string, object: Object) {
        if (!this.isAuthenticated()) {
            return this.refreshAccessToken().then(
                (data) => {
                    return this.postJsonOnce(url, object);
                }
            );
        } else {
            return this.postJsonOnce(url, object);
        }
    }

    /* HTTP PUT METHOD */
    putJsonOnce(url: string, object: Object) {
        return new Promise((resolve, reject) => {
            this.http.put(API_URL + url, JSON.stringify(serialize(object)), HttpManagerService.getJsonBearerHttpOptions())
                .subscribe(
                    data => { resolve(data); },
                    error => { reject(error); }
                );
        });
    }

    putJsonDataWithRequestingToken(url: string, object: Object) {
        return this.requestAccessToken().then(
            () => {
                return this.putJsonOnce(url, object);
            }
        );
    }

    putJsonDataWithRefreshingToken(url: string, object: Object) {
        if (!this.isAuthenticated()) {
            return this.refreshAccessToken().then(
                (data) => {
                    return this.putJsonOnce(url, object);
                }
            );
        } else {
            return this.putJsonOnce(url, object);
        }
    }


    /* HTTP DELETE METHOD */

    deleteHTTPOnce(url: string) {
        return new Promise((resolve, reject) => {
            this.http.delete(API_URL + url, HttpManagerService.getJsonBearerHttpOptions())
                .subscribe(
                    data => { resolve(data); },
                    error => { reject(error); }
                );
        });
    }

    deleteHttpWithRequestingToken(url: string) {
        return this.requestAccessToken().then(
            () => {
                return this.deleteHTTPOnce(url);
            }
        );
    }

    deletetpWithRefreshingToken(url: string) {
        if (!this.isAuthenticated()) {
            return this.refreshAccessToken().then(
                (data) => {
                    return this.deleteHTTPOnce(url);
                }
            );
        } else {
            return this.deleteHTTPOnce(url);
        }
    }

    /* Logout User */

    public logout() {
        this.removeCredentials();
        HttpManagerService.removeTokens();
    }
}
