import { Component, OnInit } from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'page-footer',
    templateUrl: 'footer.component.html',
})
export class FooterComponent implements OnInit {
    year: number;

    ngOnInit(): void {
        this.year = new Date().getFullYear();
    }
}
