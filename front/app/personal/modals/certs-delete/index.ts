import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../../services/httpclient';
import { DynamicComponent } from '../../../services/dynamic-component.class';

@Component({
    templateUrl: 'template.html',
})
export class PersonalCertsDeleteComponent extends DynamicComponent implements OnInit {
    constructor(private httpClient: HttpClientService) {
        super();
    }

    model: any;

    error: string;

    ngOnInit(): void {
        if (!this.data) this.closeModal();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.model = this.data;
    }

    closeModal(): void {
        this.close.emit();
    }

    delete(): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const model: any = { certificate: this.model.cert };

        this.httpClient
            .post('/api/crl', model)
            .toPromise()
            .then(() => this.closeModal())
            .catch(() => {
                this.error = 'Произошла ошибка';
            });
    }
}
