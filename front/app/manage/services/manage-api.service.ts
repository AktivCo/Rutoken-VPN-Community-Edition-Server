import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../services/httpclient';

@Injectable()
export class ManageApiService {
    constructor(private httpClient: HttpClientService) {}

    // users
    public getUsers(): Observable<any> {
        return this.httpClient.get('/api/users');
    }

    public getDomainUsers(): Observable<any> {
        return this.httpClient.get('/api/listdomain');
    }

    public getUsersCerts(): Observable<any> {
        return this.httpClient.get('/api/crl');
    }

    public revokeCert(certificateCN: string): Observable<any> {
        return this.httpClient.post('/api/crl', { certificate: certificateCN });
    }

    public blockUser(model: unknown): Observable<any> {
        return this.httpClient.post('/api/blockuser', model);
    }

    public registerMobileCert(model: unknown): Observable<any> {
        return this.httpClient.post('/api/personal', model);
    }

    public getClientVpnConfig(clientname: string): Observable<any> {
        return this.httpClient.get(`/api/getclientvpnconf?clientname=${clientname}`, 'response', 'text');
    }

    public saveUser(model: unknown): Observable<any> {
        return this.httpClient.post('/api/users', model);
    }

    public removeUser(id: number): Observable<any> {
        return this.httpClient.get(`/api/users?id=${id}`);
    }

    public syncWithAD(users: unknown): Observable<any> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return this.httpClient.postJson('/api/sync', { users });
    }

    public setUserCertGeneratingAccess(model: unknown): Observable<any> {
        return this.httpClient.post('/api/cert_access', model);
    }

    // settings
    // network
    public getNetworkSettings(): Observable<any> {
        return this.httpClient.get('/api/network');
    }

    public saveNetworkSettings(model: unknown): Observable<any> {
        return this.httpClient.post('/api/network', model);
    }

    // ca
    public getCASettings(): Observable<any> {
        return this.httpClient.get('/api/pki');
    }

    public saveCASettings(model: unknown): Observable<any> {
        return this.httpClient.post('/api/pki', model);
    }

    // vpn
    public getVPNSettings(): Observable<any> {
        return this.httpClient.get('/api/vpn');
    }

    public saveVPNSettings(model: unknown): Observable<any> {
        return this.httpClient.post('/api/vpn', model);
    }

    public getVPNRouting(): Observable<any> {
        return this.httpClient.get('/api/routing');
    }

    public saveVPNRouting(model: unknown): Observable<any> {
        return this.httpClient.post('/api/routing', model);
    }

    // ad
    public getADSettings(): Observable<any> {
        return this.httpClient.get('/api/domain');
    }

    public saveADSettings(model: unknown): Observable<any> {
        return this.httpClient.post('/api/domain', model);
    }

    // device
    public changeAdminPassword(model: unknown): Observable<any> {
        return this.httpClient.post('/api/admpwd', model);
    }

    public getVpnCert(): Observable<any> {
        return this.httpClient.get('/api/certinfo');
    }

    public updateVpnCert(): Observable<any> {
        return this.httpClient.post('/api/certinfo', {});
    }


    public getInitStatus(): Observable<any> {
        return this.httpClient.get('/api/initstatus');
    }

    public setTaskToInit(): Observable<any> {
        return this.httpClient.get('/api/settaskinit');
    }

    public shutdown(action: number): Observable<any> {
        return this.httpClient.get(`/api/managebox?action=${action}`);
    }

    public connectedUsers(): Observable<any> {
        return this.httpClient.get('/api/connectedusers');
    }

    // time
    public getNtp(): Observable<any> {
        return this.httpClient.get('/api/ntp');
    }

    public saveNtp(model: unknown): Observable<any> {
        return this.httpClient.post('/api/ntp', model);
    }

    public checkTime(): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const promise = new Promise((resolve, reject) => {
            this.httpClient
                .get('/api/checktime')
                .toPromise()
                .then(
                    (result: any) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        const isCorrect = Math.abs(new Date().getTime() - result.unixtime * 1000) < 600000;
                        resolve(isCorrect);
                    },
                    () => {},
                );
        });

        return promise;
    }

    public getSettings(): Observable<any> {
        return this.httpClient.get('/api/settings');
    }

    public getLogsSettings(): Observable<any> {
        return this.httpClient.get('api/logs_enable');
    }

    public saveLogsSettings(model: unknown): Observable<any> {
        return this.httpClient.post('api/logs_enable', model);
    }

    public getLogs(): Observable<any> {
        return this.httpClient.get('/api/logs_list');
    }

    public clearLogs(model: unknown): Observable<any> {
        return this.httpClient.post('api/clear_logs', model);
    }
}
