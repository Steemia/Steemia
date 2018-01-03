import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import * as moment from 'moment';
import * as steem from 'steem';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  contents = [];
  meta = [];
  user = this.DataProvider.user;
  count = 10;

  constructor(public navCtrl: NavController, public navParams: NavParams, private DataProvider:DataProvider) {
    this.getFeed();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage');
    console.log(this.DataProvider.user);
  }
  getFeed(){
    this.DataProvider.getFeed(this.count).subscribe(data => {
      this.contents = data;
      console.log(this.contents);
      console.log('---');

      for (var i=0; i<this.contents.length; i++){
        // Parse metadata
        this.contents[i].json_metadata = JSON.parse(this.contents[i].json_metadata);
        // make meta value
      this.meta[i] = this.contents[i].json_metadata;
      //payout fixed to 2
      this.contents[i].pending_payout_value = parseFloat(this.contents[i].pending_payout_value).toFixed(2);

      this.meta[i].created = moment(this.contents[i].created).fromNow();

      this.contents[i].author_reputation = Math.floor(((((Math.log10(this.contents[i].author_reputation))-9)*9)+25).toFixed(2));
      //  console.log(this.contents[i].author_reputation)

    }

    });
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getFeed();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.count += 10;
      this.getFeed();

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1500);
  }
}
