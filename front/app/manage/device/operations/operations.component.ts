import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { DeviceOperationsWarningComponent } from './operations-warning.component';
import { TaskViewComponent } from '../../taskview/taskview.component';
import { TaskViewService } from '../../services/taskview.service';

@Component({
    templateUrl: 'operations.component.html',
})
export class DeviceOperationsComponent {
    @ViewChild('modal', { read: ViewContainerRef, static: true }) modal: ViewContainerRef;

    constructor(
        private apiService: ManageApiService,
        private dynamicComponentService: DynamicComponentService,
        private taskViewService: TaskViewService,
    ) {}

    model: any;

    warningType: number;

    reboot(command: number): void {
        this.warningType = Number(command);

        if (this.warningType !== 0 && this.warningType !== 1) return;

        this.dynamicComponentService
            .createDialog(this.modal, DeviceOperationsWarningComponent, this.warningType)
            .instance.close.subscribe((result: boolean) => {
                if (!result) return;
                this.apiService.shutdown(this.warningType).subscribe().unsubscribe();

                this.taskViewService.setModel({ status: 1, type: this.warningType + 3 });
                this.dynamicComponentService.createDialog(this.modal, TaskViewComponent);

                setTimeout(() => {
                    location.href = '/';
                }, 145000);
            });
    }
}
