import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ManageComponent } from './root/manage.component';
import { SideMenuComponent } from './navigation/sidemenu.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NavigationLinksComponent } from './navigation/navigation-links.component';

// users
import { UsersComponent } from './users/users.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersCertsComponent } from './users/users-certs/users-certs.component';
import { UsersCertsDeleteComponent } from './users/users-certs-delete/users-certs-delete.component';
import { UsersADComponent } from './users/users-ad/users-ad.component';
import { UsersCreateComponent } from './users/users-create/users-create.component';
import { UsersDeleteComponent } from './users/users-delete/users-delete.component';
import { UsersConnectedComponent } from './users/users-connected/users-connected.component';

// system
import { SystemComponent } from './system/system.component';
import { SystemNetworkComponent } from './system/network/network.component';
import { SystemNetworkWarningComponent } from './system/network/network-warning.component';
import { SystemCAComponent } from './system/ca/ca.component';
import { SystemCAWarningComponent } from './system/ca/ca-warning.component';
import { SystemVpnComponent } from './system/vpn/vpn.component';
import { SystemVpnWarningComponent } from './system/vpn/vpn-warning.component';
import { SystemVpnCertComponent } from './system/vpncert/vpn-cert.component';
import { SystemAdComponent } from './system/ad/ad.component';

// device
import { DeviceComponent } from './device/device.component';
import { DeviceTimeComponent } from './device/time/time.component';
import { DeviceAdmPwdComponent } from './device/admpwd/admpwd.component';
import { DeviceOperationsComponent } from './device/operations/operations.component';
import { DeviceOperationsWarningComponent } from './device/operations/operations-warning.component';



import { DeviceLogsComponent } from './device/logs/logs.component';
import { DeviceLogsWarningComponent } from './device/logs/logs-warning.component';

import { PageCommonModule } from '../common';
import { ManageRoutingModule } from './routing';

import { DynamicComponentService } from '../services/dynamic-component.service';
import { ManageApiService } from './services/manage-api.service';
import { SettingsService } from './services/settings.service';
import { VpnCertService } from './services/vpncert.service';
import { DataGuardService } from './services/data-guard.service';
import { TaskViewService } from './services/taskview.service';
import { TaskViewComponent } from './taskview/taskview.component';

import { ManageInitComponent } from './root/manage-init.component';
import { DataDefinitionsService } from '../services/data-definitions.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PageCommonModule,
        ManageRoutingModule,
        TranslateModule.forChild({
            loader: { provide: TranslateLoader, useClass: DataDefinitionsService },
            extend: true,
        }),
    ],
    declarations: [
        ManageInitComponent,

        ManageComponent,

        // navigation
        NavigationComponent,
        SideMenuComponent,
        NavigationLinksComponent,

        UsersComponent,
        UsersListComponent,
        UsersCertsComponent,
        UsersCertsDeleteComponent,
        UsersADComponent,
        UsersCreateComponent,
        UsersDeleteComponent,
        UsersConnectedComponent,

        SystemComponent,
        SystemNetworkComponent,
        SystemNetworkWarningComponent,
        SystemCAComponent,
        SystemCAWarningComponent,
        SystemVpnComponent,
        SystemVpnWarningComponent,
        SystemVpnCertComponent,
        SystemAdComponent,

        DeviceComponent,
        DeviceTimeComponent,
        DeviceAdmPwdComponent,
        DeviceOperationsComponent,
        DeviceOperationsWarningComponent,


        DeviceLogsComponent,
        DeviceLogsWarningComponent,

        TaskViewComponent,
    ],
    providers: [DynamicComponentService, ManageApiService, DataGuardService, TaskViewService, SettingsService, VpnCertService],
    entryComponents: [
        NavigationLinksComponent,
        UsersCreateComponent,
        UsersDeleteComponent,
        UsersCertsDeleteComponent,
        SystemCAWarningComponent,
        SystemVpnWarningComponent,
        SystemNetworkWarningComponent,
        TaskViewComponent,

        DeviceOperationsWarningComponent,
        DeviceLogsWarningComponent,
        ManageInitComponent,
    ],
})
export class ManageModule {}
