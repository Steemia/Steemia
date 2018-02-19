import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query,PostsRes } from 'models/models';

const BASE_API = 'https://steepshot.org/api/steemia/v1_1/';
const STEEPSHOT_BASE = 'https://steepshot.org/api/v1/'
const FEED = BASE_API + 'recent?';
const POSTS = BASE_API + 'posts/';
const OWN_POSTS = BASE_API + 'user/';
const STEEMIT = 'https://steemit.com';

@Injectable()
export class SteemiaProvider {

  constructor(public http: HttpClient) { }

  /**
   * Method to retrieve the feed from a certain user
   * 
   * @param {Query} query: Object with data for query
   * @returns A subscriptable observable with the response
   */
  private get_feed(query: Query) {
    return this.http.get(FEED + this.encodeQueryData(query))
      .share()
  }

  /**
   * Public method to dispatch the data to the corresponding page
   * @param {Query} query: Object with data for query
   */
  public dispatch_feed(query: Query): Promise<any> {
    let que: Query = {
      username: query.username,
      limit: query.limit,
      show_nsfw: 0,
      show_low_rated: 0,
      with_body: 1
    }

    if (query.first_load == true) {
      que.offset = query.offset
    }

    return this.get_feed(que).toPromise();
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
   * Public method to dispatch the data to the corresponding page
   * @param {Query} query: Object with data for query
   */
  public dispatch_posts(query: Query): Promise<any> {
    let que: Query = {
      type: query.type,
      limit: query.limit,
      show_nsfw: 0,
      show_low_rated: 0,
      with_body: 1,
      username: query.username,
    }

    if (query.first_load == true) {
      que.offset = query.offset
    }

    if (query.category) {
      return this.get_posts(query.type, que, query.category).toPromise();
    }
    
    return this.get_posts(query.type, que).toPromise();
  }

  /**
   * Method to retrieve posts from a single user from its profile.
   * 
   * @param {Query} query: Object with data for query
   */
  private get_profile_posts(query: Query) {
    return this.http.get(OWN_POSTS + query.username + '/posts?' + this.encodeQueryData(query))
      .share()

  }

  /**
   * Public method to dispatch the data to the corresponding page
   * @param {Query} query: Object with data for query
   */
  public dispatch_profile_posts(query: Query): Promise<any> {
    let que: Query = {
      limit: query.limit,
      show_nsfw: 0,
      show_low_rated: 0,
      with_body: 1,
      username: query.username
    }

    if (query.first_load == true) {
      que.offset = query.offset
    }

    return this.get_profile_posts(que).toPromise();
  }

  /**
   * Public method to dispatch the data to the corresponding page
   * @param {Query} query: Object with data for query
   */
  public dispatch_profile_info(query: Query): Promise<any> {
    return this.http.get(STEEPSHOT_BASE + query.current_user + '/user/' + query.username + '/info?' + this.encodeQueryData({
      show_nsfw: 0,
      show_low_rated: 0
    })).share().toPromise();
  }

  /**
   * Public method to dispatch the data to the corresponding page
   * @param {Query} query: Object with data for query
   */
  public dispatch_comments(query: Query) {
    let url = STEEMIT + query.url;
    let que: Query = {
      show_nsfw: 0,
      show_low_rated: 0,
      limit: query.limit,
      username: query.current_user
    };

    if (query.first_load == true) {
      que.offset = query.offset;
    }
    return this.http.get(STEEPSHOT_BASE + 'post/' + url + '/comments?' + this.encodeQueryData(que))
            .share().toPromise();
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
