import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Post } from '../../models/models';
import * as steem from 'steem';
import * as moment from 'moment';

// BASE ENPOINT
const BASE_ENDPOINT = 'https://api.steemjs.com/';

// MAIN TABS CONTENT
const BY_FEED = BASE_ENDPOINT + 'get_discussions_by_feed?query=';
const BY_TRENDING = BASE_ENDPOINT + 'get_discussions_by_trending?query=';
const BY_HOT = BASE_ENDPOINT + 'get_discussions_by_hot?query=';
const BY_CREATED = BASE_ENDPOINT + 'get_discussions_by_created?query=';
const BY_PROMOTED = BASE_ENDPOINT + 'get_discussions_by_promoted?query=';

// COMMENTS FOR POSTS
const GET_COMMENTS = BASE_ENDPOINT + 'get_content_replies?';

// PROFILE
const BY_BLOG = BASE_ENDPOINT + 'get_discussions_by_blog?query=';

// ENDPOINTS FOR FILTERING
const BY_VOTES = BASE_ENDPOINT + 'get_discussions_by_votes?query=';
const BY_PAYOUT = BASE_ENDPOINT + 'get_discussions_by_payout?query=';
const BY_ACTIVE = BASE_ENDPOINT + 'get_discussions_by_active?query=';
const BY_CASHOUT = BASE_ENDPOINT + 'get_discussions_by_cashout?query=';

// Regex
const urls = /(\b(https?|ftp):\/\/[A-Z0-9+&@#\/%?=~_|!:,.;-]*[-A-Z0-9+&@#\/%=~_|])/gim;
const users = /(^|\s)(@[a-z][-\.a-z\d]+[a-z\d])/gim;
const imgs = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gim;
const youtube = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
const youtubeid = /(?:(?:youtube.com\/watch\?v=)|(?:youtu.be\/))([A-Za-z0-9\_\-]+)/i;
const vimeoRegex = /(https?:\/\/)?(www\.)?(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
const tags = /(^|\s)(#)([a-z][-\.a-z\d]+[a-z\d])/gim;

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
   * Method to get posts filtered by hot.
   * @param query: {"limit":"10", "tags":"good-karma"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getByHot(query: Object) {
    return this.http.get(BY_HOT + this.encodeParams(query))
        .map(this.parseData)
        .catch(this.catchErrors);
  }

  /**
   * Method to get posts filtered by creation date.
   * @param query: {"limit":"10", "tags":"good-karma"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getByNew(query: Object) {
    return this.http.get(BY_CREATED + this.encodeParams(query))
        .map(this.parseData)
        .catch(this.catchErrors);
  }

  /**
   * Method to get posts filtered by trending.
   * @param query: {"limit":"10", "tags":"good-karma"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getByTrending(query: Object) {
    return this.http.get(BY_TRENDING + this.encodeParams(query))
        .map(this.parseData)
        .catch(this.catchErrors);
  }

  /**
   * Method to get posts filtered by promoted.
   * @param query: {"limit":"10", "tags":"good-karma"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getByPromoted(query: Object) {
    return this.http.get(BY_PROMOTED + this.encodeParams(query))
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
