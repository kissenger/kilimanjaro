import { EventEmitter, Injectable } from '@angular/core';
// import { EventEmitter } from 'protractor';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  public mapPositionEmitter = new EventEmitter();
  public clickedFeatureEmitter = new EventEmitter();
  public lnglatEmitter = new EventEmitter();

}
