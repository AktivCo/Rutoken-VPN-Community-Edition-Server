import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageComponent } from './root/manage.component';
import { ManageInitComponent } from './root/manage-init.component';

import { SideMenuComponent } from './navigation/sidemenu.component';
// users
import { UsersComponent } from './users/users.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersCertsComponent } from './users/users-certs/users-certs.component';
import { UsersADComponent } from './users/users-ad/users-ad.component';
import { UsersConnectedComponent } from './users/users-connected/users-connected.component';
// system
import { SystemComponent } from './system/system.component';
import { SystemNetworkComponent } from './system/network/network.component';
import { SystemCAComponent } from './system/ca/ca.component';
import { SystemVpnComponent } from './system/vpn/vpn.component';
import { SystemVpnCertComponent } from './system/vpncert/vpn-cert.component';
import { SystemAdComponent } from './system/ad/ad.component';

// device
import { DeviceComponent } from './device/device.component';

import { DeviceTimeComponent } from './device/time/time.component';
import { DeviceAdmPwdComponent } from './device/admpwd/admpwd.component';
import { DeviceOperationsComponent } from './device/operations/operations.component';

import { DeviceLogsComponent } from './device/logs/logs.component';

import { ROUTING_DEFINITION } from './routing.const';
import { DataGuardService } from './services/data-guard.service';

export const routeDefinition: Routes = [
    {
        path: '',
        component: ManageComponent,
        canActivate: [DataGuardService],
        children: [
            { path: '', component: SideMenuComponent, outlet: 'sidemenu' },
            { path: '', redirectTo: ROUTING_DEFINITION.CHILDS.USERS.ROUTE_LINK, pathMatch: 'full' },

            {
                path: ROUTING_DEFINITION.CHILDS.USERS.ROUTE_LINK,
                component: UsersComponent,
                children: [
                    {
                        path: '',
                        redirectTo: ROUTING_DEFINITION.CHILDS.USERS.CHILDS.LIST.ROUTE_LINK,
                        pathMatch: 'full',
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.USERS.CHILDS.LIST.ROUTE_LINK,
                        component: UsersListComponent,
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.USERS.CHILDS.CERTS.ROUTE_LINK,
                        component: UsersCertsComponent,
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.USERS.CHILDS.CONNECTED.ROUTE_LINK,
                        component: UsersConnectedComponent,
                    },
                    { path: 'ad', component: UsersADComponent },
                ],
            },
            {
                path: ROUTING_DEFINITION.CHILDS.SYSTEM.ROUTE_LINK,
                component: SystemComponent,
                children: [
                    {
                        path: '',
                        redirectTo: ROUTING_DEFINITION.CHILDS.SYSTEM.CHILDS.NETWORK.ROUTE_LINK,
                        pathMatch: 'full',
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.SYSTEM.CHILDS.NETWORK.ROUTE_LINK,
                        component: SystemNetworkComponent,
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.SYSTEM.CHILDS.CA.ROUTE_LINK,
                        component: SystemCAComponent,
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.SYSTEM.CHILDS.VPN.ROUTE_LINK,
                        component: SystemVpnComponent,
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.SYSTEM.CHILDS.AD.ROUTE_LINK,
                        component: SystemAdComponent,
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.SYSTEM.CHILDS.VPNCERT.ROUTE_LINK,
                        component: SystemVpnCertComponent,
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.SYSTEM.CHILDS.AD.ROUTE_LINK,
                        component: SystemAdComponent,
                    },
                ],
            },
            {
                path: ROUTING_DEFINITION.CHILDS.DEVICE.ROUTE_LINK,
                component: DeviceComponent,
                children: [
                    {
                        path: '',
                        redirectTo: ROUTING_DEFINITION.CHILDS.DEVICE.CHILDS.ADMPWD.ROUTE_LINK,
                        pathMatch: 'full',
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.DEVICE.CHILDS.ADMPWD.ROUTE_LINK,
                        component: DeviceAdmPwdComponent,
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.DEVICE.CHILDS.TIME.ROUTE_LINK,
                        component: DeviceTimeComponent,
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.DEVICE.CHILDS.OPERATIONS.ROUTE_LINK,
                        component: DeviceOperationsComponent,
                    },
                    {
                        path: ROUTING_DEFINITION.CHILDS.DEVICE.CHILDS.LOGS.ROUTE_LINK,
                        component: DeviceLogsComponent,
                    },
                ],
            },
        ],
    },
    { path: 'init', component: ManageInitComponent },
];
const manageRoutes = routeDefinition;

export const adminRouting = RouterModule.forChild(manageRoutes);

@NgModule({
    imports: [adminRouting],
    exports: [RouterModule],
})
export class ManageRoutingModule {}
