import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Post } from 'models/models';
import { SteemProvider } from '../../../providers/steem/steem';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage {

  private contents: Array<Post> = [];
  private perPage = 10;

  constructor(private steemProvider: SteemProvider) {

    // Initialize the first load of data with a pager of 10.
    this.getFeed().then(data => {
      this.contents = data;
    })

  }

  /**
   * 
   * Method to get post in the current topic and transform its data.
   * 
   * @returns {Promise<Array<Post>>}: A promise with the requested posts.
   * @author Jayser Mendez.
   */
  private getFeed(): Promise<Array<Post>> {
    return new Promise((resolve) => {
      this.steemProvider.getFeed({tag:"jaysermendez", limit: this.perPage})
      .subscribe((data: Array<Post>) => {
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
}