import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../../services/dynamic-component.class';
import { ROUTING_DEFINITION } from '../routing.const';

@Component({
    template: `
        <ul>
            <li *ngFor="let item of links" routerLinkActive="current">
                <a [routerLink]="[item.routeLink]"
                    ><span>{{ item.routeLinkName }}</span></a
                >
            </li>
        </ul>
    `,
})
export class NavigationLinksComponent extends DynamicComponent implements OnInit {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        super();
    }

    links: Array<any>;

    ngOnInit(): void {
        this.links = new Array<any>();

        // eslint-disable-next-line no-restricted-syntax
        for (const item in ROUTING_DEFINITION.CHILDS) {
            if (this.data === item) {
                // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unsafe-member-access
                for (const child in ROUTING_DEFINITION.CHILDS[item].CHILDS) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (Object.prototype.hasOwnProperty.call(ROUTING_DEFINITION.CHILDS[item].CHILDS, child)) {
                        this.links.push({
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
                            routeLink: `/${ROUTING_DEFINITION.ROUTE_LINK}/${ROUTING_DEFINITION.CHILDS[item].ROUTE_LINK}/${ROUTING_DEFINITION.CHILDS[item].CHILDS[child].ROUTE_LINK}`,
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                            routeLinkName: ROUTING_DEFINITION.CHILDS[item].CHILDS[child].ROUTE_LINK_NAME,
                        });
                    }
                }
            }
        }
    }
}
