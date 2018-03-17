import { UtilProvider } from './../../../providers/util/util';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    public navParams: NavParams,
    public util: UtilProvider) {
      this.language = [
        'en_US'
      ]
      this.currency = [
        'USD'
      ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.util.getVoteValue().then(data => {
      this.upvote = data;
      console.log(data);
    })
  }

  onChangeUpvote(value) {
    console.log(value);
  }

  saveSettings(){
    this.util.setVoteValue(this.upvote);
  }

}
