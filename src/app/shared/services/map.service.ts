import { TsBoundingBox, TsCoordinate, TsFeatureCollection, TsLngLat, TsMapView } from './../interfaces';


import * as globals from 'src/app/shared/globals';
import { HttpService } from './http.service';
import { Injectable, Pipe } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
// import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { DataService } from './data.service';
import { TsMarkers } from '../classes/ts-markers';

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
  public markers = new TsMarkers();


  // private clickPosition: mapboxgl.LngLat | undefined;

  public tsMap!: mapboxgl.Map;
  // private padding = {
  //   wideScreen: {top: 50, left: 50, bottom: 50, right: 300},
  //   narrowScreen: {top: 10, left: 10, bottom: 10, right: 10}
  // };
  // private clickedFeature = null;
  // private hoveredFeature = null;
  public mouseoverPopup: mapboxgl.Popup | undefined;


  constructor(
    public http: HttpService,
    public data: DataService,
  ) {
    // Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(this.mapboxToken);
  }



  // newMap(startPosition?: TsCoordinate, startZoom?: number, boundingBox?: TsBoundingBox) {
  newMap(mapView = globals.defaultMapView) {

    // setting the center and zoom here prevents flying animation - zoom gets over-ridden when the map bounds are set below
    return new Promise<mapboxgl.Map>( (resolve, reject) => {

      const nav = new mapboxgl.NavigationControl({
        visualizePitch: false,
        showCompass: false
      });

      if (!mapboxgl.supported()) {

        alert('Your browser does not support Mapbox GL');

      } else {

        this.tsMap = new mapboxgl.Map({
          container: 'map',
          style: this.mapboxStyles['terrain'],
          accessToken: this.mapboxToken,
          center: mapView.centre,
          zoom: mapView.zoom
        });

        this.tsMap.addControl(nav, 'bottom-left');
        this.tsMap.doubleClickZoom.disable();

        this.tsMap.on('render', (event) => {

          this.data.mapView.save = this.getMapView();
          this.data.mapPositionEmitter.emit('render');
          // this.clickedFeature = null;
        });

        this.tsMap.on('moveend', (event) => {
          this.data.mapView.save = this.getMapView();
          this.data.mapPositionEmitter.emit('moveend');
          console.log(this.data.mapView.get)
        })

      }

      // this.tsMap.on('contextmenu', this.onRightClick);

      this.tsMap.once('load', () => {
        this.data.mapView.save = this.getMapView();
        this.data.mapPositionEmitter.emit('moveend');
        resolve(this.tsMap);
      });

    });

  }


  private getMapView(): TsMapView {
    return {
      zoom: this.tsMap.getZoom(),
      centre: this.tsMap.getCenter(),
      bounds: this.getMapBounds()
    }
  }

  private getMapBounds(): TsBoundingBox{
    const mapBounds = this.tsMap.getBounds();
    return [mapBounds.getSouthWest().lng, mapBounds.getSouthWest().lat, mapBounds.getNorthEast().lng, mapBounds.getNorthEast().lat];
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

  public addPoint(point: TsCoordinate, pointId: string) {
    this.markers.add(pointId, point, this.tsMap);
  }

  public deletePoints() {
    this.markers.deleteAll();
  }

  public goto(point: TsLngLat | TsCoordinate) {
    if ( 'lng' in point) {
      this.tsMap.flyTo({center: point});
    } else {
      this.tsMap.flyTo({
        center: {lng: point[0], lat: point[1]},
        zoom: globals.zoomedInZoom
      });
    }
  }
}
