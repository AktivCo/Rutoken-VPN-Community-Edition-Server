import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PluginComponent } from './plugin/plugin.component';
import { DownloadClientComponent } from './download-client/download-client.component';
import { DataDefinitionsService } from '../services/data-definitions.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forChild({
            loader: { provide: TranslateLoader, useClass: DataDefinitionsService },
        }),
    ],
    declarations: [HeaderComponent, FooterComponent, PluginComponent, DownloadClientComponent],
    exports: [HeaderComponent, FooterComponent],
    entryComponents: [PluginComponent, DownloadClientComponent],
})
export class PageCommonModule {}
