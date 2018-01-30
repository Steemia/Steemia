import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from 'models/models';
import { SteemProvider } from '../../../providers/steem/steem';

@IonicPage()
@Component({
  selector: 'page-hot',
  templateUrl: 'hot.html',
})
export class HotPage {
  
  private contents: Array<Post> = [];
  private perPage = 15;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private steemProvider: SteemProvider) {

    // Initialize the first load of data with a pager of 10.
    this.getHot().then((content: Array<Post>) => {
      this.contents = content;
    });

  }

  /**
   * 
   * Method to get posts filtered by hot
   * 
   * @returns {Promise<Array<Post>>}: A promise with the requested posts.
   * @author Jayser Mendez.
   */
  private getHot(): Promise<Array<Post>> {
    return new Promise((resolve) => {
      this.steemProvider.getByHot({tag:"", limit: this.perPage})
      .subscribe((data: Array<Post>) => {
        console.log(data)
        // Resolve the promise
        resolve(data);
      });
    });
  }

  /**
   * 
   * Method to refresh the current post for future data.
   * 
   * @param {Event} refresher
   */
  private doRefresh(refresher): void {

    this.getHot().then((content: Array<Post>) => {
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
    this.getHot();
    this.getHot().then((content: Array<Post>) => {
      this.contents = content;
      infiniteScroll.complete();
    });
  }
}
