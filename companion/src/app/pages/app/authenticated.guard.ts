import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { CognitoAuthenticationService } from '../../services/authentication/cognito-authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {

  constructor(private readonly authService: CognitoAuthenticationService, private readonly router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    return this.authService.pageCheck()
      .then(isAuthenticated => {

        if (!isAuthenticated) {
          return this.router.parseUrl('/user/login');
        }

        return this.authService.getUser().getValue()?.isLinked() || this.router.parseUrl('/user/link');
      });
  }
}
