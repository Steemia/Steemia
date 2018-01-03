import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import * as moment from 'moment';

/**
 * Generated class for the TrendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trend',
  templateUrl: 'trend.html',
})
export class TrendPage {
  contents = [];
  meta = [];
  user = DataProvider.user;
  count = 10;

  constructor(public navCtrl: NavController, public navParams: NavParams, private DataProvider:DataProvider) {
    this.getTrending()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrendPage');
  }
  getTrending(){
    this.DataProvider.getTrending(this.count).subscribe(data => {
      this.contents = data;
      console.log(this.contents);

      for (var i=0; i<this.contents.length; i++){
        // Parse metadata
        this.contents[i].json_metadata = JSON.parse(this.contents[i].json_metadata);
        // make meta value
        this.meta[i] = this.contents[i].json_metadata;
        //payout fixed to 2
        this.contents[i].pending_payout_value = parseFloat(this.contents[i].pending_payout_value).toFixed(2);
        this.meta[i].created = moment(this.contents[i].created).fromNow();
        console.log(this.contents[i].json_metadata);

        this.contents[i].author_reputation = Math.floor(((((Math.log10(this.contents[i].author_reputation)) - 9)*9)+25).toFixed(2));
        //  console.log(this.contents[i].author_reputation)
      }
    });
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getTrending();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.count += 5;
      this.getTrending();

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }
}
