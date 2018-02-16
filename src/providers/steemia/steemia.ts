import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query } from 'models/models';

const BASE_API = 'https://steepshot.org/api/steemia/v1_1/';
const FEED = BASE_API + 'recent?';
const POSTS = BASE_API + 'posts/';
const OWN_POSTS = BASE_API + 'user/';

@Injectable()
export class SteemiaProvider {

  constructor(public http: HttpClient) {}

  /**
   * Method to retrieve the feed from a certain user
   * 
   * @param {Query} query: Object with data for query
   * @returns A subscriptable observable with the response
   */
  public get_feed(query: Query) {
    return this.http.get(FEED + this.encodeQueryData(query))
        .share()
  }

  /**
   * Method to retrieve post in any category or in general. Also,
   * can be retrieved by hot, new, or top.
   * 
   * @param {String} type: hot, new, or top 
   * @param {Query} query: Object with data for query
   * @param {String} category 
   */
  public get_posts(type: string, query: Query, category?: string) {
    // Check if a category is given
    if (category) {
      return this.http.get(POSTS + category + '/' + type + '?' + this.encodeQueryData(query))
        .share()
    }

    else {
      return this.http.get(POSTS + type + '?' + this.encodeQueryData(query))
        .share()
    }
  }

  /**
   * Method to retrieve posts from a single user from its profile.
   * 
   * @param {Query} query: Object with data for query
   */
  public get_profile_posts(query: Query) {
    return this.http.get(OWN_POSTS + query.username + '/posts?' + this.encodeQueryData(query))
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
