import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'vpn',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(translate: TranslateService) {
        translate.setDefaultLang('ru');

        translate.use('ru');
    }
}
