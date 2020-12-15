import { Component, OnInit } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponent } from '../../../services/dynamic-component.class';

@Component({
    templateUrl: 'users-create.component.html',
})
export class UsersCreateComponent extends DynamicComponent implements OnInit {
    constructor(private apiService: ManageApiService) {
        super();
    }

    model: any;

    done: boolean;

    error: string;

    ngOnInit(): void {
        this.model = { name: '', password: '', fullname: '' };
    }

    closeModal(): void {
        this.close.emit();
    }

    onSubmit(): void {
        this.apiService
            .saveUser(this.model)
            .toPromise()
            .then(() => this.closeModal())
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
            .catch(() => { this.error = `Произошла ошибка добавления пользователя ${this.model.name}.`; });
    }
}
