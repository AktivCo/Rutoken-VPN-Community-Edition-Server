import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponent } from '../../../services/dynamic-component.class';

import { DynamicComponentService } from '../../../services/dynamic-component.service';

import { SystemVpnWarningComponent } from './vpn-warning.component';

@Component({
    templateUrl: 'vpn.component.html',
})
export class SystemVpnComponent extends DynamicComponent implements OnInit {
    @ViewChild('modal', { read: ViewContainerRef, static: true }) modal: ViewContainerRef;

    constructor(private apiService: ManageApiService, private dynamicComponentService: DynamicComponentService) {
        super();
    }

    model: any;

    routing = true;

    setDns = true;

    isDns: boolean;

    disabled: boolean;

    done: boolean;

    error: string;

    routingTable: Array<any> = [];

    routingIp: string;

    routingMask: string;

    options: Record<string, unknown>;

    ngOnInit(): void {
        this.options = {
            network: ['192.168.254.0', '10.128.0.0', '172.16.254.0'],
            type: ['BF-CBC', 'AES-256-CBC'],
        };
        this.getVPNSettings().then(
            () => {},
            () => {},
        );
    }

    getVPNSettings(): Promise<void> {
        return Promise.all([this.getRouting(), this.getVpn()])
            .then((data: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                this.routingTable = data[0].routing;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                this.isDns = data[0].dns;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, prefer-destructuring
                this.model = data[1];
                if (this.routingTable.length !== 0) this.routing = false;
            })
            .catch(() => {
                this.error = 'Произошла ошибка';
            });
    }

    getRouting = (): Promise<any> => this.apiService.getVPNRouting().toPromise();

    getVpn = (): Promise<any> => this.apiService.getVPNSettings().toPromise();

    onSubmit(): void {
        this.dynamicComponentService
            .createDialog(this.modal, SystemVpnWarningComponent)
            .instance.close.pipe(
                mergeMap((result: boolean) => {
                    if (!result) return;
                    this.disabled = true;
                    if (this.routingTable.length === 0) this.routing = true;
                    // eslint-disable-next-line consistent-return
                    if (this.routing) return this.apiService.saveVPNRouting([]);

                    // eslint-disable-next-line consistent-return
                    return this.apiService.saveVPNRouting(this.routingTable.concat({ dns: this.setDns }));
                }),
                mergeMap(() => this.apiService.saveVPNSettings(this.model)),
            )
            .subscribe(
                () => {
                    this.done = true;
                    this.routingTable = [];
                    this.routingIp = '';
                    this.routingMask = '';
                    this.getVPNSettings().then(
                        () => {
                            this.disabled = false;
                            this.close.emit();
                        },
                        () => {},
                    );
                },
                () => {
                    this.error = 'Произошла ошибка';
                },
            );
    }

    addRouteToTable = (): void => {
        if (!this.routingIp || !this.routingMask) return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const routingItem = this.routingTable.find(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (c) => c.ip === this.routingIp && c.mask === this.routingMask,
        );
        if (routingItem) return;
        this.routingTable.push({ ip: this.routingIp, mask: this.routingMask });
        this.routingIp = '';
        this.routingMask = '';
        this.isDns = false;
    };

    removeRouteFromTable = (index: string): void => {
        this.routingTable.splice(Number(index), 1);
        this.routing = this.routingTable.length === 0;
        this.isDns = false;
    };
}
