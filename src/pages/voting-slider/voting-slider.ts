import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
// PROVIDERS
import { UtilProvider } from './../../providers/util/util';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { AlertsProvider } from 'providers/alerts/alerts';
import { SteemiaProvider } from './../../providers/steemia/steemia';

/**
 * 
 * @author Huseyin T.
 * @version 0.1.0
 * 
 */

@IonicPage()
@Component({
  selector: 'page-voting-slider',
  templateUrl: 'voting-slider.html',
})
export class VotingSliderPage {
  private is_voting: boolean = false;
  public upvote = 1;
  public author;
  public url;
  public content;
  public vote;
  public net_likes;
  public net_votes;
  public top_likers_avatars;
  public pending_payout_value;
  public children;
  public weight;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private alerts: AlertsProvider,
    private steemActions: SteeemActionsProvider,
    private steemiaProvider: SteemiaProvider,
    private util: UtilProvider) {
      this.upvote = this.util.upvote;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VotingSliderPage');
    this.util.getVoteValue().then(value => {
      this.upvote = value;
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }
  
  onChangeUpvote() {
    console.log(this.upvote);
  }
  public tryUpvote(upvote) {
    this.author = this.navParams.get('author');
    this.url = this.navParams.get('url');
    this.vote = this.navParams.get('vote');
    this.net_likes =this.navParams.get('net_likes');
    this.net_votes =this.navParams.get('net_votes');
    this.top_likers_avatars =this.navParams.get('top_likers_avatars');
    this.pending_payout_value =this.navParams.get('pending_payout_value');
    this.children =this.navParams.get('children');
    this.weight = upvote*100;
    console.log(upvote, this.author, this.url, this.top_likers_avatars);
    this.castVote(this.author, this.url, this.weight);
  }


  /**
   * Method to cast a vote or unvote
   * @param i 
   * @param author 
   * @param permlink 
   * @param weight 
   */
  private castVote(author: string, permlink: string, weight: number): void {
    // Set the is voting value of the post to true
    this.is_voting = true;

    this.steemActions.dispatch_vote('posts', author, permlink, weight).then(data => {
      if (data) {

        // Catch if the user is not logged in and display an alert
        if (data == 'not-logged') {
          
          this.alerts.display_alert('NOT_LOGGED_IN');
          this.is_voting = false; // remove the spinner
          return;
        }

        this.is_voting = false;

        if (weight > 0) {
          this.vote = true;
        }

        else {
          this.vote = false;
        }

        this.refreshPost();

      }
    }).catch(err => {console.log(err); this.is_voting = false});
  }

  private refreshPost() {
    this.steemiaProvider.dispatch_post_single({
      url: this.url
    }).then(data => {
      this.net_likes = (data as any).net_likes;
      this.net_votes = (data as any).net_votes;
      this.top_likers_avatars = (data as any).top_likers_avatars;
      this.pending_payout_value = (data as any).pending_payout_value;
      this.children = (data as any).children;
    });
  }

}
