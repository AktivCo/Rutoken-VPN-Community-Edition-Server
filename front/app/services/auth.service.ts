import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, last, mergeMap } from 'rxjs/operators';
import { IdentityModel } from '../models/identity.model';
import { HttpClientService } from './httpclient';

@Injectable()
export class AuthService {
    private _identity: IdentityModel;

    constructor(private http: HttpClientService) {
        this._identity = undefined;
    }

    public identity(): Observable<any> {
        return this.http.get('/api/identity').pipe(
            mergeMap((c: IdentityModel) => {
                this._identity = c;
                return of(this._identity);
            }),
            catchError((error: any) => throwError(error)),
        );
    }

    public getIdentity = (): IdentityModel => this._identity;

    isAuthenticated = (): boolean => this._identity !== undefined;

    logout = (): Observable<any> => this.http.get('/api/logout').pipe(last());

    login = (model: unknown): Observable<any> => this.http.post('/api/login', model);

    firstLogin = (): Observable<any> => this.http.get('/api/login');
}
