import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query, PostsRes } from 'models/models';
import {
  POSTS,
  OWN_POSTS,
  BASE_API,
  BASE_API_V1,
  STEEPSHOT_BASE,
  STEEM_API,
  FEED,
  STEEPSHOT_BASE_V1_1,
  USER_SEARCH
} from '../../constants/constants';
import { UtilProvider } from '../util/util';
import { SteemConnectProvider } from '../steemconnect/steemconnect';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/debounceTime";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

/**
 * 
 * Class with Steemia API methods
 * 
 * @author Jayser Mendez
 * @version 0.0.1
 * 
 */


@Injectable()
export class SteemiaProvider {

  private username: string = '';

  constructor(public http: HttpClient,
    public util: UtilProvider,
    private steemConnect: SteemConnectProvider) {

    this.steemConnect.status.subscribe(res => {
      if (res.status === true) {
        this.username = res.userObject.user;
      }
    });
  }

  /**
   * @method dispatch_search: Method to dispatch the search
   * @param {Observable<string>} term 
   * @param {number} limit 
   */
  public dispatch_search(term: Observable<string>, limit: number) {
    return term.debounceTime(2500)
      .switchMap((value: string) => this.get_search(value, limit));
  }

  /**
   * @method get_search: Prepare the http call for the search
   * @param {String} term: String with the search term
   * @param {Number} limit: Limit of items to return
   */
  private get_search(value: string, limit) {

    let que: Query;
    let result: any;

    // If the search is for an user
    if (value[0] === '@') {
      value = value.substr(1);

      if (this.isEmpty(value) === true) {
        return Observable.of({ error: 'value is empty' })
      }

      que = {
        show_low_rated: 0,
        show_nsfw: 0,
        query: value
      };

      // If the user is logged in, include it into the query
      if (this.isEmpty(this.username) === false) {
        que.username = this.username;
      }
      result = this.http.get(USER_SEARCH + this.util.encodeQueryData(que))
    }

    else if (this.isEmpty(value) === true) {
      return Observable.of({ error: 'value is empty' })
    }

    // Otherwise, it is a tag search
    else {
      value = value.split(' ')[0];
      value = value.replace(/[^0-9a-z]/gi, '');

      que = {
        limit: limit,
        show_nsfw: 0,
        show_low_rated: 0,
        with_body: 1
      };

      // If the user is logged in, include it into the query
      if (this.isEmpty(this.username) === false) {
        que.username = this.username;
      }
      
      result = this.http.get(POSTS + value + '/hot?' + this.util.encodeQueryData(que))
        .share()
    }

    // Return the prepared http call
    return result;

  }

  isEmpty(value) {
    return value === '' || value === ' ' || value === null || value === undefined
  }

  /**
   * Method to retrieve the feed from a certain user
   * 
   * @method get_feed
   * @param {Query} query: Object with data for query
   * @returns A subscriptable observable with the response
   */
  private get_feed(query: Query) {
    return this.http.get(FEED + this.util.encodeQueryData(query))
      .share();
  }

  /**
   * Public method to dispatch the data to the corresponding page
   * 
   * @method dispatch_feed
   * @param {Query} query: Object with data for query
   */
  public dispatch_feed(query: Query): Promise<any> {
    let que: Query = {
      username: query.username,
      limit: query.limit,
      show_nsfw: 0,
      show_low_rated: 0,
      with_body: 1
    };

    if (query.first_load == true) {
      que.offset = query.offset;
    }

    return this.get_feed(que).toPromise();
  }

  /**
   * Method to retrieve post in any category or in general. Also,
   * can be retrieved by hot, new, or top.
   * 
   * @method get_posts
   * @param {String} type: hot, new, or top 
   * @param {Query} query: Object with data for query
   * @param {String} category 
   */
  public get_posts(type: string, query: Query, category?: string) {
    // Check if a category is given
    if (category) {
      return this.http.get(POSTS + category + '/' + type + '?' + this.util.encodeQueryData(query))
        .share();
    }

    else {
      return this.http.get(POSTS + type + '?' + this.util.encodeQueryData(query))
        .share();
    }
  }

  /**
   * Public method to dispatch the data to the corresponding page
   * 
   * @method dispatch_posts
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
      que.offset = query.offset;
    }

    if (query.category) {
      return this.get_posts(query.type, que, query.category).toPromise();
    }

    return this.get_posts(query.type, que).toPromise();
  }

  /**
   * Method to retrieve posts from a single user from its profile.
   * 
   * @method get_profile_posts
   * @param {Query} query: Object with data for query
   */
  private get_profile_posts(username: string, query: Query) {
    return this.http.get(OWN_POSTS + username + '/posts?' + this.util.encodeQueryData(query))
      .share();

  }

  /**
   * Public method to dispatch profile posts
   * 
   * @method dispatch_profile_posts
   * @param {Query} query: Object with data for query
   */
  public dispatch_profile_posts(query: Query): Promise<any> {
    let que: Query = {
      limit: query.limit,
      show_nsfw: 0,
      show_low_rated: 0,
      with_body: 1,
      username: query.current_user
    }

    if (query.first_load == true) {
      que.offset = query.offset;
    }

    return this.get_profile_posts(query.username, que).toPromise();
  }

  /**
   * Public method to dispatch profile info data
   * 
   * @method dispatch_profile_info
   * @param {Query} query: Object with data for query
   */
  public dispatch_profile_info(query: Query): Promise<any> {

    if (query.current_user !== 'not logged') {
      return this.http.get(BASE_API_V1 + query.current_user + '/user/' + query.username + '/info?' + this.util.encodeQueryData({
        show_nsfw: 0,
        show_low_rated: 0
      })).share().toPromise();
    }

    else {
      return this.http.get(BASE_API + 'user/' + query.username + '/info?' + this.util.encodeQueryData({
        show_nsfw: 0,
        show_low_rated: 0
      })).share().toPromise();
    }

  }

  /**
   * Public method to dispatch comments data
   * 
   * @method dispatch_comments
   * @param {Query} query: Object with data for query
   */
  public dispatch_comments(query: Query) {
    let que: Query = {
      show_nsfw: 0,
      show_low_rated: 0,
      limit: query.limit,
      username: query.current_user
    };

    if (query.first_load == true) {
      que.offset = query.offset;
    }
    return this.http.get(BASE_API + 'post/' + query.url + '/comments?' + this.util.encodeQueryData(que)).toPromise();
  }


  /**
   * Public method to dispatch menu profile data
   * 
   * @method dispatch_menu_profile
   * @param {string} account: Username of the user
   */
  public dispatch_menu_profile(username: string): Promise<any> {
    return this.http.get(BASE_API + 'user/' + username + '/info').share().toPromise();
  }

  /**
  * Public method to dispatch votes data
  * 
  * @method dispatch_votes
  * @param {Query} query: Object with data for query
  */
  public dispatch_votes(query: Query) {
    let que: Query = {
      username: query.current_user
    };

    if (query.first_load == true) {
      que.offset = query.offset;
    }
    return this.http.get(STEEPSHOT_BASE + 'post/' + query.url + '/voters?')
      .share().toPromise();

  }

  /**
   * Public method to dispatch account data
   * 
   * @method dispatch_account
   * @param {string} account: Username of the user
   */
  public dispatch_account(account) {
    return this.http.get(STEEM_API + 'get_accounts?names[]=%5B%22' + account + '%22%5D')
      .share().toPromise();
  }

  /**
   * Public method to dispatch post single data
   * 
   * @method dispatch_post_single
   * @param {Query} query: Object with data for query
   */
  public dispatch_post_single(query: Query) {
    let url = query.url;
    let que: Query = {
      show_nsfw: 0,
      show_low_rated: 0,
      with_body: 1,
      username: this.username
    };
    return this.http.get(BASE_API + 'post/' + url + '/info?' + this.util.encodeQueryData(que))
      .share().toPromise();
  }

  /**
   * Method to dispatch comment single data
   * 
   * @method dispatch_comment_single
   * @param {String} author 
   * @param {String} permlink 
   */
  public dispatch_comment_single(author: string, permlink: string) {

    let url = permlink.split('/')[4];

    return this.http.get(STEEM_API + 'get_content?' + this.util.encodeQueryData({ author: author, permlink: url }))
      .share().toPromise();
  }

}
