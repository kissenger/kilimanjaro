import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public callingPage?: string;
  private mapUpdateSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;

  constructor(
    public map: MapService,
    public data: DataService,
    public router: Router
  ) { }

  async ngOnInit() {
    await this.map.newMap(this.data.mapView.get);
    this.callingPage = this.router.url.split("/").reverse()[0]
  }

  onClick() {
    this.router.navigate(['/new']);
  }

  onDestroy() {
    this.routerSubscription?.unsubscribe();
    this.mapUpdateSubscription?.unsubscribe();
  }

}
