import { HttpService } from '../../shared/services/http.service';
import { TsBoundingBox, TsFeature } from 'src/app/shared/interfaces';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-create-record',
  templateUrl: './create-record.component.html',
  styleUrls: ['./create-record.component.css']
})
export class CreateRecordComponent implements OnInit, OnDestroy {

  private httpSubscription: Subscription | undefined;
  private mapUpdateSubscription: Subscription | undefined;
  public mapPosition: {bounds: TsBoundingBox, centre: mapboxgl.LngLat} | undefined;


  constructor(
    public map: MapService,
    public http: HttpService,
    public data: DataService
  ) { }

  async ngOnInit() {

    this.mapUpdateSubscription = this.data.mapPositionEmitter.subscribe( async (mapPos) => {
      this.mapPosition = mapPos;
    })

    await this.map.newMap();


  }


  ngOnDestroy() {
    if (this.mapUpdateSubscription) { this.mapUpdateSubscription.unsubscribe(); }
  }

}
