import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular'
import { steemConnect } from 'models/models';
import SteemConnect from './steemConnectAPI';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

/**
 * 
 * Provider for Steem actions based on the SteemConnect API
 * 
 * @author Jayser Mendez
 * 
 */

@Injectable()
export class SteemConnectProvider {

  public loginUrl: string;
  public steemData;
  private access_token: string;
  public instance;
  public user: string;
  private login_status: boolean;
  public user_object: Object;
  public user_temp: Object = {};

  public status: BehaviorSubject<{
    status: boolean,
    userObject?: any,
    logged_out?: boolean
  }> = new BehaviorSubject({ status: false });

  public token: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(public storage: Storage,
    public platform: Platform,
    private iab: InAppBrowser,
    private http: Http,
    private secureStorage: SecureStorage) {

    this.platform.ready().then(() => {
      // Save a reference of the steemconnect instance for later use
      this.instance = SteemConnect;

      this.getToken().then(token => {
        // If the token is null, undefined or empty string, the user is not logged in
        if (token === null || token === undefined || token === '') {

          //Set a null access token to the instance
          this.instance.setAccessToken(null);

          // Set login status to false
          this.login_status = false;
          this.status.next({
            status: this.login_status,
            logged_out: false
          });
        }

        // Otherwise if the token is not null, undefined nor an empty string, the user
        // is logged in
        else if (token !== null && token !== undefined && token !== '') {

          // Save the access token for a later reference
          this.access_token = token.toString();
          // set the access token to the instance
          this.instance.setAccessToken(this.access_token);
          this.token.next(this.access_token);
          // Set the login status to true
          this.login_status = true;
          this.dispatch_data();
          
        }
      });

      // Save a reference of the login url for later use
      this.loginUrl = this.instance.getLoginURL();
      console.log(this.loginUrl)
    });

  }

  get get_token() {
    return this.access_token;
  }

  private dispatch_data() {

    this.get_current_user().then((user: object) => {
      this.user_object = user;
    }).then(() => {

      this.status.next({
        status: this.login_status,
        userObject: this.user_object
      });
    });
  }

  public get_current_user() {

    if (Object.keys(this.user_temp).length != 0) {
      return Promise.resolve(this.user_temp);
    }

    return new Promise((resolve, reject) => {
      // Check if we have the token, if not, avoid the http call
      if (this.access_token === null || this.access_token === undefined || this.access_token === '') {
        resolve('Not Logged In')
      }

      // Do the API call
      else {
        this.instance.me((err, res) => {
          if (res) {
            this.user_temp = res;
            resolve(res);
          }

          else resolve('');

        });
      }
    });
  }

  private getToken() {
    return new Promise((resolve, reject) => {
      this.secureStorage.create('steemia_secure')
        .then((storage: SecureStorageObject) => {
          storage.get('access_token').then(
            data => resolve(data),
            error => resolve(null)
          )
        });
    })
  }

  private setToken(token) {
    this.secureStorage.create('steemia_secure')
      .then((storage: SecureStorageObject) => {

        storage.set('access_token', token)
          .then(() => { });
      });
  }

  /**
   * Method to open an IAB to do the oauth login using SteemConnect
   */
  public login() {
    return new Promise(resolve => {
      if (this.platform.is('cordova')) {
        const browserRef = this.iab
          .create(this.loginUrl, '_blank', 'location=yes,clearsessioncache=yes,clearcache=yes');

        const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
          browserRef.close()
          resolve("The Steemconnect sign in flow was canceled")
        });

        browserRef.on("loadstart").subscribe((event) => {

          if ((event.url).indexOf('http://localhost:8100/?access_token=') === 0) {
            exitSubscription.unsubscribe();
            browserRef.close();
            let access_token = event.url.match(/\?(?:access_token)\=([\S\s]*?)\&/)[1];

            if (access_token !== undefined && access_token !== null) {
              this.setToken(access_token.toString());
              this.instance.setAccessToken(access_token.toString());
              this.access_token = access_token.toString();
              this.token.next(this.access_token);
              this.login_status = true;
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
        if (err) reject(err);
        else {
          this.secureStorage.create('steemia_secure')
            .then((storage: SecureStorageObject) => {
              storage.remove('access_token').then(() => {});
            });
          this.login_status = false;
          this.user_temp = {};
          this.status.next({
            status: this.login_status,
            logged_out: true
          });
          resolve('done');
        }
      });
    });
  }

  private getMetadata() {
    return new Promise(resolve => {
      this.instance.me((err, res) => {
        if (res) resolve(res.user_metadata);
        else resolve(err)
      });
    });
  }

  public saveNotificationsLastTimestamp(lastTimestamp: number) {
    return new Promise(resolve => {
      this.getMetadata().then(metadata => {
        this.instance.updateUserMetadata({
          ...metadata,
          notifications_last_timestamp: lastTimestamp,
        }, (err, res) => {
          resolve(res.user_metadata.notifications_last_timestamp);
        })
      })
    });
  }

  public getNotificationsLastTimestamp() {
    return new Promise(resolve => {
      this.get_current_user().then((user: object) => {
        resolve((user as any).user_metadata.notifications_last_timestamp)
      })
    });
  }

}
