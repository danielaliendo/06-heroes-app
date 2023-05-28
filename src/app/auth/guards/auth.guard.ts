import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({providedIn: 'root'})

class AuthGuardService {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication()
      .pipe(
        tap(isAuthenticated => {
          if (!isAuthenticated) {
            this.router.navigate(['/auth/login'])
            return
          }
        })
      )
  }

  canActivate(): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }

  canMatch(): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }

}

export const canActivateAuthGuard: CanActivateFn = () => inject(AuthGuardService).canActivate();

export const canMatchAuthGuard: CanActivateFn = () => inject(AuthGuardService).canMatch();


