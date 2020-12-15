import { Injectable } from '@angular/core';
import { Observable, iif } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ManageApiService } from './manage-api.service';

@Injectable()
export class VpnCertService {
    constructor(private apiService: ManageApiService) {}

    public settings: any;

    get(force: boolean = false): Promise<any> {
        return iif(() => !this.settings || force, this.getSettings(), Promise.resolve(this.settings))
            .pipe(
                mergeMap((settings: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    this.settings = settings;
                    return Promise.resolve(settings);
                }),
            )
            .toPromise();
    }

    private getSettings(): Observable<any> {
        return this.apiService.getVpnCert();
    }
}
