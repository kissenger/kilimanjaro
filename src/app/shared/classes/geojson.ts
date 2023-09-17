import { TsCoordinate, TsFeature, TsProperties } from "../interfaces";

export class GeoJsonPoint {

  private _pointFeature: TsFeature;

  constructor(point: TsCoordinate, properties: TsProperties) {
    this._pointFeature = {
      type: 'Feature',
      id: undefined,
      properties: properties,
      geometry: {
        type: 'Point',
        coordinates: point
      }
    };
  }

  get feature() {
    return this._pointFeature;
  }


}
