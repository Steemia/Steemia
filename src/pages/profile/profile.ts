import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App} from 'ionic-angular';
import { DataProvider } from 'providers/data/data';
import { Post } from 'models/models';
import * as moment from 'moment';
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
  private account = "hsynterkr";
  private post_count;
  private follower_count;
  private following_count;
  private voting_power;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public app: App,
              private dataProvider: DataProvider) {
                
    // Initialize the first load of data with a pager of 10.
    this.getBlog().then((content: Array<Post>) => {
      this.contents = content;
    });
    
    this.getAccount();
    this.getFollow();             
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.getFollow(); 
    this.getAccount();
  }

  /**
   * 
   * Method to get post in the current topic and transform its data.
   * 
   * @returns {Promise<Array<Post>>}: A promise with the requested posts.
   * @author Jayser Mendez.
   */
  private getBlog(): Promise<Array<Post>> {
    return new Promise((resolve) => {this.dataProvider.getData('by_blog', this.perPage)
    .subscribe((data: Array<Post>) => {
      
      for (var i=0; i < data.length; i++) {
        // Parse metadata
        data[i].json_metadata = JSON.parse((data[i].json_metadata as string));
        // make meta value
        this.meta[i] = data[i].json_metadata;
        //payout fixed to 2
        data[i].pending_payout_value = parseFloat(data[i].pending_payout_value).toFixed(2);

        // HERE IS THE BUG
        this.meta[i].created = moment(data[i].created).fromNow();
      
        data[i].author_reputation = parseInt(Math.floor((((Math.log10(parseInt(data[i].author_reputation.toString())))-9)*9)+25).toFixed(2));
      }

      // Resolve the promise
      resolve(data)

    })})
  }
  private getAccount() {
    this.dataProvider.getAccount(this.account)
    .subscribe((data) => {
      this.post_count = data[0].post_count;
      this.voting_power = data[0].voting_power;
      console.log(data[0]);
    }) 
  }
  private getFollow() {
    this.dataProvider.getFollow(this.account)
    .subscribe((data) => {
      this.follower_count = data.follower_count;
      this.following_count = data.following_count;
      console.log(data);
    })
  }

  /**
   * 
   * Method to refresh the current post for future data.
   * 
   * @param {Event} refresher
   */
  private doRefresh(refresher): void {

    this.getBlog().then((content: Array<Post>) => {
      this.contents = content;
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
    this.getBlog();
    this.getBlog().then((content: Array<Post>) => {
      this.contents = content;
      infiniteScroll.complete();
    });
  }

  private openPost(event) {
    console.log(event)
    this.app.getRootNav().push('PostSinglePage', {
      permlink: event.Post.permlink,
      author: event.Post.author
    });
  }

}
