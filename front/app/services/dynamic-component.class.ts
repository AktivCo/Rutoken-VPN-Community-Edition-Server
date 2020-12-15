import { EventEmitter, Injectable } from '@angular/core';

export interface IDynamicComponent {
    close: EventEmitter<any>;
    onClickedExit(T: any): void;
    hasDataChanged: boolean;
    data: any;
}

@Injectable()
export class DynamicComponent implements IDynamicComponent {
    close = new EventEmitter();

    hasDataChanged = false;

    data: any;

    onClickedExit(T: unknown): void {
        this.close.emit(T);
    }
}
