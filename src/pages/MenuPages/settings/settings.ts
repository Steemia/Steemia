import { UtilProvider } from 'providers/util/util';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public upvote;
  public language;
  private currency;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public util: UtilProvider) {
      this.language = [
        'en_US'
      ]
      this.currency = [
        'USD'
      ]
  }

  ionViewDidLoad() {
    this.util.getVoteValue().then(data => {
      this.upvote = data;
      console.log(data);
    })
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  onChangeUpvote(value) {}

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Successfully Saved',
      subTitle: 'Your settings have been successfully saved 😎',
      buttons: ['OK']
    });
    alert.present();
  }
  saveSettings(){
    this.util.setVoteValue(this.upvote);
    this.presentAlert();
  }

}
