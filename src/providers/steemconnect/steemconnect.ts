/**
 * 
 * Provider for Steem actions based on the SteemConnect API
 * 
 * @author Jayser Mendez
 * 
 */

import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular'
import { steemConnect } from 'models/models';
import SteemConnect from './steemConnectAPI';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

const STEEM_BROADCAST = 'https://v2.steemconnect.com/api/broadcast';


@Injectable()
export class SteemConnectProvider {

  public loginUrl: string;
  public loginStatus = new BehaviorSubject<boolean>(false);
  public did_logged_out = new BehaviorSubject<boolean>(false);
  public steemData;
  private access_token: string;
  public instance;
  public user: string;

  constructor(public storage: Storage,
    public platform: Platform,
    public events: Events,
    private iab: InAppBrowser,
    private http: Http) {

    // Save a reference of the steemconnect instance for later use
    this.instance = SteemConnect;


    this.getToken().then(token => {
      
      // If the token is null, undefined or empty string, the user is not logged in
      if (token === null || token === undefined || token === '') {

        // Set a null access token to the instance
        this.instance.setAccessToken(null);
        // Dispatch the login status to false to the subscribers
        this.loginStatus.next(false);
      }

      // Otherwise if the token is not null, undefined nor an empty string, the user
      // is logged in
      else if (token !== null && token !== undefined && token !== '') {

        // Save the access token for a later reference
        this.access_token = token.toString();
        // set the access token to the instance
        this.instance.setAccessToken(this.access_token);

        this.dispatch_data();
      }
    })

    // Save a reference of the login url for later use
    this.loginUrl = this.instance.getLoginURL();
  }

  private dispatch_data() {
    // Now, we should retrieve the username of the logged in user before-hands
    this.get_current_user().then(user => {
      this.user = user.toString();
    }).then(() => {
      // Dispatch the login status to true to the subscribers
      this.loginStatus.next(true);
    })
  }

  public get_current_user() {
    return new Promise((resolve, reject) => {
      this.instance.me((err, res) => {
        if (res) {
          resolve(res.user);
        }
        else {
          resolve('')
        }
        
      });
    });
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

  /**
   * Method to open an IAB to do the oauth login using SteemConnect
   */
  public login() {
    return new Promise(resolve => {
      if (this.platform.is('cordova')) {
        var browserRef = this.iab
          .create(this.loginUrl, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");

        const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
          resolve("The Steemconnect sign in flow was canceled")
        });

        browserRef.on("loadstart").subscribe((event) => {

          if ((event.url).indexOf('http://localhost:8100/?access_token=') === 0) {
            exitSubscription.unsubscribe();
            browserRef.close();
            let access_token = event.url.match(/\?(?:access_token)\=([\S\s]*?)\&/)[1];

            if (access_token !== undefined && access_token !== null) {
              this.setToken(access_token);
              this.instance.setAccessToken(access_token);
              this.dispatch_data();
              resolve("success");
            }

            else {
              resolve("Problem authenticating with SteemConnect");
            }
          }
        });
      } else {
        resolve("loadstart events are not being fired in browser.");
      }
    })

  }

  public doLogout() {
    return new Promise((resolve, reject) => {
      SteemConnect.revokeToken((err, res) => {
        if (err) reject('error');
        else {
          this.storage.remove('access_token').then(() => { });
          this.did_logged_out.next(true);
          this.loginStatus.next(false)
          resolve('done');
        }
      });
    });
  }


}
