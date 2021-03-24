import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
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
      .then(isAuthenticated => isAuthenticated || this.router.parseUrl('/user/login'));
  }

}
