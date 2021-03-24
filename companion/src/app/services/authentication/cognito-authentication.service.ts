import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../../models/User';
import { Auth } from '@aws-amplify/auth';
import { CognitoUser } from '../../models/CognitoUser';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CognitoAuthenticationService {

  private readonly user = new BehaviorSubject<User | null>(null);
  private readonly error = new Subject<string | null>();

  constructor() {
  }

  getUser(): BehaviorSubject<User | null> {
    return this.user;
  }

  getError(): Subject<string | null> {
    return this.error;
  }

  isLoggedIn(): Observable<boolean> {
    return this.user.pipe(map(user => !!user));
  }

  pageCheck(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.user.getValue()) {
        return resolve(true);
      }

      Auth.currentUserInfo()
        .then((user) => CognitoUser.fromResult(user))
        .then((user) => {
          if (user !== null) {
            this.user.next(user);
            this.error.next(null);
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          this.error.next(error.message);
          reject(error);
        });
    });
  }

  signIn(username: string, password: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      Auth.signIn(username, password)
        .then((user) => CognitoUser.fromResult(user))
        .then((user) => {
          this.user.next(user);
          this.error.next(null);
          resolve(user);
        })
        .catch((error) => {
          this.error.next(error.name);
          reject(error);
        });
    });
  }

  signUp(
    username: string,
    password: string,
    attributes: any,
  ): Promise<User | null> {
    return new Promise((resolve, reject) => {
      Auth.signUp({ username, password, attributes })
        .then((result) => result.user)
        // Just for typescript
        .then(() => Auth.currentUserInfo())
        .then((user) => CognitoUser.fromResult(user))
        .then((user) => {
          this.user.next(null);
          this.error.next(null);
          resolve(user);
        })
        .catch((error) => {
          this.error.next(error.message);
          reject(error);
        });
    });
  }

  signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      Auth.signOut()
        .then(() => {
          this.user.next(null);
          this.error.next(null);
          resolve();
        })
        .catch((error) => {
          this.error.next(error);
          reject(error);
        });
    });
  }

  confirm(username: string, code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Auth.confirmSignUp(username, code)
        .then(() => {
          this.error.next(null);
          resolve();
        })
        .catch((error) => {
          this.error.next(error);
          reject(error);
        });
    });
  }

  link(linkId: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then((user) =>
          Auth.updateUserAttributes(user, {
            'custom:linkid': linkId.toUpperCase(),
          }),
        )
        .then(() => Auth.currentUserInfo())
        .then((user) => CognitoUser.fromResult(user))
        .then((user) => {
          this.user.next(user);
          this.error.next(null);
          resolve(user);
        })
        .catch((error) => {
          this.error.next(error.name);
          reject(error);
        });
    });
  }

}
