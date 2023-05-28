import {inject, Injectable} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {CanActivateFn, Router} from "@angular/router";
import {map, Observable, tap} from "rxjs";

@Injectable({providedIn: "root"})

export class PublicAuthService {

  constructor(private authService: AuthService, private router: Router) {}

  checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication()
      .pipe(
        tap(isAuthenticated => {
          if (isAuthenticated) {
            this.router.navigate(['/'])
          }
        }),
        map(isAuthenticated => !isAuthenticated)
      )
  }

  canActivate() {
    return this.checkAuthStatus()
  }

  canMatch() {
    return this.checkAuthStatus()
  }

}


export const canActivatePublicGuard: CanActivateFn = () => inject(PublicAuthService).canActivate();

export const canMatchPublicGuard: CanActivateFn = () => inject(PublicAuthService).canMatch();



