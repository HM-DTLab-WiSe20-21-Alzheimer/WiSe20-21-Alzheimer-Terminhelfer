import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CognitoAuthenticationService } from '../../../services/authentication/cognito-authentication.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent {

  confirmForm: FormGroup;
  isLoading = false;
  error$: Observable<string | null>;

  constructor(
    private readonly authService: CognitoAuthenticationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    const username = route.snapshot.queryParams.username || '';
    const code = route.snapshot.queryParams.code || '';

    this.confirmForm = new FormGroup({
      username: new FormControl(username, [
        Validators.required,
      ]),
      code: new FormControl(code, [
        Validators.required,
      ]),
    });

    this.error$ = this.pipeError(authService.getError().asObservable());
  }

  pipeError(authError$: Observable<string | null>): Observable<string | null> {
    const errorMessages: { [key: string]: string } = {
      UserNotFoundException: 'Der Nutzer ist bereits bestätigt oder existiert nicht',
      CodeMismatchException: 'Der Bestätigung-Code ist falsch',
      unknown: 'Beim Bestätigen ist ein unbekannter Fehler aufgetreten',
    };

    return authError$
      .pipe(map(error => {
        if (!error) {
          return null;
        }
        return errorMessages[error] ?? errorMessages.unknown;
      }));
  }

  confirm(event: Event): any {
    event.preventDefault();

    if (this.confirmForm.invalid) {
      return;
    }

    this.isLoading = true;

    const username = this.confirmForm.get('username')?.value;
    const code = this.confirmForm.get('code')?.value;

    return this.authService.confirm(username, code)
      .then(() => this.router.navigateByUrl('/user/login'))
      .finally(() => this.isLoading = false);
  }

}
