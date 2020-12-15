import { Component, OnInit } from '@angular/core';
import { TaskViewService } from '../services/taskview.service';
import { DynamicComponent } from '../../services/dynamic-component.class';

@Component({
    templateUrl: 'taskview.component.html',
})
export class TaskViewComponent extends DynamicComponent implements OnInit {
    constructor(private taskViewService: TaskViewService) {
        super();
    }

    model: any;

    ngOnInit(): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.model = this.taskViewService.model;
    }

    closeModal(): void {
        this.taskViewService
            .stop()
            .toPromise()
            .then(
                () => this.close.emit(),
                () => {},
            );
    }
}
