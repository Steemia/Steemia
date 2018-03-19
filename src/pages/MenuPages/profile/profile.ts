import { UtilProvider } from 'providers/util/util';
import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { PostsRes } from 'models/models';
import { SteemiaProvider } from 'providers/steemia/steemia';

@IonicPage({
  priority: 'medium'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private sections: string = "blog";
  private account_data: Object;
  private steem_account_data: Object;
  private username: string;

  private reward_vesting_steem;
  private reward_vesting_balance;
  private vesting_shares;
  private effective_sp;

  private contents: Array<any> = [];
  private offset: string = null;
  private is_first_loaded: boolean = false;
  private is_loading = true;
  private first_limit: number = 15;
  private limit: number = 15;
  private total_posts: number = 0;
  private is_more_post: boolean = true;
  showToolbar:boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    public util: UtilProvider,
    private cdr: ChangeDetectorRef,
    private steemia: SteemiaProvider,
    private modalCtrl: ModalController,
    public loadingCtrl: LoadingController) {

    this.username = this.navParams.get('author');
  }

  ionViewDidLoad() {

    this.zone.runOutsideAngular(() => {
      this.dispatchPosts();
    });

    this.get_account();
    this.getSteemProfile();
  }

  public presentProfileModal() {
    let profileModal = this.modalCtrl.create('EditProfilePage', {steem_account_data: JSON.parse(this.steem_account_data[0].json_metadata)});
    profileModal.present();
  }

  /**
   * Method to dispatch posts and avoid repetition of code
   */
  private dispatchPosts(action?: string, event?: any) {

    // Call the API
    this.steemia.dispatch_profile_posts({
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
   * Method to get account data from API
   */
  private get_account() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
    this.steemia.dispatch_profile_info({
      username: this.username,
      current_user: "jaysermendez",
    }).then(data => {
      this.account_data = data;
      loading.dismiss();
    })
  }

  /**
   * Method to get account data with steem_balance
   */
  private getSteemProfile() {
    this.steemia.dispatch_account(this.username).then(data => {
      this.steem_account_data = data;
      this.reward_vesting_steem = data[0].reward_vesting_steem;
      this.vesting_shares = data[0].vesting_shares;
      this.reward_vesting_balance = data[0].reward_vesting_balance;
      console.log(this.steem_account_data);
      this.calculateSP();
    });
  }
  
  /**
   * Method to calculate effective steem power
   */
  private calculateSP() {
    this.effective_sp = parseFloat(this.reward_vesting_steem) * (parseFloat(this.vesting_shares) / parseFloat(this.reward_vesting_balance));
    this.effective_sp = (this.effective_sp).toFixed(0);
  }

  /**
   * 
   * Method to refresh the current post for future data.
   * 
   * @param {Event} refresher
   */
  private doRefresh(refresher): void {
    this.is_first_loaded = false;
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
    if (this.first_limit === this.limit && this.is_first_loaded == true) {
      this.limit += 1;
    }
    this.zone.runOutsideAngular(() => {
      this.dispatchPosts("inifinite", infiniteScroll);
    });
  }

  /**
   * Method to reinitialize the state.
   * Used for pull to refresh the posts
   */
  private reinitialize(): void {
    this.offset = null;
    this.limit = 15;
    this.first_limit = 15;
    this.contents = [];
    this.is_more_post = true;
    this.total_posts = 0;
    this.is_first_loaded = false;
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
