import { TsBoundingBox } from './../interfaces';
import { EventEmitter, Injectable } from '@angular/core';
import { TsMapView } from '../interfaces';
import * as globals from 'src/app/shared/globals';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  public mapPositionEmitter = new EventEmitter();
  public clickedFeatureEmitter = new EventEmitter();
  public lnglatEmitter = new EventEmitter();
  public mapView = {

    _zoom: globals.defaultMapView.zoom,
    _centre: globals.defaultMapView.centre,
    _bounds: globals.defaultMapView.bounds,

    set save(desiredMapView: TsMapView) {
      this._zoom = desiredMapView.zoom;
      this._centre = desiredMapView.centre;
      this._bounds = desiredMapView.bounds;
    },

    get get() {
      return {zoom: this._zoom, centre: this._centre, bounds: this._bounds};
    },

    get bounds() {
      return this._bounds;
    }
  }



}


