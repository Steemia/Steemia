import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { PostsRes, Query } from 'models/models';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { Observable } from 'rxjs/Observable';
import { trendTemplate } from './trend.template';

@Component({
  selector: 'section-scss',
  template: trendTemplate
})

export class TrendPage {

  private contents: Array<any> = [];
  private offset: string;
  private username: string = 'steemit';
  private is_first_loaded: boolean = false;
  private is_loading = true;
  private limit: number = 16;
  private total_posts: number = 0;
  private is_more_post: boolean = true;

  constructor(public appCtrl: App,
    private steemia: SteemiaProvider,
    private zone: NgZone,
    private cdr: ChangeDetectorRef) { }


  ionViewDidLoad() {
    this.zone.runOutsideAngular(() => {
      this.dispatchTrending({
        type: "top",
        username: "jaysermendez",
        limit: 15,
        first_load: this.is_first_loaded
      });
    });
  }


  /**
   * Method to dispatch hot and avoid repetition of code
   */
  private dispatchTrending(query: Query, action?: string, event?: any) {

    this.steemia.dispatch_posts(query).then((res: PostsRes) => {
      if (action == "refresh") {
        this.reinitialize();
      }
      this.contents = this.contents.concat(res.results);

      this.is_first_loaded = true;
      this.offset = res.offset;
      this.is_loading = false

      if (event) {
        event.complete()
      }
      this.cdr.detectChanges();
    });
  }

  /**
   * 
   * Method to refresh the current post for future data.
   * 
   * @param {Event} refresher
   */
  private doRefresh(refresher): void {
    this.is_first_loaded = false
    this.dispatchTrending({
      type: "top",
      username: "jaysermendez",
      limit: 15,
      first_load: this.is_first_loaded
    }, "refresh", refresher);
  }

  /**
   * 
   * Method to load data while scrolling.
   * 
   * @param {Event} infiniteScroll
   */
  private doInfinite(infiniteScroll): void {
   
  }

  /**
   * @method openPage: Method to push a page to the nav controller
   * @param {string} str: the name of the page to push
   */
  private openPage(str: string): void {
    this.appCtrl.getRootNavs()[0].push(str);
  }

  private reinitialize() {
    this.contents = [];
    this.is_more_post = true;
    this.total_posts = 0;
    this.is_first_loaded = false;
  }
}