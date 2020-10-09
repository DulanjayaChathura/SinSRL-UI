import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from "rxjs/operators";
import {Content} from "@angular/compiler/src/render3/r3_ast";
import {pipe} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectorServiceService {

  constructor(private http: HttpClient) { }

s
  request(english, sinhala) {
    var obj = {sinSentence: sinhala, engSentence: english};
    var myJSON = JSON.stringify(obj);
    console.log(myJSON)
    return this.http.post(`http://localhost:3003/project`, myJSON, {headers: new HttpHeaders()
        .set( 'Access-Control-Request-Origin', '*')
        .set('Access-Control-Allow-Headers' , 'Content-Type')
        .set('Content-Type','application/json')
        .set('Access-Control-Allow-Methods','POST')}).

    pipe(map(response => {
      return response;
    }, error => {

    }));
  }
}
