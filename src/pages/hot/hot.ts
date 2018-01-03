import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BY_HOT } from '../../constants/constants';
import { DataProvider } from '../../providers/data/data';
import { Post } from '../../models/models';


@IonicPage()
@Component({
  selector: 'page-hot',
  templateUrl: 'hot.html',
})
export class HotPage {
  
  private contents: Array<Post> = [];
  private meta: Array<any> = [];
  private perPage = 15;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private dataProvider: DataProvider) {

    // Initialize the first load of data with a pager of 10.
    this.getFeed().then((content: Array<Post>) => {
      this.contents = content;
    });

  }

  /**
   * 
   * Method to get post in the current topic and transform its data.
   * 
   * @returns {Promise<Array<Post>>}: A promise with the requested posts.
   * @author Jayser Mendez.
   */
  private getFeed(): Promise<Array<Post>> {
    return new Promise((resolve) => {this.dataProvider.getData(BY_HOT, this.perPage)
    .subscribe((data: Array<Post>) => {

      for (var i=0; i < data.length; i++) {
        // Parse metadata
        data[i].json_metadata = JSON.parse((data[i].json_metadata as string));
        // make meta value
        this.meta[i] = data[i].json_metadata;
        //payout fixed to 2
        data[i].pending_payout_value = parseFloat(data[i].pending_payout_value).toFixed(2);
      
        data[i].author_reputation = parseInt(Math.floor((((Math.log10(parseInt(data[i].author_reputation.toString())))-9)*9)+25).toFixed(2));
      }

      // Resolve the promise
      resolve(data)

    })})
  }

  /**
   * 
   * Method to refresh the current post for future data.
   * 
   * @param {Event} refresher
   */
  private doRefresh(refresher): void {

    this.getFeed().then((content: Array<Post>) => {
      this.contents = content;
      refresher.complete();
    });
  }

  /**
   * 
   * Method to load data while scrolling.
   * 
   * @param {Event} infiniteScroll
   */
  private doInfinite(infiniteScroll): void {
    this.perPage += 15;
    this.getFeed();
    this.getFeed().then((content: Array<Post>) => {
      this.contents = content;
      infiniteScroll.complete();
    });
  }
}
