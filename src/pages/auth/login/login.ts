import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private loginUrl;
  constructor(public navCtrl: NavController, 
              private steemConnect: SteemConnectProvider,) {
    this.loginUrl = this.steemConnect.loginUrl;

  }

  private doLogin() {
    this.steemConnect.login().then(res => {
      if (res === 'success') {
        this.navCtrl.pop();
      }
    })
  }

}
