import { HttpService } from '../../shared/services/http.service';
import { TsBoundingBox, TsFeature } from 'src/app/shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  public isNewPoly = false;
  public isDrawingComplete:boolean = false;
  // private tsMap: mapboxgl.Map;
  private bounds: TsBoundingBox | undefined;
  private httpSubscription: Subscription | undefined;
  private mapUpdateSubscription: Subscription | undefined;

  constructor(
    public map: MapService,
    public http: HttpService,
    public data: DataService
  ) { }

  async ngOnInit() {

    this.mapUpdateSubscription = this.data.mapPositionEmitter.subscribe( async (bounds: TsBoundingBox) => {
      this.bounds = bounds;
    })

    await this.map.newMap();


  }
}
