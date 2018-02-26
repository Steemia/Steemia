import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController,
    private steemConnect: SteemConnectProvider) {

  }

  private doLogin() {
    this.steemConnect.login().then(res => {
      if (res === 'success') {
        this.navCtrl.pop();
      }
    });
  }

}
