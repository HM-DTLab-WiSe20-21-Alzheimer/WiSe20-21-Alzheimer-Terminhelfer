import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Route } from '../../../../../models/route/Route';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { PositionService } from '../../../../../services/position/position.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-appointment-map',
  templateUrl: './appointment-map.component.html',
  styleUrls: ['./appointment-map.component.scss'],
})
export class AppointmentMapComponent implements AfterViewInit {

  @Input() route$!: Observable<Route | null>;

  @ViewChild('map')
  mapElement: ElementRef | undefined;

  canLoad$: Observable<boolean>;

  constructor(private readonly position: PositionService) {
    this.canLoad$ = fromPromise(position.hasPermission());
  }


  ngAfterViewInit(): void {
    this.route$
      .pipe(
        delay(200),
      )
      .subscribe(route => this.drawMap(route));
  }

  private drawMap(route: Route | null): void {
    if (!route || !this.mapElement) {
      return;
    }

    route.drawMap(this.mapElement?.nativeElement);
  }
}
