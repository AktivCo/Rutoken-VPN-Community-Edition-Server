import { Component, OnInit } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponent } from '../../../services/dynamic-component.class';

@Component({
    templateUrl: 'users-certs-delete.component.html',
})
export class UsersCertsDeleteComponent extends DynamicComponent implements OnInit {
    constructor(private apiService: ManageApiService) {
        super();
    }

    model: any;

    error: string;

    ngOnInit(): void {
        if (!this.data) this.closeModal();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        this.model = this.data;
    }

    closeModal(): void {
        this.close.emit();
    }

    delete(): void {
        this.apiService
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access
            .revokeCert(this.model.cert)
            .toPromise()
            .then(() => this.closeModal())
            .catch(() => this.closeModal());
    }
}
