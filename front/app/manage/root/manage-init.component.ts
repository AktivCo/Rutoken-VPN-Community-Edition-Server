import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { TaskViewService } from '../services/taskview.service';
import { TaskViewComponent } from '../taskview/taskview.component';
import { SystemNetworkComponent } from '../system/network/network.component';
import { SystemVpnComponent } from '../system/vpn/vpn.component';
import { SystemCAComponent } from '../system/ca/ca.component';
import { DeviceTimeComponent } from '../device/time/time.component';
import { AuthService } from '../../services/auth.service';

@Component({
    template: `
        <page-header [(username)]="username" [isInDemoMode]="isInDemoMode" (onLogoutEvent)="onLogout($event)"></page-header>
        <section class="content wide">
            <div #component></div>
        </section>
        <page-footer></page-footer>
    `,
})
export class ManageInitComponent implements OnInit {
    @ViewChild('component', { read: ViewContainerRef, static: true }) component: ViewContainerRef;

    username: string;

    isInDemoMode = false;

    constructor(
        private authService: AuthService,
        private dynamicComponentService: DynamicComponentService,
        private router: Router,
        private taskViewService: TaskViewService,
    ) {}

    ngOnInit(): void {
        if (this.taskViewService.insertedData === undefined) {
            location.href = '/';
            return;
        }

        const identity = this.authService.getIdentity();
        this.username = identity.username;
        this.isInDemoMode = identity.isDemoMode;

        const tasks = this.taskViewService.insertedData;
        const obs = of(0).pipe(
            mergeMap(() => {
                // updates
                if (tasks.indexOf(0) === -1) return Promise.resolve();

                this.taskViewService.getTaskStatusInfo();

                return this.dynamicComponentService.createDialog(this.component, TaskViewComponent).instance.close;
            }),
            mergeMap(() => {
                // network
                if (tasks.indexOf(1) === -1) return Promise.resolve();

                return this.dynamicComponentService.createDialog(this.component, SystemNetworkComponent).instance.close;
            }),
            mergeMap(() => {
                // ca
                if (tasks.indexOf(2) === -1) return Promise.resolve();

                return this.dynamicComponentService.createDialog(this.component, SystemCAComponent).instance.close;
            }),
            mergeMap(() => {
                // vpn
                if (tasks.indexOf(3) === -1) return Promise.resolve();

                return this.dynamicComponentService.createDialog(this.component, SystemVpnComponent).instance.close;
            }),
            mergeMap(() => {
                // vpn
                if (tasks.indexOf(4) === -1) return Promise.resolve();

                return this.dynamicComponentService.createDialog(this.component, DeviceTimeComponent).instance.close;
            }),
        );

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        obs.subscribe(() => this.router.navigate(['manage', 'users']));
    }

    onLogout(): void {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        this.authService.logout().subscribe(() => this.router.navigateByUrl('/login'));
    }
}
