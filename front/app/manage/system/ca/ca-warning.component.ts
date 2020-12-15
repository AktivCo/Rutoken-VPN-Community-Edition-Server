import { Component } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponent } from '../../../services/dynamic-component.class';

@Component({
    templateUrl: 'ca-warning.component.html',
})
export class SystemCAWarningComponent extends DynamicComponent {
    constructor(private apiService: ManageApiService) {
        super();
    }

    model: any;

    error: string;

    closeModal(result: boolean): void {
        this.close.emit(result);
    }
}
