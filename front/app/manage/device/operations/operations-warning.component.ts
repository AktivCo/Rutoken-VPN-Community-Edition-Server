import { Component, OnInit } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponent } from '../../../services/dynamic-component.class';

@Component({
    templateUrl: 'operations-warning.component.html',
})
export class DeviceOperationsWarningComponent extends DynamicComponent implements OnInit {
    constructor(private apiService: ManageApiService) {
        super();
    }

    model: any;

    error: string;

    ngOnInit(): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.model = this.data;
    }

    closeModal(result: boolean): void {
        this.close.emit(result);
    }
}
