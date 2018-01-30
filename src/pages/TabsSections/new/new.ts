import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from 'models/models';
import { SteemProvider } from '../../../providers/steem/steem';

@IonicPage()
@Component({
  selector: 'page-new',
  templateUrl: 'new.html',
})
export class NewPage {

  private contents: Array<Post> = [];
  private perPage = 15;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private steemProvider: SteemProvider) {

    // Initialize the first load of data with a pager of 10.
    this.getNew().then((content: Array<Post>) => {
      this.contents = content;
    });

  }

  /**
   * 
   * Method to get posts filtered by its creation date
   * 
   * @returns {Promise<Array<Post>>}: A promise with the requested posts.
   * @author Jayser Mendez.
   */
  private getNew(): Promise<Array<Post>> {
    return new Promise((resolve) => {
      this.steemProvider.getByNew({tag:"", limit: this.perPage})
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

    this.getNew().then((content: Array<Post>) => {
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
    this.getNew();
    this.getNew().then((content: Array<Post>) => {
      this.contents = content;
      infiniteScroll.complete();
    });
  }

}
