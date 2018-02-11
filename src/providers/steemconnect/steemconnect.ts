/**
 * 
 * Provider for Steem actions based on the SteemConnect API
 * 
 * @author Jayser Mendez
 * 
 */

import { Injectable, OnInit } from '@angular/core';
import { Platform, Events } from 'ionic-angular'
import { steemConnect } from 'models/models';
import SteemConnect from './steemConnectAPI';
import { Storage } from '@ionic/storage';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Subscription } from 'rxjs/Subscription';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

const STEEM_BROADCAST = 'https://v2.steemconnect.com/api/broadcast';


@Injectable()
export class SteemConnectProvider {

  public loginUrl: string;
  public loginStatus = new BehaviorSubject<boolean>(false);
  public steemData;
  private access_token: string;
  public user: string = '';
  public instance;
  public username = new BehaviorSubject<string>(null);

  constructor(public storage: Storage,
    public platform: Platform,
    public events: Events,
    protected astorage: AsyncLocalStorage,
    private iab: InAppBrowser,
    private http: Http) {

    this.instance = SteemConnect
    this.getToken().then(token => {
      if (token === null || token === undefined || token === '') {
        SteemConnect.setAccessToken(null);
        this.loginStatus.next(false)
      }
      else if (token !== null && token !== undefined && token !== '') {
        this.access_token = token.toString();
        SteemConnect.setAccessToken(this.access_token);
        this.loginStatus.next(true)
        SteemConnect.me((err, res) => {
          this.user = res.user
          this.username.next(res.user);
        });
      }
    })

    this.loginUrl = SteemConnect.getLoginURL();
  }

  private getToken() {
    return new Promise((resolve, reject) => {
      this.storage.get('access_token').then((token) => {
        if (token) resolve(token)
        else resolve(null)
      })
    })
  }

  private setToken(token) {
    this.storage.set('access_token', token).then(() => { });
  }

  public login() {
    return new Promise(resolve => {
      if (this.platform.is('cordova')) {
        var browserRef = this.iab
          .create(this.loginUrl, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");

        const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
          resolve("The Steemconnect sign in flow was canceled")
          //reject(new Error("The Steemconnect sign in flow was canceled"));
        });

        browserRef.on("loadstart").subscribe((event) => {

          if ((event.url).indexOf('http://localhost:8100/?access_token=') === 0) {
            exitSubscription.unsubscribe();
            browserRef.close();
            let access_token = event.url.match(/\?(?:access_token)\=([\S\s]*?)\&/)[1];

            if (access_token !== undefined && access_token !== null) {
              SteemConnect.setAccessToken(access_token);
              this.loginStatus.next(true);
              resolve("success");
            }

            else {
              resolve("Problem authenticating with SteemConnect");
            }
          }
        });
      } else {
        console.error("loadstart events are not being fired in browser.");
        resolve("loadstart events are not being fired in browser.");
      }
    })

  }

  /**
   * 
   * Method to get the login url to the auth.
   * 
   */
  public getLoginUrl(): Promise<string> {

    // Check if the login url is already saved
    if (this.loginUrl) {
      return Promise.resolve(this.loginUrl);
    }

    // Otherwise, get the url
    else {

      return new Promise(resolve => {

        resolve(this.steemData.loginUrl());

      });

    }
  }

  public doLogout() {
    return new Promise((resolve, reject) => {
      SteemConnect.revokeToken((err, res) => {
        if (err) reject('error');
        else {
          this.storage.remove('access_token').then(() => { });
          this.loginStatus.next(false)
          resolve('done');
        }
      });
    });
  }



  /**
   * BLOCKCHAIN BROADCASTING
   */

  public vote_unvote(author, permlink, weight) {
    let status: boolean;
    let sub = this.loginStatus.subscribe(res => {
      status = res
    });
    return new Promise((resolve, reject) => {
      if (status) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json')
        headers.append('Authorization', this.access_token);
        const options = new RequestOptions({ headers: headers });

        this.http.post('https://v2.steemconnect.com/api/broadcast', {
          "operations": [
            ["vote", {
              "voter": this.user,
              "author": author,
              "permlink": permlink,
              "weight": weight
            }]
          ]
        }, options).subscribe(res => {
          if (res.status === 200) {
            resolve('done')
          }
        });

      }
    })
  }

  public castComment(author, permlink, comment_permlink, body) {
    return new Promise((resolve) => {
      SteemConnect.comment(
        author, // Author of the post
        permlink, // Permlink of the post
        this.user, // Username of the commenter
        comment_permlink, // permlink of the comment if it is a reply, otherwise, normal permlink
        '', // empty by default
        body, // body of the comment
        { "tags": ["writing"], "app": "steemia/0.1" }, (err, res) => {
          if (!err) resolve('commented')
          else resolve('error_ocurred')
        });
    })

  }


}
