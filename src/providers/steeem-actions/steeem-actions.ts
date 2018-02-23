import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';

@Injectable()
export class SteeemActionsProvider {

  private access_token: string;
  private headers = new HttpHeaders();
  private username: string = '';
  private options: Object;

  constructor(public http: HttpClient,
    private steemConnect: SteemConnectProvider) {

    this.steemConnect.token.subscribe(token => {
      if (token !== undefined || token !== null || token !== '') {
        this.access_token = token;
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Authorization', this.access_token);
        this.options = {
          headers: this.headers
        };
      }
    });

    this.steemConnect.status.subscribe(res => {
      if (res.status === true) {
        this.username = res.userObject.user;
      }
    })
  }

  /**
   * Public method to dispatch a vote/unvote
   * @param author 
   * @param permlink 
   * @param weight 
   */
  public dispatch_vote(author: string, permlink: string, weight: number = 10000) {

    let url = permlink.split('/')[3];

    if (this.username === '' || this.username === null || this.username === undefined) {
      return Promise.resolve('not-logged');
    }

    return new Promise((resolve) => {
      this.steemConnect.instance.vote(this.username, author, url, weight, (err, res) => {
        if (err) {
          resolve(err);
        }

        else {
          resolve(res);
        }
      });
    });
  }

  /**
   * 
   * @param user_to_follow 
   */
  public dispatch_follow(user_to_follow: string) {

    if (this.username === '' || this.username === null || this.username === undefined) {
      return Promise.resolve('not-logged');
    }

    return new Promise((resolve) => {
      this.steemConnect.instance.follow(this.username, user_to_follow, (err, res) => {
        if (err) {
          resolve(err);
        }

        else {
          resolve(res);
        }
      });    
    }); 
  }

  /**
   * 
   * @param user_to_unfollow 
   */
  public dispatch_unfollow(user_to_unfollow: string) {

    if (this.username === '' || this.username === null || this.username === undefined) {
      return Promise.resolve('not-logged');
    }

    return new Promise((resolve) => {
      this.steemConnect.instance.unfollow(this.username, user_to_unfollow, (err, res) => {
        if (err) {
          resolve(err);
        }

        else {
          resolve(res);
        }
      });
    });
  }

  /**
   * 
   * @param author 
   * @param permlink 
   */
  public dispatch_reblog(author, permlink) {

    if (this.username === '' || this.username === null || this.username === undefined) {
      return Promise.resolve('not-logged');
    }

    return new Promise((resolve) => {
      this.steemConnect.instance.reblog(this.username, author, permlink, (err, res) => {
        if (err) {
          resolve(err);
        }

        else {
          resolve(res);
        }
      });
    });
  }

  /**
   * 
   * @param rewardSteem 
   * @param rewardSbd 
   * @param rewardVests 
   */
  public dispatch_claim_reward(rewardSteem, rewardSbd, rewardVests) {

    if (this.username === '' || this.username === null || this.username === undefined) {
      return Promise.resolve('not-logged');
    }

    return new Promise((resolve) => {
      this.steemConnect.instance.claimRewardBalance(this.username, rewardSteem, rewardSbd, rewardVests, (err, res) => {
        if (err) {
          resolve(err);
        }

        else {
          resolve(res);
        }
      });
    });
  }

  public dispatch_comment() {

  }

  public dispatch_flag() {

  }

}
