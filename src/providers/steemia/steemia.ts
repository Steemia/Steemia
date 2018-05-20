import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query, PostsRes } from 'models/models';
import {
  STEEM_API,
  STEEMIA_POSTS,
  STEEMIA_USERS,
  STEEMIA_TAGS,
  STEEMIA_SEARCH
} from '../../constants/constants';
import { UtilProvider } from '../util/util';
import { SteemConnectProvider } from '../steemconnect/steemconnect';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/debounceTime";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/retry';
import 'rxjs/operator/shareReplay';

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
   * Method to dispatch the debounced search
   * @method dispatch_search: Method to dispatch the search
   * @param {Observable<string>} term 
   */
  public dispatch_search(term: Observable<string>, page: number) {
    return term.debounceTime(500)
      .switchMap((value: string) => this.get_search(value, page));
  }

  /**
   * Method to prepare the search operation
   * @method get_search: Prepare the http call for the search
   * @param {String} term: String with the search term
   */
  private get_search(value: string, page: number) {

    let que: Query;
    let result: any;

    // If the search is for an user
    if (value[0] === '@') {
      value = value.substr(1);

      if (this.isEmpty(value) === true) {
        return Observable.of({ error: 'value is empty' });
      }

      que = {
        search: value
      }

      // If the user is logged in, include it into the query
      if (this.isEmpty(this.username) === false) {
        que.username = this.username;
      }
      result = this.http.get(STEEMIA_SEARCH + 'users?' + this.util.encodeQueryData(que)).retry(3);
    }

    // If the search is for a tag
    else if (value[0] === '#') {
      value = value.substr(1);

      if (this.isEmpty(value) === true) {
        return Observable.of({ error: 'value is empty' });
      }

      que = {
        search: value,
        page: page
      }

      // If the user is logged in, include it into the query
      if (this.isEmpty(this.username) === false) {
        que.username = this.username;
      }
      result = this.http.get(STEEMIA_SEARCH + 'tags?' + this.util.encodeQueryData(que)).retry(3)
    }

    else if (this.isEmpty(value) === true) {
      return Observable.of({ error: 'value is empty' })
    }

    // Otherwise, it is a tag search
    else {
      value = value.split(' ')[0];
      value = value.replace(/[^0-9a-z]/gi, '');

      que = {
        search: value,
        page: page
      };

      // If the user is logged in, include it into the query
      if (this.isEmpty(this.username) === false) {
        que.username = this.username;
      }
      
      result = this.http.get(STEEMIA_SEARCH + 'posts?' + this.util.encodeQueryData(que)).retry(3)
        .share()
    }

    // Return the prepared http call
    return result;

  }

  /**
   * Helper method to determine whether a string is empty
   * @param value: String to check
   * @returns a boolean statement determining whether it is empty or not
   */
  private isEmpty(value): boolean {
    return value === '' || value === ' ' || value === null || value === undefined
  }

  /**
   * Public method to dispatch the data to the corresponding page
   * 
   * @method dispatch_feed
   * @param {Query} query: Object with data for query
   */
  public dispatch_feed(query: Query): Promise<any> {

    return this.http.get(STEEMIA_POSTS + 'feed?' + this.util.encodeQueryData(query)).retry(3)
      .share().toPromise();
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
    return this.http.get(STEEMIA_POSTS + type + '?' + this.util.encodeQueryData(query)).retry(3)
        .share();
  }

  /**
   * Public method to dispatch the data to the corresponding page
   * 
   * @method dispatch_posts
   * @param {Query} query: Object with data for query
   */
  public dispatch_posts(query: Query): Promise<any> {

    return this.get_posts(query.type, query).toPromise();
  }

  /**
   * Public method to dispatch profile posts
   * 
   * @method dispatch_profile_posts
   * @param {Query} query: Object with data for query
   */
  public dispatch_profile_posts(query: Query): Promise<any> {
    return this.http.get(STEEMIA_POSTS + 'blog?' + this.util.encodeQueryData(query)).retry(3)
      .share().toPromise()
  }

  /**
   * Public method to dispatch profile info data
   * 
   * @method dispatch_profile_info
   * @param {Query} query: Object with data for query
   */
  public dispatch_profile_info(query: Query): Promise<any> {

    return this.http.get(STEEMIA_USERS + 'info?' + this.util.encodeQueryData(query)).retry(3).toPromise();

  }

  /**
   * Public method to dispatch comments data
   * 
   * @method dispatch_comments
   * @param {Query} query: Object with data for query
   */
  public dispatch_comments(query: Query) {
    return this.http.get(STEEMIA_POSTS + 'comments?' + this.util.encodeQueryData(query)).retry(3).toPromise();
  }


  /**
   * Public method to dispatch menu profile data
   * 
   * @method dispatch_menu_profile
   * @param {string} account: Username of the user
   */
  public dispatch_menu_profile(username: string): Promise<any> {
    return this.http.get(STEEMIA_USERS + 'info?user=' + username).retry(3).share().toPromise();
  }

  /**
  * Public method to dispatch votes data
  * 
  * @method dispatch_votes
  * @param {Query} query: Object with data for query
  */
  public dispatch_votes(query: Query): Promise<any> {
    query.permlink = query.permlink.split('/')[3];
    return this.http.get(STEEMIA_POSTS + 'votes?' + this.util.encodeQueryData(query)).retry(3)
      .share().toPromise();

  }

  /**
   * Public method to dispatch account data
   * 
   * @method dispatch_account
   * @param {string} account: Username of the user
   */
  public dispatch_account(account): Promise<any> {
    return this.http.get(STEEM_API + 'get_accounts?names[]=%5B%22' + account + '%22%5D')
      .share().toPromise();
  }

  /**
   * Public method to dispatch post single data
   * 
   * @method dispatch_post_single
   * @param {Query} query: Object with data for query
   */
  public dispatch_post_single(query: Query): Promise<any> {
    query.permlink = query.permlink.split('/')[3];
    query.username = this.username;
    return this.http.get(STEEMIA_POSTS + 'info?' + this.util.encodeQueryData(query)).retry(3).share().toPromise();
  }

  /**
   * Public method to dispatch post single data
   * 
   * @method dispatch_post_single
   * @param {Query} query: Object with data for query
   */
  public dispatch_post_single_notifications(query: Query): Promise<any> {
    query.username = this.username;
    return this.http.get(STEEMIA_POSTS + 'info?' + this.util.encodeQueryData(query)).retry(3).share().toPromise();
  }

  /**
   * Method to dispatch comment single data
   * 
   * @method dispatch_comment_single
   * @param {String} author: Author of the comment
   * @param {String} permlink: Permlink of the comment
   */
  public dispatch_comment_single(author: string, permlink: string): Promise<any> {

    let url = permlink.split('/')[4]; // Split the url in order to get the desired permlink

    return this.http.get(STEEM_API + 'get_content?' + this.util.encodeQueryData({ author: author, permlink: url }))
      .retry(3).share().toPromise();
  }

  /**
   * Method to dispatch followers of an user
   * @param {String} username: Username to get followers for
   * @param {Number} limit: How many will be loaded
   * @param {String} start_following: From where it should start querying
   */
  public dispatch_followers(username: string, limit: number, start_follower?: string): Promise<any> {

     // If not pagination is indicated, start from 0 (A.K.A empty string)
    if (!start_follower) {
      start_follower = '';
    }

    return this.http.get(STEEMIA_USERS + 'followers?' + this.util.encodeQueryData({ username: username, limit: limit, start: start_follower}))
      .retry(3).toPromise();
  }

  /**
   * Method to dispatch following of an user
   * @param {String} username: Username to get following for
   * @param {Number} limit: How many will be loaded
   * @param {String} start_following: From where it should start querying
   */
  public dispatch_following(username: string, limit: number, start_following?: string): Promise<any> {

    // If not pagination is indicated, start from 0 (A.K.A empty string)
    if (!start_following) {
      start_following = '';
    }

    return this.http.get(STEEMIA_USERS + 'following?' + this.util.encodeQueryData({ username: username, limit: limit, start: start_following}))
      .retry(3).toPromise();
  }

  /**
   * Method to dispatch user stats data
   * @param {String} username: Username to get stats for
   */
  public dispatch_stats(username: string): Promise<any> {
    return this.http.get(STEEMIA_USERS + 'stats?' + this.util.encodeQueryData({user: username})).retry(3).toPromise();
  }

  /**
   * Method to see if a user is following you or vice versa.
   * @param {String} username: Your username or other user username
   * @param {String} target: Username to compare against
   */
  public is_following(username: string, target: string): Promise<any> {
    return this.http.get(STEEMIA_USERS + 'is_following?' + this.util.encodeQueryData({username: username, user: target})).retry(3).toPromise();
  }

  /**
   * Method to get voting power
   * @param {String} username: Username to get voting power
   */
  public get_voting_power(username: string): Promise<any> {
    return this.http.get(STEEMIA_USERS + 'voting_power?username=' + username).retry(3).toPromise();
  }

  /**
   * Method to get comments as tree nodes
   * @param {String} author: Author of the post 
   * @param {String} permlink: Permlink of the post
   * @param {String} username: Current user logged in 
   */
  public get_comments_tree(author: string, permlink: string, username: string): Promise<any> {
    return this.http.get(STEEMIA_POSTS + 'comments-new?author=' + author + 
                         '&permlink=' + permlink + '&username=' + username).retry(3).toPromise();
  }

  /**
   * Method to dipatch all tags (up to 1000)
   */
  public dispatch_tags(): Promise<any> {
    return this.http.get(STEEMIA_TAGS + '/all').retry(3).toPromise();
  }

}
