import { Component } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CognitoAuthenticationService } from './services/authentication/cognito-authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  isLoading = false;

  constructor(private readonly authService: CognitoAuthenticationService, private readonly router: Router) {
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationStart))
      .subscribe(() => this.authService.pageCheck());

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }

      if (event instanceof NavigationEnd) {
        this.isLoading = false;
      }
    });
  }
}
