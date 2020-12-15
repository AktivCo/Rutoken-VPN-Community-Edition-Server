import { Component, OnInit } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { VpnCertService } from '../../services/vpncert.service';

@Component({
    templateUrl: 'vpn-cert.component.html',
})
export class SystemVpnCertComponent implements OnInit {
    disabled: boolean;

    constructor(private apiService: ManageApiService, private vpncert: VpnCertService) {}

    vpncertinfo: any;

    ngOnInit(): void {
        this.checkVpnCert(false).then(
            () => {},
            () => {},
        );
    }

    checkVpnCert(force: boolean): Promise<void> {
        return this.vpncert.get(force).then(
            (vpncertinfo: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                this.vpncertinfo = vpncertinfo;
            },
            () => {},
        );
    }

    startUpdateCert(): void {
        this.disabled = true;
        this.apiService.updateVpnCert().subscribe(() => {
            this.disabled = false;
            this.checkVpnCert(true).then(
                () => {},
                () => {},
            );
        });
    }
}
