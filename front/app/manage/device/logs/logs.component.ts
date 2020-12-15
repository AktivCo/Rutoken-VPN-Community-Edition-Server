import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';
import { DynamicComponent } from '../../../services/dynamic-component.class';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { DeviceLogsWarningComponent } from './logs-warning.component';

// eslint-disable-next-line no-shadow
export enum commands {
    Enable = 0,
    Disable,
    Get,
    Clear,
}

@Component({
    templateUrl: 'logs.component.html',
})
export class DeviceLogsComponent extends DynamicComponent implements OnInit {
    @ViewChild('modal', { read: ViewContainerRef, static: true }) modal: ViewContainerRef;

    constructor(private apiService: ManageApiService, private dynamicComponentService: DynamicComponentService) {
        super();
    }

    is_enabled: boolean;

    warning: boolean;

    model: any;

    level: any;

    logs_list: any = undefined;

    is_empty_logs_list: boolean;

    ngOnInit(): void {
        const today = new Date().toISOString().substring(0, 10);
        this.model = { start: today, end: today };
        this.warning = false;
        this.apiService.getLogsSettings().subscribe(
            (data: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                this.is_enabled = data.is_enabled;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                this.level = data.level;
            },
            () => {},
        );
    }

    logs(command: number): void {
        switch (command) {
            case commands.Enable: {
                this.enableLogs(true, this.level);
                // let today = new Date().toISOString().substring(0, 10);
                // this.model = {start: today, end: today};
                break;
            }
            case commands.Disable: {
                this.enableLogs();
                break;
            }
            case commands.Get: {
                // let url = '/api/logs?start='+this.model.start+'&end='+this.model.end;
                // // при нажатии кнопки в идеале запускать индикацию формирования логов, так как когда мы проверяем
                // // если с бэка прилетает сообщение об ошибке, например логов нет, или формат даты неверный,
                // // выводим ошибку, если нет, повторно открываем урл, чтобы иницировать скачивание логов
                // this.apiService.getLogs(url+'&get=false')
                // .subscribe(data =>{
                //          window.location.href = url+'&get=true';
                //     },
                //     error =>{
                //       let err = error.json();
                //       this.dynamicComponentService.createDialog(this.modal, DeviceLogsWarningComponent, err.message);
                //     });
                // break;
                // let url = '/api/logs';
                // при нажатии кнопки в идеале запускать индикацию формирования логов, так как когда мы проверяем
                // если с бэка прилетает сообщение об ошибке, например логов нет, или формат даты неверный,
                // выводим ошибку, если нет, повторно открываем урл, чтобы иницировать скачивание логов
                this.getLogs();
                break;
            }
            case commands.Clear: {
                this.clearLogs();
                break;
            }
            default: {
            }
        }
    }

    onChange(value: unknown): void {
        this.level = Number(value);
        this.warning = this.level !== 3;
    }

    enableLogs(set_to: boolean = false, level: number = 3): void {
        this.dynamicComponentService
            .createDialog(this.modal, DeviceLogsWarningComponent, 'enable')
            .instance.close.subscribe((result: boolean) => {
                if (!result) return;
                this.apiService.saveLogsSettings({ set_is_enable_to: set_to, level }).subscribe(
                    (data: any) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        this.is_enabled = data.is_enabled;
                        this.onChange(level);
                    },
                    () => {},
                );
            });
        this.logs_list = null;
        this.is_empty_logs_list = false;
    }

    clearLogs(): void {
        if (!this.is_enabled) {
            this.dynamicComponentService
                .createDialog(this.modal, DeviceLogsWarningComponent, 'clear')
                .instance.close.subscribe((result: boolean) => {
                    if (!result) return;
                    this.apiService.clearLogs({ clear: true }).subscribe(
                        () => {
                            this.logs_list = null;
                        },
                        () => {},
                    );
                });
        } else {
            this.dynamicComponentService
                .createDialog(this.modal, DeviceLogsWarningComponent, 'clear_when_enabled')
                .instance.close.subscribe((result: boolean) => {
                    if (!result) return;
                    this.apiService.saveLogsSettings({ set_is_enable_to: false, level: 3 }).subscribe(
                        (data: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                            this.is_enabled = data.is_enabled;
                            this.onChange(3);
                            this.apiService.clearLogs({ clear: true }).subscribe(
                                () => {
                                    this.logs_list = null;
                                },
                                () => {},
                            );
                        },
                        () => {},
                    );
                });
        }
    }

    getLogs(): void {
        this.apiService.getLogs().subscribe(
            (data: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (data.logs_list.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    this.logs_list = data.logs_list.sort();
                    this.is_empty_logs_list = false;
                } else {
                    this.is_empty_logs_list = true;
                }
            },
            () => {},
        );
    }
}
