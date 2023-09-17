
import { TsCoordinate, TsLngLat } from '../interfaces';
import * as mapboxgl from 'mapbox-gl';

export class TsMarkers {

  private markers: Array<{id: string, handle: mapboxgl.Marker}> = [];

  constructor(
  ) { }


  public add(id: string, position: TsCoordinate | TsLngLat, mapContext: mapboxgl.Map) {

    // const htmlElement = document.createElement('div');
    // htmlElement.className = 'marker';
    // htmlElement.style.backgroundImage = `url(assets/images/${type}-marker.svg)`;
    // htmlElement.style.backgroundSize = 'cover';
    // htmlElement.style.width = '40px';
    // htmlElement.style.height = '80px';
    // htmlElement.style.backgroundSize = 'cover';
    // htmlElement.style.pointerEvents = 'none';

    this.markers.push({
      id,
      handle: new mapboxgl.Marker()
        .setLngLat(position)
        .addTo(mapContext)
    });

  }

  public move(id: string, position: TsCoordinate | TsLngLat) {
    const index = this.markers.findIndex(mkr => mkr.id === id);
    this.markers[index].handle.setLngLat(position);
  }

  public delete(id: string) {
    const index = this.markers.findIndex(mkr => mkr.id === id);
    if (index !== -1) {
      this.markers[index].handle.remove();
      this.markers.splice(index, 1);
    }
  }

  public deleteAll() {
    this.markers.forEach( (marker) => {
      marker.handle.remove();
    })
  }

  public exists(id: string) {
    return this.markers.findIndex(mkr => mkr.id === id) !== -1;
  }

}
