import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { PostsRes } from 'models/models';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { AlertsProvider } from 'providers/alerts/alerts';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private skip: number = 0;

  private sections: string = "blog";
  private account_data: Object;
  private username: string;
  private current_user: string;

  private steem_account_data: Object;

  private reward_vesting_steem;
  private reward_vesting_balance;
  private vesting_shares;
  private effective_sp;

  private contents: Array<any> = [];
  private is_loading = true;
  private limit: number = 15;
  private is_more_post: boolean = true;
  showToolbar:boolean = false;
  private no_post: boolean = false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private steemia: SteemiaProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
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
   * Method to dispatch posts and avoid repetition of code
   */
  private dispatchPosts(action?: string, event?: any) {

    // Call the API
    this.steemia.dispatch_profile_posts({
      user: this.username,
      username: this.current_user,
      limit: this.limit,
      skip: this.skip
    }).then((res: PostsRes) => {

      // Check if the action is to refresh. If so, we need to 
      // reinitialize all the data after initializing the query
      // to avoid the data to dissapear
      if (action === "refresh") {
        this.reinitialize();
      }
      
      this.contents = this.contents.concat(res.results);

      if (res.results.length === 0) {
        this.is_more_post = false;
      }

      this.skip += this.limit;

      // Set the loading spinner to false
      this.is_loading = false;

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

  public presentProfileModal() {
    let profileModal = this.modalCtrl.create('EditProfilePage', {steem_account_data: (this.account_data as any).json_metadata});
    profileModal.present();
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
}
