import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Route } from '../../models/route/Route';
import { TransportMode } from '../../models/route/TransportMode';
import { HereRoute } from '../../models/route/HereRoute';
import { Appointment } from '../../models/appointment/Appointment';
import H from '../../../H';
import { PositionService } from '../position/position.service';

@Injectable({
  providedIn: 'root',
})
export class HereMapService {

  private readonly platform: H.service.Platform;

  constructor(private readonly position: PositionService) {
    this.platform = new H.service.Platform({ apikey: environment.hereKey });
  }

  getRoute(appointment: Appointment): Promise<Route> {

    const isPublicTransport = appointment.getTransportMode() === TransportMode.PUBLIC_TRANSPORT;

    if (isPublicTransport) {
      const ptService = this.platform.getPublicTransitService();

      return this.position.getCurrentPosition()
        .then(position => this.buildParamsPublicTransport(position, appointment))
        .then(routingParameters => {
          return new Promise((res, rej) => ptService.getRoutes(routingParameters, res, rej));
        })
        .then((res: any) => new HereRoute(res.routes, this.platform));
    }

    const router = this.platform.getRoutingService(undefined, 8);

    return this.position.getCurrentPosition()
      .then(position => this.buildParams(position, appointment))
      .then(routingParameters => {
        return new Promise((res, rej) => router.calculateRoute(routingParameters, res, rej));
      })
      .then((res: any) => new HereRoute(res.routes, this.platform));
  }

  private buildParamsPublicTransport(position: Position, appointment: Appointment): { [key: string]: string } {
    return {
      origin: `${position.coords.latitude},${position.coords.longitude}`,
      destination: appointment.getDestination().getCoordinates() as string,
      return: 'polyline,travelSummary',
    };
  }

  private buildParams(position: Position, appointment: Appointment): { [key: string]: string } {
    return {
      origin: `${position.coords.latitude},${position.coords.longitude}`,
      destination: appointment.getDestination().getCoordinates() as string,
      transportMode: this.getTransportMode(appointment.getTransportMode()),
      routingMode: 'fast',
      return: 'polyline,summary',
    };
  }

  private getTransportMode(mode: TransportMode): string {
    switch (mode) {
      case TransportMode.BICYCLE:
        return 'bicycle';
      case TransportMode.WALK:
        return 'pedestrian';
      case TransportMode.CAR:
      default:
        return 'car';
    }
  }
}
