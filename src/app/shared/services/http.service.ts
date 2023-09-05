
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TsFeature, TsPolygonStatus } from '../interfaces';

@Injectable()

export class HttpService {

  private protocol = environment.PROTOCOL;
  private url = environment.BACKEND_URL;
  private backendURL = `${this.protocol}://${this.url}`;

  constructor(
    private http: HttpClient
    ) {

  }

  savePolygon(polygon: TsFeature) {
    return this.http.post<any>(`${this.backendURL}/save-polygon/`, polygon);
  }

  updateStatus (newStatus: any) {
    return this.http.post<any>(`${this.backendURL}/update-status/`, newStatus);
  }

  getPolygonsInBbox(bbox: Array<number>) {

    let bboxQuery: string = '?';
    bbox.forEach( (coord, index) => {
      bboxQuery += 'bbox=' + coord.toFixed(6);
      if (index !== bbox.length - 1) { bboxQuery += '&'; }
    });

    return this.http.get<any>(`${this.backendURL}/get-polygons-in-bbox/${bboxQuery}`)
  }

}
