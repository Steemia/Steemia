import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Post } from '../../models/models';
import * as steem from 'steem';
import * as moment from 'moment';

const BASE_ENDPOINT = "https://api.steemjs.com/"
const BY_FEED = BASE_ENDPOINT + "get_discussions_by_feed?query="

@Injectable()
export class SteemProvider {

  constructor(private http: Http) {
    
  }

  /**
   * Method to get Feed from current user.
   * @param query 
   */
  public getFeed(query: Object) {
    return this.http.get(BY_FEED + this.encodeParams(query))
        .map(this.parseData)
        .catch(this.catchErrors);
  } 

  /**
   * Method to parse data from the HTTP response
   * @param {Response} res: Response from HTTP GET
   * @returns returns the parsed respons with the correct attributes
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
      post.json_metadata.created = moment.utc(post.created).local().fromNow();

    });

    return response;
  }

  private catchErrors(error: Response | any) {
    return Observable.throw(error.json().error || "Server Error");
  }

  private encodeParams(parameters: Object): string {
    return encodeURIComponent(JSON.stringify(parameters));
  }

}
