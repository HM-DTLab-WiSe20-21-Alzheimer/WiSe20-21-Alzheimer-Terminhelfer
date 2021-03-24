import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {

  signUpForm: FormGroup;
  isLoading = false;
  error$: Observable<string | null>;

  constructor(private readonly authService: CognitoAuthenticationService, private readonly router: Router) {
    this.signUpForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      name: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    this.error$ = this.pipeError(
      authService.getError().asObservable(),
    );
  }

  pipeError(authError$: Observable<string | null>): Observable<string | null> {
    const errorMessages: { [key: string]: string } = {
      unknown: 'Beim Registrieren ist ein unbekannter Fehler aufgetreten',
    };

    return authError$
      .pipe(map(error => {
        if (!error) {
          return null;
        }
        return errorMessages[error] ?? errorMessages.unknown;
      }));
  }

  signUp(event: Event): any {
    event.preventDefault();

    if (this.signUpForm.invalid) {
      return;
    }

    this.isLoading = true;

    const username = this.signUpForm.get('username')?.value;
    const password = this.signUpForm.get('password')?.value;
    const email = this.signUpForm.get('email')?.value;
    const name = this.signUpForm.get('name')?.value;

    return this.authService.signUp(username, password, { email, name })
      .then(() => this.router.navigateByUrl(`/user/confirm?username=${username}`))
      .finally(() => this.isLoading = false);
  }
}
