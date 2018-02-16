import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BASE_API = 'http://steepshot.org/api/steemia/v1_1/';
const FEED = BASE_API + 'recent';
const HOT = BASE_API + 'posts/hot';
const NEW = BASE_API + 'posts/new';
const TOP = BASE_API + 'posts/top';


@Injectable()
export class SteemiaProvider {

  constructor(public http: HttpClient) {
    
  }

  public get_feed(query) {
    return this.http.get(FEED + this.encodeQueryData(query))
        .share()
  }

  /**
   * @method encodeQueryData: add parameters to an url
   * @param {Object} parameters: parameters to add to url
   * @returns url with the parameters added
   */
  private encodeQueryData(parameters: any) {
    let ret = [];
    for (let d in parameters)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(parameters[d]));
    return ret.join('&');
  }

}
