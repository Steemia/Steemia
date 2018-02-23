import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Post } from '../../models/models';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';
import steemConnect from '../steemconnect/steemConnectAPI';

// SEARCH ENDPOINT
// https://github.com/Hoxly/asksteem-docs/wiki
const SEARCH_ENDPOINT = 'https://api.asksteem.com/search?'


@Injectable()
export class SteemProvider {

  constructor(private http: HttpClient) { }

  /**
   * @method getSearch: Perform the search with observables
   * @param query: Observable object for the search
   */
  public getSearch(query: Observable<string>, sort_by: string, order: string) {
    // return query.debounceTime(400)
    //     .switchMap(term => this.doSearch(term, sort_by, order));
  }
  
  /**
   * @method getSearch: Method to perform a search in the blockchain
   * @param query: {"q": "test", "sort_by": "created", "order": "desc"}
   */
  public doSearch(query, sort_by: string, order: string) {
    // let params = {
    //   q: query,
    //   sort_by: sort_by,
    //   order: order,
    //   include: "meta"
    // };
    // return this.http.get(SEARCH_ENDPOINT + this.encodeQueryData(params))
    //   .share()
    //   .catch(this.catchErrors);
  }

}
