import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { UsersCertsDeleteComponent } from '../users-certs-delete/users-certs-delete.component';

@Component({
    templateUrl: 'users-certs.component.html',
})
export class UsersCertsComponent implements OnInit {
    @ViewChild('usercerts', { read: ViewContainerRef, static: true }) usermodal: ViewContainerRef;

    constructor(private apiService: ManageApiService, private dynamicComponentService: DynamicComponentService) {}

    certs: Array<any> = [];

    allCerts: Array<any> = [];

    isDomain: boolean;

    done: boolean;

    search = '';

    isToken: number;

    // eslint-disable-next-line class-methods-use-this
    toLocaleString(num: number): string {
        const date = new Date(Number(num));

        const dateString = `${`0${date.getDate()}`.slice(-2)}/${`0${date.getMonth() + 1}`.slice(-2)}/${date.getFullYear()}`;

        return dateString;
    }

    ngOnInit(): void {
        this.getCertificates();
    }

    onChange(certsType: unknown): void {
        this.filterCerts(Number(certsType));
    }

    filterCerts(isToken: number): void {
        this.isToken = isToken;
        this.searchInputChanged();
    }

    getCertificates(): void {
        this.apiService.getUsersCerts().subscribe((certs: any) => {
            this.done = true;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            this.allCerts = certs;
            this.filterCerts(0);
        });
    }

    removeCert(cert: unknown): void {
        this.dynamicComponentService.createDialog(this.usermodal, UsersCertsDeleteComponent, cert).onDestroy(() => {
            this.certs = [];
            this.getCertificates();
        });
    }

    getVpnConfig(clientname: string): void {
        this.apiService
            .getClientVpnConfig(clientname)
            .toPromise()
            .then(
                (res: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    window.location.href = res.url;
                },
                () => {},
            );
    }

    searchInputChanged(): void {
        let certs = [];
        if (this.allCerts.length === 0) return;

        switch (this.isToken) {
            case 1:
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                certs = this.allCerts.filter((c) => c.type.indexOf('rutokenVpnClient') !== -1);
                break;
            case 2:
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                certs = this.allCerts.filter((c) => c.type.indexOf('mobileClient') !== -1);
                break;
            default:
                certs = this.allCerts;
                break;
        }

        certs = certs.filter((c) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            if (c.username.indexOf(this.search) > -1) return true;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            if (this.toLocaleString(c.date).indexOf(this.search) > -1) return true;

            return false;
        });

        this.certs = certs;
    }
}
