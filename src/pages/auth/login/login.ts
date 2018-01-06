import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SteemProvider } from 'providers/steemconnect/steemconnect';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private loginUrl;
  constructor(public navCtrl: NavController, 
              private platform: Platform,
              public navParams: NavParams,
              private steeem: SteemProvider,
              private iab: InAppBrowser) {

    this.loginUrl = this.steeem.loginUrl;

  }

  private doLogin() {
    this.login().then(access_token => {
      if (access_token !== undefined && access_token !== null) {
        this.steeem.setToken(access_token);
        this.navCtrl.pop();
      }
    });
  }

  private login(): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        var browserRef = this.iab
          .create(this.loginUrl, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
  
        const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
          console.error("The Steemconnect sign in flow was canceled");
          reject(new Error("The Steemconnect sign in flow was canceled"));
        });
  
        browserRef.on("loadstart").subscribe((event) => {

          if ((event.url).indexOf('http://localhost:8100/?access_token=') === 0) {
            exitSubscription.unsubscribe();
            browserRef.close();
            let access_token = event.url.match(/\?(?:access_token)\=([\S\s]*?)\&/)[1];

            if (access_token !== undefined && access_token !== null) {
              resolve(access_token);
            }

            else {
              reject(new Error("Problem authenticating with SteemConnect"))
            }
          }
        });
      } else {
        console.error("loadstart events are not being fired in browser.");
        reject(new Error("loadstart events are not being fired in browser."));
      }
    });

  }

}
