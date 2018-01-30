import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Post } from 'models/models';
import { SteemProvider } from '../../../providers/steem/steem';

@IonicPage()
@Component({
  selector: 'page-promoted',
  templateUrl: 'promoted.html',
})
export class PromotedPage {

  private contents: Array<Post> = [];
  private perPage = 15;

  constructor(public navCtrl: NavController,
              private steemProvider: SteemProvider) {

    // Initialize the first load of data with a pager of 10.
    this.getPromoted().then((content: Array<Post>) => {
      this.contents = content;
    });
  }
  
  /**
   * 
   * Method to get posts filtered by promoted
   * 
   * @returns {Promise<Array<Post>>}: A promise with the requested posts.
   * @author Jayser Mendez.
   */
  private getPromoted(): Promise<Array<Post>> {
    return new Promise((resolve) => {
      this.steemProvider.getByPromoted({tag:"", limit: this.perPage})
      .subscribe((data: Array<Post>) => {
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

    this.getPromoted().then((content: Array<Post>) => {
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
    this.getPromoted();
    this.getPromoted().then((content: Array<Post>) => {
      this.contents = content;
      infiniteScroll.complete();
    });
  }

}
