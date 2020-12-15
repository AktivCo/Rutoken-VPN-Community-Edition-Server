import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class HttpClientService {
    constructor(private http: HttpClient) {}

    private static handleError(error: Response): Observable<any> {
        if (error.status === 401 || error.status === 403 || error.status === 419) {
            if (error.url === null || error.url.includes('identity')) {
                location.href = '/login';
            }
        }
        if (error.status === 502 || error.status <= 0) {
            if (error.url.includes('initstatus')) {
                setTimeout(() => {
                    location.href = '/';
                }, 45000);
            }
        }

        return throwError(error);
    }

    private static extractData(res: Response | Record<string, unknown>): Response | Record<string, unknown> {
        const body: Response | Record<string, unknown> = res;
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-call
        return body || {};
    }

    private static transformBody(model: unknown): string {
        const toUrlEncoded = (objectToEncode: unknown) =>
            Object.keys(objectToEncode)
                .map((key: string | number) => `${encodeURIComponent(key)}=${encodeURIComponent(objectToEncode[key])}`)
                .join('&');

        if (model instanceof Array) return model.map(toUrlEncoded).join('&');

        return toUrlEncoded(model);
    }

    static createHeaders(headers: HttpHeaders): HttpHeaders {
        // eslint-disable-next-line no-param-reassign
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // eslint-disable-next-line no-param-reassign
        headers = headers.append('Cache-Control', 'no-cache');
        // eslint-disable-next-line no-param-reassign
        headers = headers.append('Pragma', 'no-cache');

        return headers;
    }

    get(url: string, observe = 'body', responseType = 'json'): Observable<any> {
        // eslint-disable-next-line prefer-const
        let headers = new HttpHeaders();

        headers = HttpClientService.createHeaders(headers);

        const httpOptions: Record<string, unknown> = {
            headers,
            observe,
            responseType,
        };

        return this.http.get(url, httpOptions).pipe(
            map((res: Response) => HttpClientService.extractData(res)),
            catchError((res: Response) => {
                console.log(res);
                return HttpClientService.handleError(res);
            }),
        );
    }

    post(url: string, data: unknown): Observable<any> {
        // eslint-disable-next-line prefer-const
        let headers = new HttpHeaders();

        headers = HttpClientService.createHeaders(headers);

        const body = HttpClientService.transformBody(data);

        return this.http.post(url, body, { headers }).pipe(
            map((res: Response) => HttpClientService.extractData(res)),
            catchError((res: Response) => HttpClientService.handleError(res)),
        );
    }

    postJson(url: string, data: unknown): Observable<any> {
        return this.http.post(url, data).pipe(
            map((res: Response) => HttpClientService.extractData(res)),
            catchError((res: Response) => HttpClientService.handleError(res)),
        );
    }
}
