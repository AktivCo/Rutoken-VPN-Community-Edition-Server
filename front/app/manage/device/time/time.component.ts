import { Component, OnInit } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponent } from '../../../services/dynamic-component.class';
@Component({
    templateUrl: 'time.component.html',
})
export class DeviceTimeComponent extends DynamicComponent implements OnInit {
    constructor(private apiService: ManageApiService) {
        super();
    }

    ip: string;

    type: any;

    done: boolean;

    disabled: boolean;

    ngOnInit(): void {
        this.getNtp();
    }

    onSubmit(): void {
        let data = null;

        if (this.type === 1) {
            data = this.ip;
        } else {
            const date = new Date();

            data = `${`0${date.getUTCMonth() + 1}`.slice(-2)}${`0${date.getDate()}`.slice(-2)}${`0${date.getUTCHours()}`.slice(
                -2,
            )}${`0${date.getUTCMinutes()}`.slice(-2)}${date.getUTCFullYear()}`;
        }
        this.disabled = true;
        this.apiService
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            .saveNtp({ type: this.type, data })
            .toPromise()
            .then(() => {
                this.disabled = true;
                this.done = true;
                this.close.emit();
            })
            .catch(() => {
                this.disabled = false;
                this.close.emit();
            });
    }

    getNtp(): void {
        this.done = false;
        this.apiService
            .getNtp()
            .toPromise()
            .then(
                (data: any) => {
                    this.type = 0;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, no-prototype-builtins
                    if (data.hasOwnProperty('ntp_server')) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        this.ip = data.ntp_server;
                    }
                },
                () => {},
            );
    }

    onChange(value: number): void {
        this.type = Number(value);
    }
}
