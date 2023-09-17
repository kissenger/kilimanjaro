import { Component, Input, OnInit } from '@angular/core';
import { TsFeature } from 'src/app/shared/interfaces';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {
  @Input() item!: TsFeature;

  constructor(
    public map: MapService,
  ) { }

  ngOnInit() {
  }

  onClick() {
    this.map.goto(this.item.geometry.coordinates);
  }

  ngOnDestroy() {
  }
}
