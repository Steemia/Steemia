import { Component, Input } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { SteeemActionsProvider }  from 'providers/steeem-actions/steeem-actions';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { UtilProvider } from 'providers/util/util';
import { SteemiaLogProvider } from 'providers/steemia-log/steemia-log';

@Component({
  selector: 'render-comment',
  templateUrl: 'comment.html'
})
export class CommentComponent {

  @Input('comment') comment: any;
  private is_voting: boolean = false;

  constructor(private alertCtrl: AlertController,
  private steemActions: SteeemActionsProvider,
  private navCtrl: NavController,
  private steemiaProvider: SteemiaProvider,
  public util: UtilProvider,
  private steemiaLog: SteemiaLogProvider) {}

  /**
   * Method to cast a vote or unvote
   * @param i 
   * @param author 
   * @param permlink 
   * @param weight 
   */
  private castVote(i, author: string, permlink: string, weight: number = 1000): void {
    // Set the is voting value of the post to true
    this.is_voting = true;

    this.steemActions.dispatch_vote('comment', author, permlink, weight).then(data => {
      if (data) {

        // Catch if the user is not logged in and display an alert
        if (data == 'not-logged') {
          let alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: 'This action requires you to be logged in. Please, login and try again.',
            buttons: ['Dismiss']
          });
          alert.present();

          this.is_voting = false; // remove the spinner
          return;
        }

        this.is_voting = false;

        if (weight > 0) {
          this.comment.vote = true;
          this.steemiaLog.log_vote(author, permlink); // log vote to server side
        }

        else {
          this.comment.vote = false;
          this.steemiaLog.log_unvote(author, permlink); // Log unvote to server side
        }

        this.refresh_comment();
      }
    }).catch(err => {
      console.log(err); this.is_voting = false
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
