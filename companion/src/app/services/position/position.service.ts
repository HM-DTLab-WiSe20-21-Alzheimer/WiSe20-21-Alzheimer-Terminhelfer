import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PositionService {

  constructor() {
  }

  canBeAsked(): Promise<boolean> {
    if (!navigator.geolocation) {
      return Promise.resolve(false);
    }

    // Safari fix
    if (!navigator.permissions) {
      const can = localStorage.getItem('asked');
      return Promise.resolve(!can);
    }

    return navigator.permissions.query({ name: 'geolocation' })
      .then(permission => permission.state === 'prompt');
  }

  askForPermission(): Promise<void> {
    return new Promise((resolve, reject) => {
      localStorage.setItem('asked', 'yes');
      navigator.geolocation.getCurrentPosition(
        () => resolve(),
        (error) => reject(error),
      );
    });
  }

  hasPermission(): Promise<boolean> {
    // Safari fix
    if (!navigator.permissions) {
      return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
        );
      });
    }

    return navigator.permissions.query({ name: 'geolocation' })
      .then(permission => permission.state === 'granted');
  }

  getCurrentPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
      );
    });
  }
}
