import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Post } from '../../models/models';
import * as steem from 'steem';
import * as moment from 'moment';

const BASE_ENDPOINT = 'https://api.steemjs.com/';
const BY_FEED = BASE_ENDPOINT + 'get_discussions_by_feed?query=';
const GET_COMMENTS = BASE_ENDPOINT + 'get_content_replies?';

@Injectable()
export class SteemProvider {

  constructor(private http: Http) {}

  /**
   * @method getComments: Method to retrieve comments from a post
   * @param query
   */
  public getComments(query: Object) {
    return this.http.get(GET_COMMENTS + this.encodeQueryData(query))
      .map(this.parseData)
      .catch(this.catchErrors);
  }

  /**
   * Method to get Feed from current user.
   * @param query: {"limit":"10", "tags":"good-karma"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getFeed(query: Object) {
    return this.http.get(BY_FEED + this.encodeParams(query))
        .map(this.parseData)
        .catch(this.catchErrors);
  } 

  /**
   * @method parseData: Method to parse data from the HTTP response
   * @param {Response} res: Response from HTTP GET
   * @returns returns the parsed response with the correct attributes
   */
  private parseData(res: Response) {
    let response = res.json()
    response.map(post => {
      // Format the current author reputation
      post.author_reputation = steem.formatter.reputation(post.author_reputation);

      // Parse pending payout value to float fixed to 2
      post.pending_payout_value = parseFloat(post.pending_payout_value).toFixed(2);

      // Parse Metadata
      post.json_metadata = JSON.parse((post.json_metadata as string));

      // Parse created time
      post.created = moment.utc(post.created).local().fromNow();

    });

    return response;
  }

  /**
   * @method catchErrors: Method to catch errors from HTTP calls
   * @param error 
   * @returns returns an observable with the error
   */
  private catchErrors(error: Response | any) {
    return Observable.throw(error.json().error || "Server Error");
  }

  /**
   * @method encodeParams: Method to encode object of params
   * @param parameters 
   * @returns string with the encoded parameters
   */
  private encodeParams(parameters: Object): string {
    return encodeURIComponent(JSON.stringify(parameters));
  }

  
  /**
   * @method encodeQueryData: add parameters to an url
   * @param {Object} parameters: parameters to add to url
   * @returns url with the parameters added
   */
  encodeQueryData(parameters: any) {
    let ret = [];
    for (let d in parameters)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(parameters[d]));
    return ret.join('&');
  }

}
