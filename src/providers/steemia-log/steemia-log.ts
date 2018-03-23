import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_API_V1 } from '../../constants/constants';
import { SteemConnectProvider } from '../steemconnect/steemconnect';
import { Http } from '@angular/http/src/http';

/**
 * Class with loggers to server side
 * 
 * @author Jayser Mendez
 * @version 0.0.1
 */

@Injectable()
export class SteemiaLogProvider {

  private username: string = '';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'cache-control': 'no-cache'
    })
  };

  constructor(public http: HttpClient,
  private steemConnect: SteemConnectProvider) {}

  /**
   * Metehod to log a new comment to server side
   * @method log_vote
   * @param {String} author 
   * @param {String} permlink
   * @returns returns a promise
   */
  public log_comment(author, permlink): Promise<any> {
    return this.http.post(BASE_API_V1 + 'log/post/' + this.makePostId(author, permlink) + '/comment', this.get_data(), this.httpOptions)
      .toPromise();
  }

  /**
   * Method to log a new post to server side
   * @method log_post
   * @returns Returns a promise
   */
  public log_post(): Promise<any> {

    return this.http.post(BASE_API_V1 + 'log/post', this.get_data(), this.httpOptions).toPromise();

  }

  /**
   * Metehod to log a new vote to server side
   * @method log_vote
   * @param {String} author 
   * @param {String} permlink
   * @param {String} type
   * @returns returns a promise
   */
  public log_vote(author: string, permlink: string) {
    return this.http.post(BASE_API_V1 + 'log/post/' + this.makePostId(author, permlink) + '/upvote', this.get_data(), this.httpOptions)
      .toPromise();

  }

  /**
   * Metehod to log a new unvote to server side
   * @method log_unvote
   * @param {String} author 
   * @param {String} permlink 
   * @param {String} type
   * @returns returns a promise
   */
  public log_unvote(author: string, permlink: string, type?: string) {

    return this.http.post(BASE_API_V1 + 'log/post/' + this.makePostId(author, permlink) + '/downvote', this.get_data(), this.httpOptions)
      .toPromise();

  }

  /**
   * Metehod to log a new flag to server side
   * @method log_unvote
   * @param {String} author 
   * @param {String} permlink 
   * @returns returns a promise
   */
  public log_flag(author, permlink) {

    return this.http.post(BASE_API_V1 + 'log/post/' + this.makePostId(author, permlink) + '/flag', this.get_data(), this.httpOptions)
      .toPromise();

  }

  /**
   * Method to log a new follow to server side
   * @method log_follow
   * @param {String} user 
   * @returns returns a promise
   */
  public log_follow(user) {

    return this.http.post(BASE_API_V1 + 'log/user/' + user + '/follow', this.get_data(), this.httpOptions)
      .toPromise();

  }

  /**
   * Method to log a new unfollow to server side
   * @method log_unfollow
   * @param {String} user 
   * @returns returns a promise
   */
  public log_unfollow(user) {

    return this.http.post(BASE_API_V1 + 'log/user/' + user + '/unfollow', this.get_data(), this.httpOptions)
      .toPromise();

  }

  /**
   * Method to log a delete post to server side
   * @method log_delete_post
   */
  public log_delete_post() {

    // TODO: Ask Steepshot to bring back this feature
  }
  
  /**
   * Method to log a reblog to server side
   * @method log_reblog
   */
  public log_reblog() {

    // TODO: Ask Steepshot to modify endpoints to show reblogged posts

  }

  /**
   * Method to get the object for server side log
   * @method get_data
   * @returns Object with username and error
   */
  private get_data() {
    return JSON.stringify({
      username: (this.steemConnect.user_object as any).user,
      error: ''
    });
  }
  
  /**
   * Method to generate the permlink of a post
   * @method makePostId
   * @param {String} author 
   * @param {String} permlink 
   * @returns returns a string with the permlink
   */
  private makePostId(author, permlink) {
    return `@${author}/${permlink}`;
  }

}
