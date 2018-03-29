import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { PostsRes } from 'models/models';
import { hotTemplate } from './hot.template';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'section-scss',
  template: hotTemplate
})

export class HotPage {

  private contents: Array<any> = [];
  private username: string = '';
  private is_first_loaded: boolean = false;
  private is_loading = true;
  private first_limit: number = 25;
  private limit: number = 25;
  private skip: number = 0;
  private is_more_post: boolean = true;
  private triggered: boolean = false;
  private is_logged: boolean = false;
  private user: Object;
  private profile_pc: string = 'assets/user.png';

  private start_author: string = null;
  private start_permlink: string = null;

  constructor(private steemia: SteemiaProvider,
    private zone: NgZone,
    private appCtrl: App,
    private cdr: ChangeDetectorRef,
    private steemConnect: SteemConnectProvider) {}

  ionViewDidLoad() {
    this.steemConnect.status.subscribe(res => {
      if (res.status === true) {
        this.user = this.steemConnect.user_object;
        let json = JSON.parse((this.user as any).account.json_metadata);
        this.profile_pc = json.profile.profile_image;
        this.is_logged = true;
        this.clear_links();
        this.username = res.userObject.user;
        this.zone.runOutsideAngular(() => {
          this.dispatchHot('refresh');
        });
      }

      else if (res.logged_out === true) {
        this.is_first_loaded = false;
        this.is_logged = false;
        this.username = '';
        this.clear_links();
        this.zone.runOutsideAngular(() => {
          this.dispatchHot('refresh');
        });
      }

      else if (this.triggered == false) {
        this.triggered = true; // Ensure to only trigger here once and not twice
        this.zone.runOutsideAngular(() => {
          this.dispatchHot();
        });
      }
    });
  }

  private clear_links(): void {
    this.start_author = null;
    this.start_permlink = null;
  }

  /**
   * Method to dispatch hot and avoid repetition of code
   */
  private dispatchHot(action?: string, event?: any) {
    let que;

    if (this.start_author !== null && this.start_permlink !== null) {
      que = {
        type: "hot",
        username: this.username,
        limit: this.limit,
        start_author: this.start_author,
        start_permlink: this.start_permlink
      }
    }

    else {
      que = {
        type: "hot",
        username: this.username,
        limit: this.limit
      }
    }
    // Call the API
    this.steemia.dispatch_posts(que).then((res: PostsRes) => {

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
      this.dispatchHot("refresh", refresher);
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
      this.dispatchHot("inifinite", infiniteScroll);
    });
  }

  private reinitialize() {
    this.limit = 15;
    this.clear_links();
    this.contents = [];
    this.is_more_post = true;
  }

  /**
   * @method openPage: Method to push a page to the nav controller
   * @param {string} str: the name of the page to push
   */
  private openPage(str: string): void {
    this.appCtrl.getRootNavs()[0].push(str);
  }

}
