import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManageApiService } from '../../services/manage-api.service';

@Component({
    templateUrl: 'admpwd.component.html',
})
export class DeviceAdmPwdComponent implements OnInit {
    model: any;

    disabled: boolean;

    done: true;

    error: string;

    constructor(private apiService: ManageApiService, private router: Router) {}

    ngOnInit(): void {
        this.model = { password0: '', password1: '', password2: '' };
    }

    onSubmit(): void {
        this.disabled = true;
        this.error = '';
        this.apiService
            .changeAdminPassword(this.model)
            .toPromise()
            .then(() => {
                this.done = true;
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                setTimeout(() => this.router.navigateByUrl('/'), 3000);
            })
            .catch(() => {
                this.done = true;
                this.error = 'Произошла ошибка при изменениии пароля';
                this.disabled = false;
            });
    }
}
