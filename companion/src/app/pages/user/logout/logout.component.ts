import { Component } from '@angular/core';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  constructor(
    private readonly authService: CognitoAuthenticationService,
    private readonly router: Router,
    private readonly location: Location,
  ) {
  }

  logout(): Promise<boolean | void> {
    return this.authService
      .signOut()
      .then(() => this.router.navigateByUrl('/'));
  }

  abort(): void {
    this.location.back();
  }

}
