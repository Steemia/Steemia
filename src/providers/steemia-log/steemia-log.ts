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

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'cache-control': 'no-cache'
  })
};

@Injectable()
export class SteemiaLogProvider {

  private username: string = '';

  constructor(public http: HttpClient,
  private steemConnect: SteemConnectProvider) {

    this.steemConnect.status.subscribe(res => {
      if (res.status === true) {
        this.username = res.userObject.user;
      }
    });
  
  }

  /**
   * Method to log a new post to server side
   * @method log_post
   * @returns Returns a promise
   */
  public log_post(): Promise<any> {

    const data = JSON.stringify({
      username: this.username,
      error: ''
    });

    return this.http.post(BASE_API_V1 + 'log/post', data, httpOptions).toPromise();
  }

  /**
   * Metehod to log a new vote to server side
   * @method log_vote
   * @param {String} author 
   * @param {String} permlink
   * @returns returns a promise
   */
  public log_vote(author, permlink) {

    const data = JSON.stringify({
      username: this.username,
      error: ''
    });

    return this.http.post(BASE_API_V1 + 'log/post/' + this.makePostId(author, permlink) + '/upvote', data, httpOptions)
      .toPromise();

  }

  /**
   * Metehod to log a new unvote to server side
   * @method log_unvote
   * @param {String} author 
   * @param {String} permlink 
   * @returns returns a promise
   */
  public log_unvote(author, permlink) {

    const data = JSON.stringify({
      username: this.username,
      error: ''
    });

    return this.http.post(BASE_API_V1 + 'log/post/' + this.makePostId(author, permlink) + '/downvote', data, httpOptions)
      .toPromise();

  }

  public log_flag() {

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
