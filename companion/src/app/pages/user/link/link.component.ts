import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent {

  linkForm: FormGroup;
  isLoading = false;
  error$: Observable<string | null>;

  constructor(private readonly authService: CognitoAuthenticationService, private readonly router: Router) {
    this.linkForm = new FormGroup({
      linkId: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(7),
      ]),
    });

    this.error$ = this.pipeError(authService.getError().asObservable());
  }

  pipeError(authError$: Observable<string | null>): Observable<string | null> {
    const errorMessages: { [key: string]: string } = {
      InvalidParameterException: 'Der Verbindungscode ist nicht 7 Zeichen lang',
      unknown: 'Beim Verbinden ist ein unbekannter Fehler aufgetreten',
    };

    return authError$
      .pipe(map(error => {
        if (!error) {
          return null;
        }
        return errorMessages[error] ?? errorMessages.unknown;
      }));
  }

  link(event: Event): any {
    event.preventDefault();

    if (this.linkForm.invalid) {
      return;
    }

    this.isLoading = true;

    return this.authService.link(this.linkForm.get('linkId')?.value?.toUpperCase())
      .then(() => this.router.navigateByUrl('/app'))
      .finally(() => this.isLoading = false);
  }

}
