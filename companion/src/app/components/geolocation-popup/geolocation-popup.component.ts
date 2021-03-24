import { Component } from '@angular/core';
import { PositionService } from '../../services/position/position.service';

@Component({
  selector: 'app-geolocation-popup',
  templateUrl: './geolocation-popup.component.html',
  styleUrls: ['./geolocation-popup.component.scss'],
})
export class GeolocationPopupComponent {

  readonly states = {
    ASK: 0,
    DENIED: 1,
    ACCEPTED: 2,
    LOADING: 3,
  };

  isOpen = false;
  state = this.states.ASK;

  constructor(private readonly position: PositionService) {
    position.canBeAsked()
      .then(canOpen => this.isOpen = canOpen);
  }

  close(reload = false): void {
    this.isOpen = false;
    if (reload) {
      window.location.reload();
    }
  }

  activate(): Promise<void> {
    this.state = this.states.LOADING;

    return this.position.askForPermission()
      .then(() => {
        this.state = this.states.ACCEPTED;
      })
      .catch(error => {
        console.log(error);
        if (error.code === error.PERMISSION_DENIED) {
          this.state = this.states.DENIED;
        } else {
          this.close(true);
        }
      });
  }

}
