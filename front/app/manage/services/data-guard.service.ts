import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TaskViewService } from './taskview.service';
import { ManageApiService } from './manage-api.service';

@Injectable()
export class DataGuardService implements CanActivate {
    constructor(private router: Router, private taskViewService: TaskViewService, private apiService: ManageApiService) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const problems = new Array<any>();

        const p1 = this.apiService.getNetworkSettings().toPromise();
        const p2 = this.apiService.getCASettings().toPromise();
        const p3 = this.apiService.getVPNSettings().toPromise();

        return this.apiService
            .getInitStatus()
            .toPromise()
            .then((result: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (result.status > 0) {
                    problems.push(0);
                }
                return Promise.all([p1, p2, p3]);
            })
            .then((result: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                for (let i = 0; i < result.length; i += 1) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (Object.keys(result[i]).length === 0) {
                        problems.push(i + 1);
                    }
                }
                return this.apiService.checkTime();
            })
            .then((time: any) => {
                if (!time) problems.push(4);
                return Promise.resolve();
            })
            .then(
                () => {
                    if (problems.length === 0) return true;

                    this.taskViewService.insertedData = problems;
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    this.router.navigate(['manage', 'init']);
                    return false;
                },
                () => false,
            );
    }
}
