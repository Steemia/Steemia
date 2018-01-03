import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs/Observable";
import * as feeds from '../../constants/constants';
import { Post } from '../../models/models'

@Injectable()
export class DataProvider {

  private api:string = 'https://api.steemjs.com';
  public user = 'hsynterkr';

  constructor(private http: Http) {}


  /**
   * 
   * Method to fetch feeds from steem api.
   * 
   * @param {string} feedType: Type of the feed to fetch
   * @param {number} perPage: How many items per fetch
   * @returns {Observable<Array<Post>>}
   * 
   * @author Jayser Mendez.
   */
  getData(feedType: string, perPage: number): Observable<Array<Post>> {

    if (feedType == 'by_feed') {
      return this.http.get(this.api + feeds.BY_FEED + this.user + '%22%2C%20%22limit%22%3A%20%22' + perPage + '%22%7D')
        .map(this.extractData)
        .do(this.logResponse)
        .catch(this.catchError);
    }
    else {
      return this.http.get(this.api + feedType + perPage + '%22%7D')
        .map(this.extractData)
        .do(this.logResponse)
        .catch(this.catchError);
    }
    

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
