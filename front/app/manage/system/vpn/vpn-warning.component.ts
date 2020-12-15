import { Component } from '@angular/core';
import { DynamicComponent } from '../../../services/dynamic-component.class';

@Component({
    templateUrl: 'vpn-warning.component.html',
})
export class SystemVpnWarningComponent extends DynamicComponent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        super();
    }

    closeModal(result: boolean): void {
        this.close.emit(result);
    }
}
