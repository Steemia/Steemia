import { Component, Input } from '@angular/core';
import { AlertController, NavController, PopoverController } from 'ionic-angular';
import { SteeemActionsProvider }  from 'providers/steeem-actions/steeem-actions';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { UtilProvider } from 'providers/util/util';

@Component({
  selector: 'render-comment',
  templateUrl: 'comment.html'
})
export class CommentComponent {

  @Input('comment') comment: any;
  private is_voting: boolean = false;
  public popover;

  constructor(public popoverCtrl: PopoverController,
  private alertCtrl: AlertController,
  private steemActions: SteeemActionsProvider,
  private navCtrl: NavController,
  private steemiaProvider: SteemiaProvider,
  public util: UtilProvider) {}



   /**
   * Method to open the voting-slider popover
   */
  presentPopover(author, url) {
    this.popover = this.popoverCtrl.create('VotingSliderPage');
    this.popover.present();

    this.popover.onDidDismiss(data => {
      this.castVote(author, url, data.weight);
    });
  }

  /**
   * Method to cast a vote or unvote
   * @param i 
   * @param author 
   * @param permlink 
   * @param weight 
   */
  private castVote(author: string, permlink: string, weight: number = 1000): void {
    // Set the is voting value of the post to true
    this.is_voting = true;
    this.steemActions.dispatch_vote('comment', author, permlink, weight).then(data => {

      this.is_voting = false; // remove the spinner
      // Catch if the user is not logged in and display an alert
      if (data == 'not-logged') {
        return;
      }

      if (weight > 0) {
        this.comment.vote = true;
      }

      else {
        this.comment.vote = false;
      }

      if (data === 'Correct') {
        this.refresh_comment();
      }
    });
  }

  private refresh_comment() {
    this.steemiaProvider.dispatch_comment_single(this.comment.author, this.comment.url).then(data => {
      this.comment.net_votes = (data as any).net_votes;
      this.comment.pending_payout_value = parseFloat((data as any).pending_payout_value);
    });
  }

  /**
   * Method to open author profile page
   * @param {String} author: author of the post
   */
  private openProfile(author: string): void {
    this.navCtrl.push('AuthorProfilePage', {
      author: author
    });
  }

}
