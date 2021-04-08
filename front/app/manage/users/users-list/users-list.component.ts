import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTING_DEFINITION } from '../../routing.const';

import { ManageApiService } from '../../services/manage-api.service';
import { SettingsService } from '../../services/settings.service';

import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { UsersCreateComponent } from '../users-create/users-create.component';
import { UsersDeleteComponent } from '../users-delete/users-delete.component';
import { PluginComponent } from '../../../common/plugin/plugin.component';
import { CertTypes } from '../../../models/cert-types';
import { IdentityModel } from '../../../models/identity.model';

@Component({
    templateUrl: 'users-list.component.html',
})
export class UsersListComponent implements OnInit {
    @ViewChild('usermodal', { read: ViewContainerRef, static: true }) usermodal: ViewContainerRef;

    constructor(
        private apiService: ManageApiService,
        private router: Router,
        private dynamicComponentService: DynamicComponentService,
        private settings: SettingsService,
    ) {}

    users: Array<IdentityModel> = [];

    allUsers: Array<IdentityModel> = [];

    isDomain: boolean;

    done: boolean;

    requesting: boolean;

    pkeyType: string;

    certTypes = CertTypes;

    ngOnInit(): void {
        this.settings.get().then(
            () => this.getUsers(),
            () => {},
        );
    }

    onChange(usersType: unknown): void {
        this.filterUsers(Number(usersType));
    }

    getUsers(): void {
        this.apiService.getUsers().subscribe((users: any) => {
            this.done = true;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            this.allUsers = users;
            this.filterUsers(0);
        });
    }

    filterUsers(isDomain: number): void {
        switch (isDomain) {
            case 1:
                this.users = this.allUsers.filter((c) => !c.isDomain);
                break;
            case 2:
                this.users = this.allUsers.filter((c) => c.isDomain);
                break;
            default:
                this.users = this.allUsers;
                break;
        }
    }

    requestTokenCert(user: any): void {
        this.requesting = true;

        this.dynamicComponentService
            .createDialog(this.usermodal, PluginComponent, {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                pkeyType: this.settings.settings.pkiType,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                username: user.username,
            })
            .onDestroy(() => {
                this.requesting = false;
                this.getUsers();
            });
    }

    requestMobileCert(user: any): void {
        this.requesting = true;
        const timestamp = Date.now();

        const routeLink = `/${ROUTING_DEFINITION.ROUTE_LINK}/${ROUTING_DEFINITION.CHILDS.USERS.ROUTE_LINK}/${ROUTING_DEFINITION.CHILDS.USERS.CHILDS.CERTS.ROUTE_LINK}`;

        this.apiService
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
            .registerMobileCert({ name: `${user.username}_${timestamp}_mobileClient` })
            .toPromise()
            .then(
                () => this.router.navigateByUrl(routeLink),
                () => {},
            );
    }

    addUser(): void {
        this.dynamicComponentService.createDialog(this.usermodal, UsersCreateComponent).onDestroy(() => this.getUsers());
    }

    removeUser(user: unknown): void {
        this.dynamicComponentService.createDialog(this.usermodal, UsersDeleteComponent, user).onDestroy(() => this.getUsers());
    }

    setUserCertGeneratingAccess(user: IdentityModel, certType: CertTypes): void {
        const selIndex = this.users.findIndex((x) => x.id === user.id);
        const mod = this.users[selIndex];

        this.apiService.setUserCertGeneratingAccess(mod).subscribe((usr: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access
            const selected = this.users.findIndex((x) => x.id === usr.id);
        });
    }
}
