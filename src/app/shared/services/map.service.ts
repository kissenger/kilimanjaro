import { TsPosition } from './../interfaces';


import * as globals from 'src/app/shared/globals';
import { HttpService } from './http.service';
import { Injectable, Pipe } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { TsCoordinate, TsFeature, TsBoundingBox, TsMapType, TsProperties } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';
// import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { DataService } from './data.service';
import { ActiveLayers } from 'src/app/shared/classes/layers';

@Injectable({
  providedIn: 'root'
})

export class MapService {

  private mapboxToken: string = environment.MAPBOX_TOKEN;
  private mapboxStyles = {
    terrain: environment.MAPBOX_STYLE_TERRAIN,
    satellite: environment.MAPBOX_STYLE_SATELLITE
  };
  public isDev = !environment.production;
  public layers = new ActiveLayers();
  private clickPosition: mapboxgl.LngLat | undefined;

  public tsMap!: mapboxgl.Map;
  private mapDefaultType: TsMapType = 'terrain';
  private padding = {
    wideScreen: {top: 50, left: 50, bottom: 50, right: 300},
    narrowScreen: {top: 10, left: 10, bottom: 10, right: 10}
  };
  private clickedFeature = null;
  private hoveredFeature = null;
  public mouseoverPopup: mapboxgl.Popup | undefined;


  constructor(
    public http: HttpService,
    public data: DataService,
  ) {
    // Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(this.mapboxToken);
  }



  newMap(startPosition?: TsCoordinate, startZoom?: number, boundingBox?: TsBoundingBox) {

    // setting the center and zoom here prevents flying animation - zoom gets over-ridden when the map bounds are set below
    return new Promise<mapboxgl.Map>( (resolve, reject) => {

      let mapCentre: TsCoordinate;
      let mapZoom: number;
      const nav = new mapboxgl.NavigationControl();

      if ( startPosition ) {
        // if location is provided, use that (zoom not needed as map will resize when path is added)
        mapCentre = startPosition;
        mapZoom = startZoom ? startZoom : globals.defaultMapView.zoom;

      } else {
        // otherwise fall back to default values
        mapCentre = globals.defaultMapView.centre;
        mapZoom = globals.defaultMapView.zoom;

      }



      if (!mapboxgl.supported()) {

        alert('Your browser does not support Mapbox GL');

      } else {

        this.tsMap = new mapboxgl.Map({
          container: 'map',
          style: this.mapboxStyles[this.mapDefaultType],
          accessToken: this.mapboxToken,
          center: mapCentre,
          zoom: mapZoom
        });
        this.tsMap.addControl(nav, 'top-left');
        this.tsMap.doubleClickZoom.disable();

        this.tsMap.on('render', (event) => {
          this.data.mapPositionEmitter.emit({
            bounds: this.getMapBounds(),
            centre: this.getMapCentre()
          });
          this.clickedFeature = null;
        });
      }

      this.tsMap.on('contextmenu', this.onRightClick);

      this.tsMap.once('load', () => {
        resolve(this.tsMap);
        this.data.mapPositionEmitter.emit({
          bounds: this.getMapBounds(),
          centre: this.getMapCentre()
        });
      });

    });

  }

  public getMapBounds() {
    const mapBounds = this.tsMap.getBounds();
    return<TsBoundingBox> [mapBounds.getSouthWest().lng, mapBounds.getSouthWest().lat, mapBounds.getNorthEast().lng, mapBounds.getNorthEast().lat];
  }

  public getMapCentre() {
    return<mapboxgl.LngLat> this.tsMap.getCenter();
  }

  public onRightClick = (e: mapboxgl.MapLayerMouseEvent | mapboxgl.MapLayerTouchEvent) => {
    const latLngString = `${Math.round(e.lngLat.lat * 1e6) / 1e6},${Math.round(e.lngLat.lng * 1e6) / 1e6}`;

    const html = `
      <div id="popup-menu">Lat,Lng: ${latLngString}</div>
      <div id="popup-menu"><a href="map/new-record"> Add viz record here </a></div>
      `;

    this.mouseoverPopup = new mapboxgl.Popup({ closeOnClick: true, closeButton: true, offset: 5})
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(this.tsMap);
  }

}
