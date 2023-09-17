
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TsBoundingBox, TsFeature } from '../interfaces';

@Injectable()

export class HttpService {

  private backendURL = `${environment.PROTOCOL}://${environment.BACKEND_URL}`;

  constructor(
    private http: HttpClient
    ) {
  }

  saveRecord(record: TsFeature) {
    return this.http.post<any>(`${this.backendURL}/save-record/`, record);
  }

  getSitesList(
    offset: number,
    limit: number,
    sort: 'a-z' | 'date' | 'viz',
    direction: '1' | '-1',
    searchText: string,
    bbox: TsBoundingBox
    ) {

    let query: string;
    // if (bbox.length === 0) {
    //   query = '?bbox=0';
    // } else {
      query = '?';
      bbox?.forEach( (coord, index) => {
        query += 'bbox=' + coord.toFixed(6);
        if (index !== bbox.length - 1) { query += '&'; }
      });
    // }

    searchText = searchText ? searchText : ' ';
    console.log(`${this.backendURL}/get-sites/${offset}/${limit}/${sort}/${direction}/${searchText}${query}`);

    return this.http
      .get<any>(`${this.backendURL}/get-sites/${offset}/${limit}/${sort}/${direction}/${searchText}${query}`)
  }


}
