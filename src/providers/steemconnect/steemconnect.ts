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
import { Storage } from '@ionic/storage';

@Injectable()
export class SteemConnectProvider {

  public loginUrl: string;
  public loginStatus: boolean;
  public steemData;
  private access_token: string;
  private profile;

  constructor(public storage: Storage, 
              public platform: Platform,
              public events?: Events) {

    // Initialize a instance of steemconnect in the whole provider to avoid
    // rewriting the instance each time we need to call the api.
    this.initializeSteem();
  
    
   
  }

  get getToken() {
    return this.access_token;
  }

  /**
   * 
   * Method to initialize a instance of steemconnect with the given parameters
   * 
   */
  private initializeSteem() {

    this.storage.get('access_token').then((token) => {
      
      if (token !== undefined && token !== null) {
        this.access_token = token;
      }
     
    }).then(() => {

      // Initialize an instance of steemconnect
      this.steemData = steemconnect.Initialize({
        app: 'steemia.app',
        // THIS SHOULD BE CHANGED IN PRODUCTION MODE
        callbackURL: 'http://localhost:8100',
        scope: ['login', 'offline', 'vote', 
                'comment', 'comment_delete', 
                'comment_options', 'custom_json',
                'claim_reward_balance'],
        accessToken: this.access_token
      });
      if (this.access_token !== undefined && this.access_token !== null) {
        this.steemData.me((err, res) => {
          this.profile = res;
          //profile.json_metadata = JSON.parse(profile.json_metadata);
          //this.profile = res;

          // Hacky way to make this work inside this nested function
          try {
            this.events.publish('publish:profile', this.profile)
          }
          catch (e) {}
        });

        
        
      }
      
      
      

      // save a reference to the login url for later used.
      // This variable is public to scope in any component.
      this.loginUrl = this.steemData.getLoginURL();

    });
  
  }

  public getMyProfile() {
    return new Promise(resolve => {
      resolve(this.profile);
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

  /**
   * 
   * Method to determine whether the current user is logged in or not.
   * 
   */
  public isLoggedIn(): Promise<boolean> {
    
    // this value will hold the status of the current client.
    let status: boolean;

    return new Promise((resolve, reject) => {

      this.steemData.isAuthenticated((err: steemConnect, result: steemConnect) => {

        // If there is an error fetching the api, lets reject the promise
        if (err) {
          reject(err)
        }

        // Otherwise, lets resolve the status of the current user.
        else {

          resolve(result.isAuthenticated)
        }
      });
    });
  }

  public setToken(token: string) {
    this.steemData.setAccessToken(token);
    this.storage.set('access_token', token);
  }


}
