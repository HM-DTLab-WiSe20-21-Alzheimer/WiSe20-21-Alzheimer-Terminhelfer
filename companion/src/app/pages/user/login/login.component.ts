import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  loginForm: FormGroup;
  isLoading = false;
  error$: Observable<string | null>;

  constructor(private readonly authService: CognitoAuthenticationService, private readonly router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
    });

    this.error$ = this.pipeError(authService.getError().asObservable());

    this.listenForNotConfirmed(authService.getError().asObservable());
  }

  listenForNotConfirmed(authError$: Observable<string | null>): void {
    authError$
      .pipe(
        filter(error => error === 'UserNotConfirmedException'),
      )
      .subscribe(() => {
        this.router.navigateByUrl(`/user/confirm?username=${this.loginForm.get('username')?.value}`);
      });
  }

  pipeError(authError$: Observable<string | null>): Observable<string | null> {
    const errorMessages: { [key: string]: string } = {
      UserNotFoundException: 'Nutzername oder Passwort ist falsch',
      NotAuthorizedException: 'Nutzername oder Passwort ist falsch',
      UserNotConfirmedException: 'Nutzer nicht bestätigt',
      unknown: 'Beim Anmelden ist ein unbekannter Fehler aufgetreten',
    };

    return authError$
      .pipe(map(error => {
        if (!error) {
          return null;
        }
        return errorMessages[error] ?? errorMessages.unknown;
      }));
  }

  login(event: Event): any {
    event.preventDefault();

    this.isLoading = true;

    if (this.loginForm.invalid) {
      return;
    }

    return this.authService
      .signIn(
        this.loginForm.get('username')?.value,
        this.loginForm.get('password')?.value,
      )
      .then(() => this.router.navigateByUrl('/app'))
      .finally(() => this.isLoading = false);
  }

}
