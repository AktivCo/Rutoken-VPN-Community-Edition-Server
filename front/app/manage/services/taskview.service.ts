import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ManageApiService } from './manage-api.service';

@Injectable()
export class TaskViewService {
    constructor(private apiService: ManageApiService) {}

    insertedData: Array<any>;

    model: any;

    getTaskStatusInfo(): void {
        this.apiService
            .getInitStatus()
            .toPromise()
            .then(
                (result: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    this.model = result;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    if (result.status !== 0) {
                        setTimeout(() => {
                            this.getTaskStatusInfo();
                        }, 1000);
                    }
                },
                () => {},
            );
    }

    start(): void {
        this.getTaskStatusInfo();
    }

    stop(): Observable<any> {
        return this.apiService.setTaskToInit();
    }

    setModel(data: unknown): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        this.model = data;
    }
}
