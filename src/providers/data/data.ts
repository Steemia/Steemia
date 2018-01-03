import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

private api:string = 'https://api.steemjs.com';
public user = 'hsynterkr';

  constructor(private http: Http) {
    console.log('Hello DataProvider Provider');

  }


  getFeed(count){
     return this.http.get(this.api+'/get_discussions_by_feed?query=%7B%22tag%22%3A%22'+this.user+'%22%2C%20%22limit%22%3A%20%22'+count+'%22%7D')
       .map(this.extractData)
       .do(this.logResponse)
       .catch(this.catchError)
    }

    getTrending(count){
      return this.http.get(this.api+'/get_discussions_by_trending?query=%7B%22tag%22%3A%22%22%2C%20%22limit%22%3A%20%22'+count+'%22%7D')
        .map(this.extractData)
        .do(this.logResponse);
    }
    getNew(count){
      return this.http.get(this.api+'/get_discussions_by_created?query=%7B%22tag%22%3A%22%22%2C%20%22limit%22%3A%20%22'+count+'%22%7D')
        .map(this.extractData)
        .do(this.logResponse)
        .catch(this.catchError)

    }
    getPromoted(count){
      return this.http.get(this.api+'/get_discussions_by_promoted?query=%7B%22tag%22%3A%22%22%2C%20%22limit%22%3A%20%22'+count+'%22%7D')
        .map(this.extractData)
        .do(this.logResponse)
        .catch(this.catchError)

    }
    getHot(count){
      return this.http.get(this.api+'/get_discussions_by_hot?query=%7B%22tag%22%3A%22%22%2C%20%22limit%22%3A%20%22'+count+'%22%7D')
        .map(this.extractData)
        .do(this.logResponse)
        .catch(this.catchError)

    }
    getContent(author, permalink){
      return this.http.get(this.api+'/get_content?author='+author+'&permlink='+permalink+'\n')
        .map(this.extractData)
        .do(this.logResponse)
        .catch(this.catchError)
    }


    private logResponse(res: Response){
     // console.log(res)
    }
    private extractData(res: Response){
      return res.json();
    }
    private catchError(error: Response | any){
      console.log(error);
      return Observable.throw(error.json().error || "Server Error")
    }

}
