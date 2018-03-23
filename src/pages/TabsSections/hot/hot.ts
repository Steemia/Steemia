import { UtilProvider } from 'providers/util/util';
import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
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
  private offset: string = null;
  private username: string = '';
  private is_first_loaded: boolean = false;
  private is_loading = true;
  private is_logged: boolean = false;
  private first_limit: number = 15;
  private limit: number = 15;
  private total_posts: number = 0;
  private is_more_post: boolean = true;
  private triggered: boolean = false;
  private user: Object;
  private profile_pc: string = 'assets/user.png';

  constructor(public util: UtilProvider,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private steemia: SteemiaProvider,
    private steemConnect: SteemConnectProvider) { }

  ionViewDidLoad() {
    this.steemConnect.status.subscribe(res => {
      if (res.status === true) {
        this.user = this.steemConnect.user_object;
        this.is_first_loaded = false;
        let json = JSON.parse((this.user as any).account.json_metadata);
        this.profile_pc = json.profile.profile_image;
        this.is_logged = true;
        this.username = res.userObject.user;
        this.zone.runOutsideAngular(() => {
          this.dispatchHot('refresh');
        });
      }

      else if (res.logged_out === true) {
        this.is_first_loaded = false;
        this.is_logged = false;
        this.username = '';
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

  /**
   * Method to dispatch hot and avoid repetition of code
   */
  private dispatchHot(action?: string, event?: any) {

    // Call the API
    this.steemia.dispatch_posts({
      type: "hot",
      username: this.username,
      limit: this.limit,
      first_load: this.is_first_loaded,
      offset: this.offset
    }).then((res: PostsRes) => {

      // Check if the action is to refresh. If so, we need to 
      // reinitialize all the data after initializing the query
      // to avoid the data to dissapear
      if (action === "refresh") {
        this.reinitialize();
      }

      // By default, the offset is null, so we want the whole data
      if (this.offset === null) {

        this.contents = this.contents.concat(res.results);
      }

      // Otherwise, we want the data execpt for the first index
      else {
        this.contents = this.contents.concat(res.results.splice(1));
      }

      // Check if there are more post to load
      if (this.contents[this.contents.length - 1].title === res.results[res.results.length - 1].title
        && this.is_first_loaded == true) {
        this.is_more_post = false;
      }

      // If first load is set to false, set it to true so next query
      // is able to use the offset
      if (this.is_first_loaded == false) {
        this.is_first_loaded = true;
      }

      // Declare the new offset
      this.offset = res.offset;

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
    // Get the current logged in user
    if (this.steemConnect.user === '' || this.steemConnect.user === null
      || this.steemConnect.user == undefined) {

      this.steemConnect.get_current_user().then(user => {
        this.username = user.toString();
      });
    }

    else {
      this.username = this.steemConnect.user;
    }
    this.is_first_loaded = false;
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
    if (this.first_limit === this.limit && this.is_first_loaded == true) {
      this.limit += 1;
    }
    this.zone.runOutsideAngular(() => {
      this.dispatchHot("inifinite", infiniteScroll);
    });
  }

  private reinitialize() {
    this.offset = null;
    this.limit = 15;
    this.first_limit = 15;
    this.contents = [];
    this.is_more_post = true;
    this.total_posts = 0;
    this.is_first_loaded = false;
  }
}