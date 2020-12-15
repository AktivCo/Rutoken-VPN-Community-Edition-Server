import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IdentityModel } from 'models/identity.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.authService
            .identity()
            .pipe(
                map(
                    (identityModel: IdentityModel) => {
                        if (identityModel !== undefined && identityModel !== null) {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            if (identityModel.username === 'RutokenVpn') {
                                if (state.url.includes('manage')) {
                                    return true;
                                }
                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                this.router.navigateByUrl('/admin');
                            } else {
                                if (state.url.includes('personal')) {
                                    return true;
                                }
                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                this.router.navigateByUrl('/personal');
                            }
                        }
                        return false;
                    },
                    catchError(() => of(false)),
                ),
            )
            .toPromise()
            .catch(() => false);
    }
}
