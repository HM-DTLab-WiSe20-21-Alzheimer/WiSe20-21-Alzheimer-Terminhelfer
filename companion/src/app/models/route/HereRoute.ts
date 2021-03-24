import { Route } from './Route';
import H from './../../../H';

export class HereRoute implements Route {
  private readonly sections: any[];
  private readonly duration: number;


  constructor(route: any, private readonly platform: H.service.Platform) {
    this.sections = route?.[0]?.sections || [];
    // Reduce duration of sections into one duration
    this.duration = this.sections.reduce(
      (acc: number, curr: any) => acc + (curr.summary?.duration || curr.travelSummary?.duration || 0),
      0,
    );
  }

  drawMap(element: HTMLElement): () => void {
    const defaultLayers = this.platform.createDefaultLayers();

    const map = new H.Map(element, defaultLayers.vector.normal.map, {
      zoom: 10,
    });

    this.createMapUi(map, defaultLayers);

    this.sections.forEach((section) => {
      // Create a linestring to use as a point source for the route line
      const linestring = H.geo.LineString.fromFlexiblePolyline(
        section.polyline,
      );

      // Create a polyline to display the route:
      // @ts-ignore
      const routeLine = new H.map.Polyline(linestring, {
        style: { strokeColor: '#3C8536', lineWidth: 3 },
      });

      // Create a marker for the start point:
      const startMarker = new H.map.Marker(
        section.departure.place.location,
      );

      // Create a marker for the end point:
      const endMarker = new H.map.Marker(section.arrival.place.location);

      // Add the route polyline and the two markers to the map:
      map.addObjects([routeLine, startMarker, endMarker]);

      // Set the map's viewport to make the whole route visible:
      map.getViewModel().setLookAtData({
        // @ts-ignore
        bounds: routeLine.getBoundingBox(),
      });
    });

    return () => map.getViewPort().resize();
  }

  /**
   * Create controls for the map.
   * @param map
   * @param defaultLayers
   * @private
   */
  private createMapUi(
    map: H.Map,
    defaultLayers: H.service.DefaultLayers,
  ): void {
    H.ui.UI.createDefault(map, defaultLayers, 'de-DE');
  }

  getDuration(): number {
    return this.duration;
  }
}
