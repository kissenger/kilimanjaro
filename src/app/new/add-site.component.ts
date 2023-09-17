
import { HttpService } from '../shared/services/http.service';
import { TsCoordinate, TsFeature, TsMapView, TsSiteProps, TsSiteType, TsStatus } from 'src/app/shared/interfaces';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as globals from 'src/app/shared/globals';
import { GeoJsonPoint } from '../shared/classes/geojson';

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.css']
})
export class AddSiteComponent implements OnInit, OnDestroy {

  private routerSubscription : Subscription | undefined;
  private mapUpdateSubscription: Subscription | undefined;
  public mapView: TsMapView = this.data.mapView.get;

  // public formUnitsList = ['m', 'ft'];
  // public formMaxDate = new Date(Date.now()).toLocaleDateString('en-CA');
  // public formMinDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA');
  public formTypesList = ['wreck', 'reef'];

  // public formInputLocation: string = '';
  // public formInputViz: number | undefined;
  // public formInputDate:string = '';
  // public formInputTime: string = '';
  // public formInputComments: string = '';
  // public formInputUnits: 'm' | 'ft' = 'm';
  public formSiteName: string = '';
  public formSiteDescription: string = '';
  public formSiteType: TsSiteType | '' = '';

  public userName: string = 'noUserName';
  public userID: string = 'noUserID';

  public isSubmitPressed = false;

  constructor(
    public map: MapService,
    public http: HttpService,
    public data: DataService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.mapUpdateSubscription = this.data.mapPositionEmitter.subscribe( async (emitType) => {
      if (emitType === 'render') {
        this.mapView = this.data.mapView.get;
      }
    })
  }

  invalidSiteName() {
    return this.formSiteName.length === 0;
  }

  invalidSiteDescription() {
    return this.formSiteDescription.length === 0;
  }

  invalidSiteType() {
    return this.formSiteType.length === 0;
  }

  // showInvalidLocation() {
  //   return this.isSubmitPressed && this.formInputLocation.length === 0;
  // }

  // showInvalidVisibility() {
  //     return this.isSubmitPressed && (!!this.formInputViz ? (this.formInputViz % 0.5 !== 0 || this.formInputViz < 0) : true);
  // }

  // showInvalidDateTime() {
  //   return this.isSubmitPressed && (!Date.parse(this.formInputDate) || !this.formInputTime);
  // }

  onCancel() {
    this.router.navigate(['/feed']);
  }

  onSave() {

    if (this.invalidSiteName() || this.invalidSiteDescription() || this.invalidSiteType()) {
      this.isSubmitPressed = true;
    } else {
      document.body.style.cursor = 'wait';

      let point: TsCoordinate = [this.mapView.centre.lng, this.mapView.centre.lat];
      let status: TsStatus = {
        visibility: undefined,
        vizDate: undefined,
        userName: 'noUserName',
        userId: 'noUserId',
        comments: 'New site created'
      }
      let properties: TsSiteProps = {
        siteName: this.formSiteName,
        siteType: this.formSiteType ? this.formSiteType : 'wreck',
        // visibility: this.formInputViz ? (this.formInputUnits === 'ft' ? this.ft2m(this.formInputViz) : this.formInputViz) : 0,
        // timestamp: this.getDateString(),
        siteDescription: this.formSiteDescription,
        userName: 'noUserName',
        userId: 'noUserId',
        status: [status]
      };
      let geojson = new GeoJsonPoint(point, properties);


      this.http.saveRecord(geojson.feature).subscribe( (result) => {
        console.log(result.status);
        if (result.status === 200) {
          document.body.style.cursor = 'default';
          this.data.mapView.save = {
            centre: {lat: this.mapView.centre.lat, lng: this.mapView.centre.lng},
            zoom: globals.zoomedInZoom,
            bounds: undefined
          };
          this.router.navigate(['/feed']);
        } else {

          console.log('err')

        }
      });
    }


  }

  // ft2m(ft: number): number {
  //   return ft * 0.3048;
  // }

  // horrible date conversion
  // getDateString(): Date {
  //   let dateArray = this.formInputDate.split('-').map(n => parseInt(n));
  //   let timeArray = this.formInputTime.split(':').map(n => parseInt(n));
  //   return new Date(dateArray[0], dateArray[1], dateArray[2], timeArray[0], timeArray[1]);
  // }

  ngOnDestroy() {
    this.mapUpdateSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

}
