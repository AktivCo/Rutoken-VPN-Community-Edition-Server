import { Component } from '@angular/core';
import { HttpClientService } from '../../../services/httpclient';
import { DynamicComponent } from '../../../services/dynamic-component.class';

@Component({
    templateUrl: 'template.html',
})
export class MobileInfoComponent extends DynamicComponent {
    constructor(private httpClient: HttpClientService) {
        super();
    }

    closeModal(result: boolean): void {
        this.close.emit(result);
    }
}
