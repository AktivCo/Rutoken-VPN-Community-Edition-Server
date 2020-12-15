import { Component, OnInit } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';

@Component({
    templateUrl: 'ad.component.html',
})
export class SystemAdComponent implements OnInit {
    constructor(private apiService: ManageApiService) {}

    model: any;

    disabled: boolean;

    done: boolean;

    error: string;

    ngOnInit(): void {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.getADSettings();
    }

    getADSettings(): Promise<any> {
        return this.apiService
            .getADSettings()
            .toPromise()
            .then(
                (data) => {
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
        this.apiService.saveADSettings(this.model).subscribe(
            () => {
                this.done = true;
                this.getADSettings().then(
                    () => {
                        this.disabled = false;
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
