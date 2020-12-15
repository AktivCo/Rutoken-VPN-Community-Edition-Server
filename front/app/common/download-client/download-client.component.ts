import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../../services/dynamic-component.class';

@Component({
    templateUrl: 'download-client.component.html',
})
export class DownloadClientComponent extends DynamicComponent implements OnInit {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        super();
    }

    pkeyType: string;

    ngOnInit(): void {
        if (!this.data) {
            this.closeModal();
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.pkeyType = this.data;
    }

    closeModal(): void {
        this.close.emit();
    }
}
