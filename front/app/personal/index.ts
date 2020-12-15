import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PageCommonModule } from '../common';

import { PersonalRoutingModule } from './routing';

import { DynamicComponentService } from '../services/dynamic-component.service';

import { PersonalComponent } from './main';
import { PersonalCertsDeleteComponent } from './modals/certs-delete';
import { TokenInfoComponent } from './modals/token-info';
import { MobileInfoComponent } from './modals/mobile-info';
import { DataDefinitionsService } from '../services/data-definitions.service';

@NgModule({
    imports: [
        CommonModule,
        PageCommonModule,
        PersonalRoutingModule,
        TranslateModule.forChild({
            loader: { provide: TranslateLoader, useClass: DataDefinitionsService },
            extend: true,
        }),
    ],
    declarations: [PersonalComponent, PersonalCertsDeleteComponent, TokenInfoComponent, MobileInfoComponent],
    entryComponents: [PersonalCertsDeleteComponent, TokenInfoComponent, MobileInfoComponent],
    providers: [DynamicComponentService],
})
export class PersonalModule {}
