import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { mergeMap } from 'rxjs/operators';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponent } from '../../../services/dynamic-component.class';
import { DynamicComponentService } from '../../../services/dynamic-component.service';

import { SystemCAWarningComponent } from './ca-warning.component';
import { TaskViewComponent } from '../../taskview/taskview.component';
import { TaskViewService } from '../../services/taskview.service';
import { SettingsService } from '../../services/settings.service';

@Component({
    templateUrl: 'ca.component.html',
})
export class SystemCAComponent extends DynamicComponent implements OnInit {
    @ViewChild('modal', { read: ViewContainerRef, static: true }) modal: ViewContainerRef;

    constructor(
        private apiService: ManageApiService,
        private dynamicComponentService: DynamicComponentService,
        private taskViewService: TaskViewService,
        private settings: SettingsService,
    ) {
        super();
    }

    model: any;

    pkiOptions: Array<Record<string, unknown>>;

    disabled: boolean;

    done: boolean;

    error: string;

    ngOnInit(): void {
        this.settings.get().then(
            () => this.getCASettings(),
            () => {},
        );
    }

    getCASettings(): Promise<any> {
        return (
            this.apiService
                .getCASettings()
                .toPromise()
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                .then(
                    (data: unknown) => {
                        this.model = data;
                    },
                    () => {},
                )
        );
    }

    onSubmit(): void {
        this.dynamicComponentService
            .createDialog(this.modal, SystemCAWarningComponent)
            .instance.close.pipe(
                mergeMap((result: boolean) => {
                    if (!result) return;
                    this.disabled = true;

                    // eslint-disable-next-line consistent-return
                    return this.apiService.saveCASettings(this.model);
                }),
                mergeMap(() => {
                    this.taskViewService.start();
                    return this.dynamicComponentService.createDialog(this.modal, TaskViewComponent).instance.close;
                }),
            )
            .subscribe(
                () => {
                    this.done = true;

                    this.getCASettings()
                        .then(() => {
                            this.disabled = false;
                            return this.settings.get(true);
                        })
                        .then(
                            () => {
                                this.close.emit();
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
