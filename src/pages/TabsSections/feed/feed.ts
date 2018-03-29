import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { PostsRes } from 'models/models';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { feedTemplate } from './feed.template';
import { SteemiaProvider } from 'providers/steemia/steemia';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'section-scss',
  template: feedTemplate
})
export class FeedPage {

  private contents: Array<any> = [];
  private username: string = '';
  private is_loading = true;
  private first_limit: number = 15;
  private limit: number = 15;
  private is_more_post: boolean = true;
  private logged_in: boolean = false;
  private user: Object;
  private profile_pc: string = 'assets/user.png';

  private start_author: string = null;
  private start_permlink: string = null;

  constructor(private steemConnect: SteemConnectProvider,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private steemia: SteemiaProvider) {
  }

  ionViewDidLoad() {

    this.steemConnect.status.subscribe(res => {
      if (res.status === true) {
        this.logged_in = true;
        this.user = this.steemConnect.user_object;
        let json = JSON.parse((this.user as any).account.json_metadata);
        this.profile_pc = json.profile.profile_image;
        this.username = res.userObject.user;
        this.clear_links();
        this.zone.runOutsideAngular(() => {
          this.dispatchFeed();
        });
      }

      else if (res.logged_out === true) {
        this.logged_in = false;
        this.username = '';
        this.is_loading = true;
        this.reinitialize();
      }
    });
  }

  ionViewWillLeave() {
    let listaFrames = document.getElementsByTagName("iframe");
 
    for (var index = 0; index < listaFrames.length; index++) {
     let iframe = listaFrames[index].contentWindow;
     iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
   }
 }

  private clear_links(): void {
    this.start_author = null;
    this.start_permlink = null;
  }

  /**
   * Method to dispatch feed and avoid repetition of code
   */
  private dispatchFeed(action?: string, event?: any) {
    let que;

    if (this.start_author !== null && this.start_permlink !== null) {
      que = {
        user: this.username,
        username: this.username,
        limit: this.limit,
        start_author: this.start_author,
        start_permlink: this.start_permlink
      }
    }

    else {
      que = {
        user: this.username,
        username: this.username,
        limit: this.limit
      }
    }
    // Call the API
    this.steemia.dispatch_feed(que).then((res: PostsRes) => {

      // Check if the action is to refresh. If so, we need to 
      // reinitialize all the data after initializing the query
      // to avoid the data to dissapear
      if (action === "refresh") {
        this.reinitialize();
      }

      if (res.results.length === 0) {
        this.is_more_post = false;
      }

      this.contents = this.contents.concat(res.results);

      this.start_author = (res as any).offset_author;
      this.start_permlink = (res as any).offset;

      // Set the loading spinner to false
      this.is_loading = false

      // If this was called from an event, complete it
      if (event) {
        event.complete();
      }

      // Tell Angular that changes were made since we detach the auto check
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
    this.clear_links();
    this.zone.runOutsideAngular(() => {
      this.dispatchFeed("refresh", refresher);
    });
  }

  /**
   * 
   * Method to load data while scrolling.
   * 
   * @param {Event} infiniteScroll
   */
  private doInfinite(infiniteScroll): void {
    this.zone.runOutsideAngular(() => {
      this.dispatchFeed("inifinite", infiniteScroll);
    });
  }

  private reinitialize() {
    this.clear_links();
    this.limit = 15;
    this.first_limit = 15;
    this.contents = [];
    this.is_more_post = true;
  }

}