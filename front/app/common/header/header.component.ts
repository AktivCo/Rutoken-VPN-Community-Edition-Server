import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'page-header',
    templateUrl: 'header.component.html',
})
export class HeaderComponent {
    @Input() username: string;

    @Input() updateinfo: any;

    @Input() vpncertinfo: any;

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onUpdateSystemEvent: EventEmitter<any> = new EventEmitter();

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onUpdateVpnCertEvent: EventEmitter<any> = new EventEmitter();

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onLogoutEvent: EventEmitter<any> = new EventEmitter();

    logoutClick = (): void => this.onLogoutEvent.emit();


    startUpdateVpnCertClick = (): void => this.onUpdateVpnCertEvent.emit();
}
