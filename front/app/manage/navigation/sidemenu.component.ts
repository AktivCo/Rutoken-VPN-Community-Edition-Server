import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { throwError } from 'rxjs';

import { DynamicComponentService } from '../../services/dynamic-component.service';
import { NavigationLinksComponent } from './navigation-links.component';

@Component({
    template: `
        <nav class="menu">
            <div #container></div>
        </nav>
    `,
})
export class SideMenuComponent {
    @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

    constructor(private router: Router, private dynamicComponentService: DynamicComponentService) {
        this.router.events.subscribe(
            (data: any) => {
                if (data instanceof NavigationEnd) {
                    let link = '';
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    if (data.url.includes('users')) link = 'USERS';
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    if (data.url.includes('system')) link = 'SYSTEM';
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    if (data.url.includes('device')) link = 'DEVICE';
                    if (link === '') link = 'USERS';
                    this.dynamicComponentService.createDialog(this.container, NavigationLinksComponent, link);
                }
            },
            () => throwError(new Error()),
        );
    }
}
