import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonalComponent } from './main';

const personalRoutes: Routes = [
    {
        path: '',
        component: PersonalComponent,
    },
];

export const personalRouting = RouterModule.forChild(personalRoutes);

@NgModule({
    imports: [personalRouting, RouterModule],
    exports: [RouterModule],
})
export class PersonalRoutingModule {}
