import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App} from 'ionic-angular';
import { DataProvider } from 'providers/data/data';
import { Post } from 'models/models';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  private contents: Array<Post> = [];
  private meta: Array<any> = [];
  private perPage = 10;

  constructor(public navCtrl: NavController, 
              public app: App,
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
    return new Promise((resolve) => {this.dataProvider.getData('by_feed', this.perPage)
    .subscribe((data: Array<Post>) => {

      for (var i=0; i < data.length; i++) {
        // Parse metadata
        data[i].json_metadata = JSON.parse((data[i].json_metadata as string));
        // make meta value
        this.meta[i] = data[i].json_metadata;
        //payout fixed to 2
        data[i].pending_payout_value = parseFloat(data[i].pending_payout_value).toFixed(2);

        // HERE IS THE BUG
        this.meta[i].created = moment(data[i].created).fromNow();
      
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
    this.perPage += 10;
    this.getFeed();
    this.getFeed().then((content: Array<Post>) => {
      this.contents = content;
      infiniteScroll.complete();
    });
  }

  private openPost(event) {
    console.log(event)
    this.app.getRootNav().push('PostSinglePage', {
      permlink: event.Post.permlink,
      author: event.Post.author
    });
  }
}
