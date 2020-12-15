import { Component, OnInit } from '@angular/core';
import { ManageApiService } from '../../services/manage-api.service';

@Component({
    templateUrl: 'users-connected.component.html',
})
export class UsersConnectedComponent implements OnInit {
    constructor(private apiService: ManageApiService) {}

    connected: Array<any> = [];

    allConnected: Array<any> = [];

    done: boolean;

    search = '';

    ngOnInit(): void {
        this.getConnected();
    }

    getConnected(): void {
        this.apiService.connectedUsers().subscribe((users: Array<any>) => {
            this.done = true;
            this.allConnected = users;
            this.searchInputChanged();
        });
    }

    searchInputChanged(): void {
        if (this.search.length === 0) this.connected = this.allConnected;

        if (this.allConnected.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            this.connected = this.allConnected.filter((c: any) => c.username.indexOf(this.search) > -1);
        }
    }

    refresh(): void {
        this.getConnected();
    }
}
