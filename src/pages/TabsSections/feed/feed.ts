import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { Post } from 'models/models';
import { SteemProvider } from '../../../providers/steem/steem';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage implements OnInit, OnDestroy {

  private destroyed$: Subject<{}> = new Subject();
  private contents: Array<Post> = [];
  private perPage = 10;

  constructor(private steemProvider: SteemProvider,
              private appCtrl: App) {

  }

  public ngOnInit() {
    this.getFeed()
    .takeUntil( this.destroyed$ )
    .subscribe((data: Array<Post>) => {
      this.contents = data;
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(); /* Emit a notification on the subject. */
    this.destroyed$.complete();
  }

  /**
   * 
   * Method to get posts in the user feed
   * 
   * @returns Observable with an array of posts
   * @author Jayser Mendez.
   */
  private getFeed(): Observable<Array<Post>> {
    return this.steemProvider.getFeed({tag:"jaysermendez", limit: this.perPage})
  }

  /**
   * 
   * Method to refresh the current post for future data.
   * 
   * @param {Event} refresher
   */
  private doRefresh(refresher): void {
    this.getFeed()
    .takeUntil( this.destroyed$ )
    .subscribe((data: Array<Post>) => {
      this.contents = data;
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
    this.getFeed()
    .takeUntil( this.destroyed$ )
    .subscribe((data: Array<Post>) => {
      this.contents = data;
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
}
