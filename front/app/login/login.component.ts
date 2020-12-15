import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginModel } from './login.model';

@Component({
    templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router) {}

    model: LoginModel;

    disabled: boolean;

    error: string;

    welcomeMessage: string;

    year: number;

    ngOnInit(): void {
        this.year = new Date().getFullYear();
        this.model = { login: '', password: '' };
        this.getFirstLogin();
    }

    public onSubmit = (): void => {
        this.error = null;
        this.disabled = true;
        this.authService
            .login(this.model)
            .toPromise()
            .then((data: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (data.error) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    this.error = data.message;
                    this.disabled = false;
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.router.navigateByUrl('/');
            })
            .catch((error: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (error.error) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    this.error = error.message;
                    this.disabled = false;
                }
            });
    };

    getFirstLogin(): void {
        this.authService
            .firstLogin()
            .toPromise()
            .then((data: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                this.welcomeMessage = data.error ? data.message : 'Пожалуйста, введите логин и пароль';
            })
            .catch((error: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                this.welcomeMessage = error.error ? error.message : 'Пожалуйста, введите логин и пароль';
            });
    }
}
