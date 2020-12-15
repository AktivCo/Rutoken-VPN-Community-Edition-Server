import { Component, ViewChild, ViewContainerRef, ElementRef, ComponentRef } from '@angular/core';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { SettingsService } from '../services/settings.service';
import { NavigationLinksComponent } from './navigation-links.component';
import { DownloadClientComponent } from '../../common/download-client/download-client.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'navigation',
    template: `
        <div class="shadow" #shadow></div>
        <div #downloadclientmodal></div>
        <section class="jumper">
            <nav>
                <ul class="catalogue dropdown" on-click="mouseleave()" on-mouseleave="mouseleave()">
                    <li routerLinkActive="current">
                        <a [routerLink]="['/manage/users']" on-mouseenter="mouseover('USERS')">Пользователи и сертификаты</a>
                        <div class="level" #userslevel><div #usersmenu></div></div>
                    </li>
                    <li routerLinkActive="current">
                        <a [routerLink]="['/manage/system']" on-mouseover="mouseover('SYSTEM')">Сеть и система</a>
                        <div class="level" #systemlevel><div #systemmenu></div></div>
                    </li>
                    <li routerLinkActive="current">
                        <a [routerLink]="['/manage/device']" on-mouseover="mouseover('DEVICE')">Управление устройством</a>
                        <div class="level" #devicelevel><div #devicemenu></div></div>
                    </li>
                </ul>
                <dl class="services">
                    <dt>
                        <a class="show_modal" (click)="downloadClient()">{{ 'VPN_FULLNAME' | translate }} Клиент</a>
                    </dt>
                </dl>
            </nav>
        </section>
    `,
})
export class NavigationComponent {
    // shadow on hover element
    @ViewChild('shadow', { static: false }) shadow: ElementRef;

    // navigation container elements
    @ViewChild('userslevel', { static: false }) userslevel: ElementRef;

    @ViewChild('systemlevel', { static: false }) systemlevel: ElementRef;

    @ViewChild('devicelevel', { static: false }) devicelevel: ElementRef;

    // navigation elements
    @ViewChild('usersmenu', { read: ViewContainerRef, static: false }) usersmenu: ViewContainerRef;

    @ViewChild('systemmenu', { read: ViewContainerRef, static: false }) systemmenu: ViewContainerRef;

    @ViewChild('devicemenu', { read: ViewContainerRef, static: false }) devicemenu: ViewContainerRef;

    @ViewChild('downloadclientmodal', { read: ViewContainerRef, static: false })
    downloadclientmodal: ViewContainerRef;

    menuContainer: ComponentRef<any>;

    menu: ViewContainerRef;

    level: ElementRef;

    link: string;

    created: boolean;

    constructor(private dynamicComponentService: DynamicComponentService, private settings: SettingsService) {}

    mouseover(type: string): void {
        switch (type) {
            case 'USERS':
                this.createMenu(this.usersmenu, this.userslevel, type);
                break;
            case 'SYSTEM':
                this.createMenu(this.systemmenu, this.systemlevel, type);
                break;
            case 'DEVICE':
                this.createMenu(this.devicemenu, this.devicelevel, type);
                break;
            default:
                break;
        }
    }

    mouseleave(): void {
        if (this.created) this.destroyMenu();
    }

    createMenu(container: ViewContainerRef, level: ElementRef, type: string): void {
        if (this.created && this.link === type) return;

        this.destroyMenu();

        this.link = type;
        this.created = true;
        this.level = level;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.level.nativeElement.style.display = 'block';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.shadow.nativeElement.style.display = 'block';
        this.menuContainer = this.dynamicComponentService.createDialog(container, NavigationLinksComponent, type);
        this.menuContainer.onDestroy(() => {
            this.created = false;
        });
    }

    destroyMenu(): void {
        if (!this.created) return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.level.nativeElement.style.display = 'none';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.shadow.nativeElement.style.display = 'none';
        this.link = '';
        this.menuContainer.destroy();
    }

    downloadClient(): void {
        this.settings.get().then(
            () =>
                this.dynamicComponentService.createDialog(
                    this.downloadclientmodal,
                    DownloadClientComponent,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    this.settings.settings.pkiType,
                ),
            () => {},
        );
    }
}
