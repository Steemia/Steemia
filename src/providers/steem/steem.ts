import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Post } from '../../models/models';
import * as steem from 'steem';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { forkJoin } from "rxjs/observable/forkJoin";
import marked from 'marked';
import steemConnect from '../steemconnect/steemConnectAPI';

// BASE ENPOINT
const BASE_ENDPOINT = 'https://api.steemjs.com/';

// SEARCH ENDPOINT
// https://github.com/Hoxly/asksteem-docs/wiki
const SEARCH_ENDPOINT = 'https://api.asksteem.com/search?'

// MAIN TABS CONTENT
const BY_FEED = BASE_ENDPOINT + 'get_discussions_by_feed?query=';
const BY_TRENDING = BASE_ENDPOINT + 'get_discussions_by_trending?query=';
const BY_HOT = BASE_ENDPOINT + 'get_discussions_by_hot?query=';
const BY_CREATED = BASE_ENDPOINT + 'get_discussions_by_created?query=';
const BY_PROMOTED = BASE_ENDPOINT + 'get_discussions_by_promoted?query=';

// COMMENTS FOR POSTS
const GET_COMMENTS = BASE_ENDPOINT + 'get_content_replies?';

// PROFILE
const GET_PROFILE = BASE_ENDPOINT + 'get_accounts?names[]='
const BY_BLOG = BASE_ENDPOINT + 'get_discussions_by_blog?query=';
const FOLLOWERS = BASE_ENDPOINT + 'get_follow_count?account='

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

// IMAGES
const NO_IMAGE = 'assets/placeholder2.png';
const BUSY_IMAGE = 'https://img.busy.org/@'


@Injectable()
export class SteemProvider {

  private username: string = '';
  private user;


  constructor(private http: HttpClient) { }

  /**
   * Method to get the profile of an user
   * @param account: ['jaysermendez']
   */
  public getProfile(account: Array<String>) {

    let profile = this.http.get(GET_PROFILE + JSON.stringify(account));
    let followers = this.http.get(FOLLOWERS + account[0]);

    return forkJoin([profile, followers])
      .map(this.parseProfile)
      .catch(this.catchErrors);
  }

  /**
   * @method parseProfile: Method to parse profile data from the HTTP response
   * @param {Response} res: Response from HTTP GET
   * @returns returns the parsed response with the correct attributes
   */
  private parseProfile(res: Response[]) {
    let response = res;

    console.log(response)
    
    try {
      //(response[0[0]] as any) = JSON.parse(((response[0] as any)._body as string));
      (response[0][0] as any).json_metadata = JSON.parse(((response[0][0] as any).json_metadata as string));
      // Parse stats
      (response[1] as any)._body = JSON.parse(((response[1] as any)._body as string));
    }
    catch (e) {
      // do not parse data
    }

    // Parse reputation
    (response[0][0] as any).reputation =  steem.formatter.reputation((response[0][0] as any).reputation);

    // Parse created time
    (response[0][0] as any).created = moment.utc((response[0][0] as any).created).local().fromNow();

    return {
      profile: response[0][0],
      stats: response[1][0]
    }
  }

  /**
   * Method to get post posted by an user
   * @param query: {"limit":"10", "tags":"jaysermendez"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getProfilePosts(query: Object) {
    return this.http.get(BY_BLOG + this.encodeQueryData(query))
      .map(this.parseData)
      .catch(this.catchErrors);
  }

  /**
   * @method getSearch: Perform the search with observables
   * @param query: Observable object for the search
   */
  public getSearch(query: Observable<string>, sort_by: string, order: string) {
    return query.debounceTime(400)
        .switchMap(term => this.doSearch(term, sort_by, order));
  }
  
  /**
   * @method getSearch: Method to perform a search in the blockchain
   * @param query: {"q": "test", "sort_by": "created", "order": "desc"}
   */
  public doSearch(query, sort_by: string, order: string) {
    let params = {
      q: query,
      sort_by: sort_by,
      order: order,
      include: "meta"
    };
    return this.http.get(SEARCH_ENDPOINT + this.encodeQueryData(params))
      .catch(this.catchErrors);
    
  }

  /**
   * @method getComments: Method to retrieve comments from a post
   * @param query
   */
  public getComments(query: Object) {
    return this.http.get(GET_COMMENTS + this.encodeQueryData(query))
      .map(this.parseComment)
      .catch(this.catchErrors);
  }

  /**
   * Method to get Feed from current user.
   * @param query: {"limit":"10", "tags":"jaysermendez"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getFeed(query: Object) {
    
    return this.http.get(BY_FEED + this.encodeParams(query))
        .map((res) => this.parseData(res))
        .catch(this.catchErrors);
  }

   /**
   * Method to get posts filtered by hot.
   * @param query: {"limit":"10", "tags":"jaysermendez"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getByHot(query: Object) {
    return this.http.get(BY_HOT + this.encodeParams(query))
    .map((res) => this.parseData(res))
        .catch(this.catchErrors);
  }

  /**
   * Method to get posts filtered by creation date.
   * @param query: {"limit":"10", "tags":"jaysermendez"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getByNew(query: Object) {
    return this.http.get(BY_CREATED + this.encodeParams(query))
        .map((res) => this.parseData(res))
        .catch(this.catchErrors);
  }

  /**
   * Method to get posts filtered by trending.
   * @param query: {"limit":"10", "tags":"jaysermendez"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getByTrending(query: Object) {
    return this.http.get(BY_TRENDING + this.encodeParams(query))
        .map((res) => this.parseData(res))
        .catch(this.catchErrors);
  }

  /**
   * Method to get posts filtered by promoted.
   * @param query: {"limit":"10", "tags":"jaysermendez"} OR {"start_author":"author", "permlink":"permlink"} for pagination
   */
  public getByPromoted(query: Object) {
    return this.http.get(BY_PROMOTED + this.encodeParams(query))
        .map((res) => this.parseData(res))
        .catch(this.catchErrors);
  }

  /**
   * @method parseData: Method to parse data from the HTTP response
   * @param {Response} res: Response from HTTP GET
   * @returns returns the parsed response with the correct attributes
   */
  private parseComment(res) {
    let response = res;
    response.map(comment => {
      // Format the current author reputation
      comment.author_reputation = steem.formatter.reputation(comment.author_reputation);

      // Parse pending payout value to float fixed to 2
      comment.pending_payout_value = parseFloat(comment.pending_payout_value).toFixed(2);

      // Parse Metadata
      try {
        comment.json_metadata = JSON.parse((comment.json_metadata as string));
      } catch (e) {
        // do not parse JSON
      }

      comment.profile_image = BUSY_IMAGE + comment.author;

      moment.locale('en', {
        relativeTime: {
          future: 'in %s',
          past: '%s ago',
          s:  'seconds',
          ss: '%ss',
          m:  '%dm',
          mm: '%dm',
          h:  '%dh',
          hh: '%dh',
          d:  'a day',
          dd: '%dd',
          M:  'a month',
          MM: '%dM',
          y:  'a year',
          yy: '%dY'
        }
      });

      comment.body = marked(comment.body);

      // Parse created time
      comment.created = moment.utc(comment.created).local().fromNow();

    });

    return response;
  }

  /**
   * @method parseData: Method to parse data from the HTTP response
   * @param {Response} res: Response from HTTP GET
   * @returns returns the parsed response with the correct attributes
   */
  private parseData(res) {
    let response = res;
    let profile = this.fetchMe();
    response.map((post) => {
      // Format the current author reputation
      post.author_reputation = steem.formatter.reputation(post.author_reputation);

      // Parse pending payout value to float fixed to 2
      post.pending_payout_value = parseFloat(post.pending_payout_value).toFixed(2);

      // Parse Metadata
      try {
        post.json_metadata = JSON.parse((post.json_metadata as string));
      } catch (e) {
        // do not parse JSON
      }

      // set default image is there is not one
      if (!post.json_metadata.image) {
        post.json_metadata.image = [NO_IMAGE];
      }

      // initiliaze an empty array for the voters
      post.voters = [];

      post.isVoting = false;
      post.voted = false
      // Find if the current logged in user has voted for this post
      profile.then(res => {
        if (res) {
          if (res.user !== undefined || res.user !== null ) {
            post.active_votes.find((vote) => {
              if (vote.voter == res.user && vote.weight > 0) {
                post.voted = true
              }
              if (vote.voter == res.user && vote.weight <= 0) {
                post.voted = false
              }
            });
          }
        }
      });

      // grab the voters and join their profile image
      // limit it to three or less
      if (post.active_votes.length != 0) {
        for(let i = 0; i < 3; i++) {
          if (post.active_votes[i]) {
            if (post.active_votes[i].weight > 0) {
              let voter = {
                username: post.active_votes[i].voter,
                profile_picture: BUSY_IMAGE + post.active_votes[i].voter
              };
              post.voters.push(voter)
            }
          }
        }
      }

      // Parse created time
      post.created = moment.utc(post.created).local().fromNow();

    });
    console.log(response)
    return response;
  }

  /**
   * Method to return profile data of the logged in user.
   * First, it will try to load the data from the variable if available,
   * if not, it will call the API and return a promise with this data.
   */
  private fetchMe() {
    if (this.user) {
      // already loaded data
      return Promise.resolve(this.user);
    }

    return new Promise((resolve, reject) => {
      steemConnect.me((err, res) => {
        if (!err) {
          this.user = res;
          resolve(res)
        }
        else resolve(null)
      })
    })
  }

  /**
   * @method catchErrors: Method to catch errors from HTTP calls
   * @param error 
   * @returns returns an observable with the error
   */
  private catchErrors(error: Response | any) {
    console.log(error)
    return Observable.throw(error.error || "Server Error");
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
  private encodeQueryData(parameters: any) {
    let ret = [];
    for (let d in parameters)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(parameters[d]));
    return ret.join('&');
  }

}
