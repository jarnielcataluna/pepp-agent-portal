import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpManagerService } from './http-manager.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(public auth: HttpManagerService, public router: Router) { }

    canActivate(): boolean {
        if (!this.auth.isAuthenticated()) {
            console.log(this.auth.isAuthenticated());
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}
