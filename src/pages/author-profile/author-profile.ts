import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { DataProvider } from 'providers/data/data';
import { SteemProvider } from 'providers/steem/steem';
import { Post } from 'models/models';
import { PostsRes, Query } from 'models/models';
import { SteemiaProvider } from 'providers/steemia/steemia';

@Component({
  selector: 'page-author-profile',
  templateUrl: 'author-profile.html',
})
export class AuthorProfilePage {

  private meta: Array<any> = [];
  private perPage = 10;
  private account = "steemia-io";
  private metadata;
  private about;
  private post_count;
  private follower_count;
  private following_count;
  private voting_power;
  private profile_image;
  private cover_image;
  private reputation;
  private location;
  private website;
  profile: string = "blog";

  private account_data: Object;
  private username: string;
  

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
    public app: App,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private steemia: SteemiaProvider,
    private steemProvider: SteemProvider,
    private dataProvider: DataProvider,
    public loadingCtrl: LoadingController) {

    this.username = this.navParams.get('author');
  }

  ionViewDidLoad() {
    this.zone.runOutsideAngular(() => {
      this.dispatchPosts();
    });

    this.get_account();
    this.getFollow();
    this.getAccount();
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

  private getAccount() {
    this.dataProvider.getAccount(this.account)
      .subscribe((data) => {
        this.metadata = JSON.parse(data[0].json_metadata);
        this.post_count = data[0].post_count;
        this.voting_power = (data[0].voting_power) / 100;
        this.profile_image = this.metadata.profile.profile_image;
        this.cover_image = this.metadata.profile.cover_image;
        this.about = this.metadata.profile.about;
        this.location = this.metadata.profile.location;
        this.website = this.metadata.profile.website;
        this.reputation = data[0].reputation
        //console.log(data[0]);
      })
  }
  private getFollow() {
    this.dataProvider.getFollow(this.account)
      .subscribe((data) => {
        this.follower_count = data.follower_count;
        this.following_count = data.following_count;
        //console.log(data);
      })
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

  private reinitialize() {
    this.offset = null;
    this.limit = 15;
    this.first_limit = 15;
    this.contents = [];
    this.is_more_post = true;
    this.total_posts = 0;
    this.is_first_loaded = false;
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 160;
    this.cdr.detectChanges();
  }
}
