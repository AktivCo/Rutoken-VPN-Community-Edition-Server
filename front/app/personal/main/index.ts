import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { DownloadClientComponent } from '../../common/download-client/download-client.component';
import { PluginComponent } from '../../common/plugin/plugin.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientService } from '../../services/httpclient';
import { PersonalCertsDeleteComponent } from '../modals/certs-delete';
import { TokenInfoComponent } from '../modals/token-info';
import { MobileInfoComponent } from '../modals/mobile-info';
import { IdentityModel } from '../../models/identity.model';

@Component({
    templateUrl: 'personal.template.html',
})
export class PersonalComponent implements OnInit {
    @ViewChild('modal', { read: ViewContainerRef, static: true }) modal: ViewContainerRef;

    constructor(
        private dynamicComponentService: DynamicComponentService,
        private router: Router,
        private authService: AuthService,
        private httpClient: HttpClientService,
    ) {}

    settings: any;

    user: IdentityModel;

    certs: Array<any>;

    done: boolean;

    // eslint-disable-next-line class-methods-use-this
    toLocaleString(num: number): string {
        const date = new Date(Number(num));

        const dateString = `${`0${date.getDate()}`.slice(-2)}/${`0${date.getMonth() + 1}`.slice(-2)}/${date.getFullYear()}`;

        return dateString;
    }

    ngOnInit(): void {
        this.certs = new Array<any>();
        this.user = this.authService.getIdentity();
        this.getSettings().then(
            () => this.getCertificates(),
            () => {},
        );
    }

    downloadClient(): void {
        this.dynamicComponentService.createDialog(
            this.modal,
            DownloadClientComponent,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            this.settings.pkiType,
        );
    }

    requestTokenCert(): void {
        if (!this.user.canGenereateCertOnToken) return;

        this.dynamicComponentService.createDialog(this.modal, TokenInfoComponent).instance.close.subscribe((result: boolean) => {
            if (!result) return;
            this.dynamicComponentService
                .createDialog(this.modal, PluginComponent, {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    pkeyType: this.settings.pkiType,
                    username: this.user.username,
                })
                .onDestroy(() => this.getCertificates());
        });
    }

    requestMobileCert(): void {
        if (!this.user.canGenereateMobileCert) return;

        this.dynamicComponentService.createDialog(this.modal, MobileInfoComponent).instance.close.subscribe((result: boolean) => {
            if (!result) return;
            const timestamp = Date.now();

            this.httpClient
                .post('/api/personal', { name: `${this.user.username}_${timestamp}_mobileClient` })
                .toPromise()
                .then(
                    () => this.getCertificates(),
                    () => {},
                );
        });
    }

    removeCert(cert: unknown): void {
        this.dynamicComponentService.createDialog(this.modal, PersonalCertsDeleteComponent, cert).onDestroy(() => this.getCertificates());
    }

    getVpnConfig(clientname: string): void {
        this.httpClient
            .get(`/api/getclientvpnconf?clientname=${clientname}`, 'response', 'text')
            .toPromise()
            .then(
                (res: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    window.location.href = res.url;
                },
                () => {},
            );
    }

    getCertificates(): void {
        this.done = false;
        this.httpClient
            .get('/api/crl')
            .toPromise()
            .then(
                (certs: any) => {
                    this.done = true;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    this.certs = certs;
                },
                () => {},
            );
    }

    getSettings(): Promise<any> {
        return this.httpClient
            .get('/api/settings')
            .toPromise()
            .then(
                (result: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    this.settings = result;
                },
                () => {},
            );
    }

    onLogout(): void {
        this.authService.logout().subscribe(() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.router.navigateByUrl('/login');
        });
    }
}
