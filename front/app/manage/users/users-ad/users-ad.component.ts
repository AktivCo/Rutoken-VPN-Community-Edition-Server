import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManageApiService } from '../../services/manage-api.service';
@Component({
    templateUrl: 'users-ad.component.html',
})
export class UsersADComponent implements OnInit {
    constructor(private apiService: ManageApiService, private router: Router) {}

    users: Array<any> = [];

    imported: Array<any> = [];

    allUsers: Array<any> = [];

    usersToUpdate: Array<any> = [];

    search = '';

    importing: boolean;

    ngOnInit(): void {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.getDomainUsers();
    }

    getDomainUsers(): Promise<any> {
        return this.apiService
            .getUsers()
            .toPromise()
            .then((imported: Array<any>) => {
                this.imported = imported
                    // eslint-disable-next-line array-callback-return, consistent-return
                    .map((c: any) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        if (c.isDomain) {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                            return c;
                        }
                    })
                    .filter((n) => n !== undefined);

                return this.apiService.getDomainUsers().toPromise();
            })
            .then((users: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                if (users.length === 0) throw new Error();

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                this.allUsers = users;
                this.filterImported();
                this.searchInputChanged();
            })
            .catch(() => this.router.navigate(['manage', 'system', 'ad']));
    }

    importUser(item: any): void {
        this.importing = true;

        this.apiService
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            .saveUser({ name: item.username, fullname: item.fullname, password: undefined })
            .toPromise()
            .then(
                () => {
                    this.getDomainUsers().then(
                        () => {
                            this.importing = false;
                        },
                        () => {},
                    );
                },
                () => {},
            );
    }

    filterImported() {
        this.allUsers = this.allUsers.map((c) => {
            const domainUser = {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                username: c.username,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                fullname: c.fullname,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                imported: this.imported.filter((x) => x.username === c.username.toLowerCase()).length > 0,
            };
            return domainUser;
        });
    }

    searchInputChanged() {
        const seacrhString = this.search.toLowerCase();
        if (seacrhString.length === 0) this.users = this.allUsers;

        if (this.allUsers.length > 0) {
            this.users = this.allUsers.filter(
                (c) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    c.username.indexOf(seacrhString) !== -1 || c.fullname.toLowerCase().indexOf(seacrhString) !== -1,
            );
        }
    }

    private importSelected(): void {
        this.users
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            .filter((item) => item.selected)
            .map((item: any) => this.importUser(item));
    }

    syncWithAD(): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        this.usersToUpdate = this.allUsers.filter((x) => x.imported === true);
        this.usersToUpdate = this.usersToUpdate.map((x) => ({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            newFullName: x.fullname,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            id: this.imported.find((u) => u.username === x.username.toLowerCase()).id,
        }));

        this.apiService
            .syncWithAD(this.usersToUpdate)
            .toPromise()
            .then(
                () => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    this.router.navigate(['manage', 'users', 'list']);
                },
                () => {},
            );
    }
}
