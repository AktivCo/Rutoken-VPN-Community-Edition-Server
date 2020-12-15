import { Component } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponent } from '../../../services/dynamic-component.class';

@Component({
    templateUrl: 'logs-warning.component.html',
})
export class DeviceLogsWarningComponent extends DynamicComponent {
    constructor(private apiService: ManageApiService) {
        super();
    }

    error: any;

    closeModal(result: boolean): void {
        this.close.emit(result);
    }
}
