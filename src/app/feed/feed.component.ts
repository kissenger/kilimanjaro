import { TsFeature } from 'src/app/shared/interfaces';
import { HttpService } from '../shared/services/http.service';
import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { TsBoundingBox, TsMapView } from '../shared/interfaces';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  public isNewPoly = false;
  public isDrawingComplete:boolean = false;
  private offset = 0;
  private limit = 1000;
  public listSort = '{"sort": "date", "direction" : "-1"}';
  public list: any;

  // private tsMap: mapboxgl.Map;
  private httpSubscription: Subscription | undefined;
  private mapPositionEmitter: Subscription | undefined;
  private bounds: TsBoundingBox | undefined;
  public searchText = '';

  constructor(
    public map: MapService,
    public http: HttpService,
    public data: DataService
  ) { }

  async ngOnInit() {

    this.mapPositionEmitter = this.data.mapPositionEmitter.subscribe( async (emitType) => {
      if (emitType === 'moveend') {
        this.bounds = this.data.mapView.bounds;
        this.getSitesList();
      }
    })

    await this.map.newMap();


  }

  getSitesList() {
    const sort = JSON.parse(this.listSort);
    this.httpSubscription = this.http.getSitesList(this.offset, this.limit, sort.sort, sort.direction, this.searchText, this.bounds).subscribe( result => {
      this.list = result.list;
      this.map.deletePoints();
      this.list.forEach( (item: any) => {
        this.map.addPoint(item?.geometry.coordinates, item?.id);
      })
    })
  }

  onChangeSortType() {
    this.offset = 0;
    this.list = null;
    this.getSitesList();
  }


  onSubmitTextSearch() {
    this.offset = 0;
    this.list = null;
    this.getSitesList();
  }



  ngOnDestroy() {
    this.mapPositionEmitter?.unsubscribe();
  }
}
