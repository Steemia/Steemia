import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { Post } from 'models/models';
import { SteemProvider } from '../../../providers/steem/steem';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { Observable } from 'rxjs/Observable';
import { feedTemplate } from './feed.template';
import { SteemiaProvider } from 'providers/steemia/steemia';

@Component({
  selector: 'section-scss',
  template: feedTemplate
})
export class FeedPage {

  private contents: Array<Post> = [];
  private username: string = 'steemit';
  private is_first_loaded: boolean = false;
  private is_loading = true;

  constructor(private steemProvider: SteemProvider,
    private appCtrl: App,
    private steemConnect: SteemConnectProvider,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private steemia: SteemiaProvider) {


  }

  ionViewDidLoad() {
    /**
     * Subscribe to the user object in the auth provider
     */
    // this.steemConnect.username.subscribe(user => {
    //   if (user !== null || user !== undefined || user !== '') {
    //     // Redeclare it as false to start the pagination from 0
    //     this.is_first_loaded = false;
    //     this.username = user;
    //     this.zone.runOutsideAngular(() => {
    //       this.dispatchFeed();
    //     });
    //   }
    // });

    this.zone.runOutsideAngular(() => {
      this.dispatchFeed();
    });


  }

  /**
   * Method to dispatch feed and avoid repetition of code
   */
  private dispatchFeed() {

    this.getFeed()
      .subscribe((data: Array<Post>) => {
        data.map(post => {
          this.contents.push(post);
        });
        this.is_loading = false;
        this.cdr.detectChanges(); // Force angular to detect the changes but not constantly
      });
    // Check if it is false to avoid assigning the variable in each iteration
    if (this.is_first_loaded == false) {
      this.is_first_loaded = true;
    }


  }

  /**
   * 
   * Method to get posts in the user feed
   * 
   * @returns Observable with an array of posts
   * @author Jayser Mendez.
   */
  private getFeed(): Observable<Array<Post>> {

    let query;

    if (this.is_first_loaded == false) {
      query = {
        limit: 25,
        tag: 'jaysermendez'
      };
    }

    else {
      query = {
        tag: 'jaysermendez',
        limit: 25,
        start_author: this.contents[this.contents.length - 1].author,
        start_permlink: this.contents[this.contents.length - 1].permlink,
      };
    }



    return this.steemProvider.getFeed(query);
  }

  /**
   * 
   * Method to refresh the current post for future data.
   * 
   * @param {Event} refresher
   */
  private doRefresh(refresher): void {
    this.is_first_loaded = false;
    this.getFeed()
      .subscribe((data: Array<Post>) => {
        this.contents = [];
        data.map(post => {
          this.contents.push(post);
        });
        this.is_loading = false;
        this.cdr.detectChanges();
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
    this.getFeed()
      .subscribe((data: Array<Post>) => {
        data.slice(1).map(post => {
          this.contents.push(post);
        });
        this.cdr.detectChanges(); // Force angular to detect the changes but not constantly
        infiniteScroll.complete();
      });
  }

  /**
   * @method openPage: Method to push a page to the nav controller
   * @param {string} str: the name of the page to push
   */
  private openPage(str: string): void {
    this.appCtrl.getRootNavs()[0].push(str);
  }

  public identify(index, item) {
    return item.title;
  }
}