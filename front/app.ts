import 'reflect-metadata';
import './polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/main/app.module';

enableProdMode();
// eslint-disable-next-line @typescript-eslint/no-floating-promises
platformBrowserDynamic().bootstrapModule(AppModule);
