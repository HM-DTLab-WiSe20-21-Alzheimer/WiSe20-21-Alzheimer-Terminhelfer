import { Component, OnInit } from '@angular/core';
import { CognitoAuthenticationService } from '../../services/authentication/cognito-authentication.service';
import { Observable } from 'rxjs';
import { Router, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

  isOpen = false;
  isLoggedIn!: Observable<boolean>;

  constructor(private readonly authService: CognitoAuthenticationService, private readonly router: Router) {
  }


  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    // Close mobile navigation after page has changed
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe(() => this.isOpen = false);
  }

}
