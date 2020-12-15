import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponent } from '../../../services/dynamic-component.class';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { SystemNetworkWarningComponent } from './network-warning.component';

@Component({
    templateUrl: 'network.component.html',
})
export class SystemNetworkComponent extends DynamicComponent implements OnInit {
    @ViewChild('modal', { read: ViewContainerRef, static: true }) modal: ViewContainerRef;

    constructor(private apiService: ManageApiService, private dynamicComponentService: DynamicComponentService) {
        super();
    }

    model: any;

    disabled: boolean;

    done: boolean;

    error: string;

    ngOnInit(): void {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.getNetworkSettings();
    }

    getNetworkSettings() {
        return this.apiService
            .getNetworkSettings()
            .toPromise()
            .then(
                (data: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    this.model = data;
                },
                () => {},
            )
            .catch(() => {
                this.error = 'Произошла ошибка';
            });
    }

    onSubmit(): void {
        this.disabled = true;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        this.model.server_dns2 = typeof this.model.server_dns2 !== 'undefined' && this.model.server_dns2 !== null
                ? // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                  this.model.server_dns2
                : '';

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.apiService.saveNetworkSettings(this.model).toPromise();

        this.done = true;

        this.dynamicComponentService
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            .createDialog(this.modal, SystemNetworkWarningComponent, this.model.server_ip)
            .instance.close.subscribe(
                () => {
                    this.getNetworkSettings().then(
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
}
