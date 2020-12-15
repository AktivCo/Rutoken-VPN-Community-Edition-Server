import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ManageApiService } from '../services/manage-api.service';
import { VpnCertService } from '../services/vpncert.service';

@Component({
    templateUrl: 'manage.component.html',
})
export class ManageComponent implements OnInit {
    updateinfo: any;

    vpncertinfo: any;

    username: string;

    constructor(
        private router: Router,
        private authService: AuthService,
        private apiService: ManageApiService,
        private vpncert: VpnCertService,
    ) {}

    ngOnInit(): void {
        this.username = this.authService.getIdentity().username;

        this.checkVpnCert().then(() => {}, () => {});
    }

    checkVpnCert(): Promise<any> {
        return this.vpncert.get();
    }

    onLogout(): void {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.authService.logout().subscribe(() => this.router.navigateByUrl('/login'));
    }

    onUpdateSystem(): void {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.router.navigate(['manage', 'device', 'update']);
    }

    onUpdateVpnCert(): void {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.router.navigate(['manage', 'system', 'vpncert']);
    }
}
