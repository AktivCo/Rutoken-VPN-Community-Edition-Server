import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { AuthGuardService } from '../services/auth-guard.service';

const appRoutes: Routes = [
    { path: '', redirectTo: 'personal', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'manage',
        loadChildren: () => import('../manage/index').then((m) => m.ManageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'personal',
        loadChildren: () => import('../personal/index').then((m) => m.PersonalModule),
        canActivate: [AuthGuardService],
    },
    { path: '**', redirectTo: 'manage', pathMatch: 'full' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            // { enableTracing: true },
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
