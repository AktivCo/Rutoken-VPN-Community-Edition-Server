import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import localeRu from '@angular/common/locales/ru';
import { HttpClientService } from '../services/httpclient';
import { AuthService } from '../services/auth.service';
import { AuthGuardService } from '../services/auth-guard.service';
import { DynamicComponentService } from '../services/dynamic-component.service';

import { AppComponent } from './app.component';
import { LoginComponent } from '../login/login.component';
import { AppRoutingModule } from './app.routing';
import { DataDefinitionsService } from '../services/data-definitions.service';

registerLocaleData(localeRu, 'ru');

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken',
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: DataDefinitionsService,
            },
        }),
    ],
    declarations: [AppComponent, LoginComponent],
    providers: [AuthService, AuthGuardService, HttpClientService, DynamicComponentService],
    bootstrap: [AppComponent],
})
export class AppModule {}
