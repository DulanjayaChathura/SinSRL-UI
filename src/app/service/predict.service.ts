import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PredictService {

  constructor(private http: HttpClient) {
  }

  request(sinhala) {
    var obj = {sinSentence: sinhala};
    var myJSON = JSON.stringify(obj);

    return this.http.post(`http://localhost:5000/predict`, myJSON, {
      headers: new HttpHeaders()
        .set('Access-Control-Request-Origin', '*')
        .set('Access-Control-Allow-Headers', 'Content-Type')
        .set('Content-Type', 'application/json')
        .set('Access-Control-Allow-Methods', 'POST')
    }).pipe(map(response => {
      return response;
    }, error => {

    }));
  }
}
