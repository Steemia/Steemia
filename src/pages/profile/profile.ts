import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App} from 'ionic-angular';
import { SteemProvider } from 'providers/steem/steem';
import { Post } from 'models/models';
import * as moment from 'moment';
import * as steem from 'steem';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private contents: Array<Post> = [];
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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public app: App,
              private steemProvider: SteemProvider) {
                

    
    this.getAccount();
    this.getFollow();        
    // this.steemProvider.getProfile(['jaysermendez']).subscribe(data => {
    //   console.log(data)
    // })    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.getFollow(); 
    this.getAccount();
  }
  private getAccount() {
    // this.dataProvider.getAccount(this.account)
    // .subscribe((data) => {
    //   this.metadata = JSON.parse(data[0].json_metadata);
    //   this.post_count = data[0].post_count;
    //   this.voting_power = (data[0].voting_power) / 100;
    //   this.profile_image = this.metadata.profile.profile_image;
    //   this.cover_image = this.metadata.profile.cover_image;
    //   this.about = this.metadata.profile.about;
    //   this.location = this.metadata.profile.location;
    //   this.website = this.metadata.profile.website;
    //   this.reputation = steem.formatter.reputation(data[0].reputation);
    //   //console.log(data[0]);
    // }) 
  }
  private getFollow() {
    // this.dataProvider.getFollow(this.account)
    // .subscribe((data) => {
    //   this.follower_count = data.follower_count;
    //   this.following_count = data.following_count;
    //   //console.log(data);
    // })
  }

  /**
   * 
   * Method to refresh the current post for future data.
   * 
   * @param {Event} refresher
   */
  private doRefresh(refresher): void {

  }

  /**
   * 
   * Method to load data while scrolling.
   * 
   * @param {Event} infiniteScroll
   */
  private doInfinite(infiniteScroll): void {
  }

}
