import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { METADATA } from '../../constants/constants';

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
    });
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

  public dispatch_mute() {

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

  /**
   * 
   * @param author 
   * @param permlink 
   * @param body 
   */
  public dispatch_comment(author, permlink, body) {

    if (this.username === '' || this.username === null || this.username === undefined) {
      return Promise.resolve('not-logged');
    }

    let url = permlink.split('/')[3];
    let permUrl = this.commentPermlink('', url);

    return new Promise((resolve) => {
      this.steemConnect.instance.comment(author, url, this.username, permUrl, '', body, METADATA, (err, res) => {
        if (err) resolve(err);
        else resolve(res);
      });
    });

  }

  public dispatch_post(title: string, description: string, tags: Array<string>) {

    let permlink = title.replace(/\s/g, "-");
    let tags_d = tags;
    tags_d.push('steemia');
    let jsonMetadata = { tags: tags_d, app: `steemia/0.1`, format: 'markdown', image: 'https://camo.githubusercontent.com/cd7f5a98b8f6db310ce7dee9afe0dc9179a9e061/68747470733a2f2f692e68697a6c69726573696d2e636f6d2f47394230454e2e706e67' };

    const operations = [];
    const commentOp = [
      'comment',
      {
        parent_author: '',
        parent_permlink: tags_d[0],
        author: this.username,
        permlink: permlink,
        title: title,
        body: description,
        json_metadata: JSON.stringify(jsonMetadata),
      },
    ];
    operations.push(commentOp);

    const commentOptionsConfig = {
      author: this.username,
      permlink: permlink,
      allow_votes: true,
      allow_curation_rewards: true,
      max_accepted_payout: '1000000.000 SBD',
      percent_steem_dollars: 10000,
    };

    (commentOptionsConfig as any).extensions = [
      [
        0,
        {
          beneficiaries: [{ account: 'steepshot', weight: 1000 }, { account: 'steemia-io', weight: 1000}],
        },
      ],
    ];

    operations.push(['comment_options', commentOptionsConfig]);
    operations.push([
      'vote',
      {
        voter: this.username,
        author: this.username,
        permlink,
        weight: 10000,
      },
    ]);

    return new Promise(resolve => {
      this.steemConnect.instance.broadcast(operations, (err, res) => {
        if (err) resolve(err);
        else resolve(res);
      });
    })

  }

  public dispatch_flag() {

  }

  /**
   * 
   * @param parentAuthor 
   * @param parentPermlink 
   */
  private commentPermlink(parentAuthor, parentPermlink) {
    const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, "").toLocaleLowerCase();
    parentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, "");
    return "re" + parentAuthor + "-" + parentPermlink + "-" + timeStr;
  }

}
