import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilProvider } from 'providers/util/util';

/**
 * 
 * @author Huseyin T.
 * @version 0.1.0
 * 
 */

@IonicPage()
@Component({
  selector: 'page-voting-slider',
  templateUrl: 'voting-slider.html',
})
export class VotingSliderPage {
  public upvote = 1;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private util: UtilProvider) {
      this.upvote = this.util.upvote;
  }

  ionViewDidLoad() {
    this.util.getVoteValue().then(value => {
      this.upvote = (value as any);
    });
  }

  close() {
    this.viewCtrl.dismiss({
      weight: this.upvote * 100
    });
  }

}
