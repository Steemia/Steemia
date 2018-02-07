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
import * as steemconnect from 'sc2-sdk';
import SteemConnect from './steemConnectAPI';
import { Storage } from '@ionic/storage';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Subscription } from 'rxjs/Subscription';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response , Headers, RequestOptions } from '@angular/http';

@Injectable()
export class SteemConnectProvider {

  public loginUrl: string;
  public loginStatus = new BehaviorSubject<boolean>(false);
  public steemData;
  private access_token: string;
  public profile;
  public instance;

  constructor(public storage: Storage,
    public platform: Platform,
    public events: Events,
    protected astorage: AsyncLocalStorage,
    private iab: InAppBrowser,
    private http: Http) {

    this.instance = SteemConnect
    //this.setToken(this.access_token);
    this.getToken().then(token => {
      if (token === null || token === undefined || token === '') {
        SteemConnect.setAccessToken(null);
        this.loginStatus.next(false)
      }
      else if (token !== null && token !== undefined && token !== '') {
        console.log(token);
        this.access_token = token.toString();
        SteemConnect.setAccessToken(token);
        this.loginStatus.next(true)
        //this.testVote()
      }
    }).then(() => {
      SteemConnect.setAccessToken(this.access_token);
    });

    this.loginUrl = SteemConnect.getLoginURL();
    console.log(this.loginUrl)
  }

  private getToken() {
    return new Promise((resolve, reject) => {
      this.astorage.getItem('access_token').subscribe((token) => { 
        if (token) resolve(token)
        else resolve(null)
      })
    })
  }

  private testVote() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json')
    headers.append('Authorization', this.access_token);
    const options = new RequestOptions({headers: headers});
    this.http.post('https://v2.steemconnect.com/api/broadcast', {
      "operations": [
        ["vote", {
          "voter": "steemia-io",
          "author": "jaysermendez",
          "permlink": "steembar-voting-power-and-user-reputation-added",
          "weight": 10000
        }]
      ]
    }, options).subscribe(res => {
      console.log(res)
    })
  }

  private setToken(token) {
    this.astorage.setItem('access_token', token).subscribe(() => {});
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
          this.astorage.removeItem('access_token').subscribe(() => {});
          this.loginStatus.next(false)
          resolve('done');
        }
      });
    });
  }


}
