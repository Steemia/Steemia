import { UtilProvider } from 'providers/util/util';
import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PostsRes } from 'models/models';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { AlertsProvider } from 'providers/alerts/alerts';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-author-profile',
  templateUrl: 'author-profile.html',
})
export class AuthorProfilePage {

  private skip: number = 0;

  private sections: string = "blog";
  private account_data: Object;
  private username: string;
  private current_user: string;

  private contents: Array<any> = [];
  private is_loading = true;
  private limit: number = 15;
  private is_more_post: boolean = true;
  showToolbar:boolean = false;
  private no_post: boolean = false;

  private start_author: string = null;
  private start_permlink: string = null;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    public util: UtilProvider,
    private cdr: ChangeDetectorRef,
    private steemia: SteemiaProvider,
    public loadingCtrl: LoadingController,
    private steemConnect: SteemConnectProvider,
    private alerts: AlertsProvider,
    private steemActions: SteeemActionsProvider) {

    this.username = this.navParams.get('author');

    this.current_user = (this.steemConnect.user_temp as any).user;
  }

  ionViewDidLoad() {

    this.zone.runOutsideAngular(() => {
      this.dispatchPosts();
    });

    this.get_account();
  }

  /**
   * Method to dispatch hot and avoid repetition of code
   */
  private dispatchPosts(action?: string, event?: any) {
    let que;

    if (this.start_author !== null && this.start_permlink !== null) {
      que = {
        user: this.username,
        username: this.current_user,
        limit: this.limit,
        start_author: this.start_author,
        start_permlink: this.start_permlink
      }
    }

    else {
      que = {
        user: this.username,
        username: this.current_user,
        limit: this.limit
      }
    }
    // Call the API
    this.steemia.dispatch_profile_posts(que).then((res: PostsRes) => {

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
   * Method to get account data from API
   */
  private get_account() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
    this.steemia.dispatch_profile_info({
      user: this.username,
      username: this.current_user,
    }).then(data => {
      this.account_data = data;
      loading.dismiss();
    });
  }

  /**
   * 
   * Method to refresh the current post for future data.
   * 
   * @param {Event} refresher
   */
  private doRefresh(refresher): void {
    this.zone.runOutsideAngular(() => {
      this.dispatchPosts("refresh", refresher);
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
      this.dispatchPosts("inifinite", infiniteScroll);
    });
  }

  /**
   * Method to reinitialize the state.
   * Used for pull to refresh the posts
   */
  private reinitialize(): void {
    this.limit = 15;
    this.contents = [];
    this.is_more_post = true;
  }

  /**
   * Method to listen the scroll event and adjust the tabbar
   * transparency
   */
  private onScroll($event): void {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 160;
    this.cdr.detectChanges();
  }


  /**
   * Private method to make Angular detect changes when
   * segments are changed.
   */
  private segmentChanged(): void {
    this.cdr.detectChanges();
  }

  private follow() {
    let loading = this.loadingCtrl.create({
      content: "Please wait until the user is followed"
    });

    loading.present();
    this.steemActions.dispatch_follow(this.username).then(res => {

      if (res === 'not-logged') {
        loading.dismiss();
        setTimeout(() => {
          this.alerts.display_alert('NOT_LOGGED_IN');
        }, 500);
      }

      if (res === 'Correct') {
        loading.dismiss();
        this.alerts.display_toast('FOLLOW');
        (this.account_data as any).has_followed = 1; // Update the button instead of calling the API again
        (this.account_data as any).followers_count += 1;
      }
    });
  }

  private unfollow() {
    let loading = this.loadingCtrl.create({
      content: "Please wait until the user is unfollowed"
    });

    loading.present();
    this.steemActions.dispatch_unfollow(this.username).then(res => {

      if (res === 'not-logged') {
        loading.dismiss();
        setTimeout(() => {
          this.alerts.display_alert('NOT_LOGGED_IN');
        }, 500);
      }

      if (res === 'Correct') {
        loading.dismiss();
        this.alerts.display_toast('UNFOLLOW');
        (this.account_data as any).has_followed = 0; // Update the button instead of calling the API again
        (this.account_data as any).followers_count -= 1;
      }
    });
  }
}
