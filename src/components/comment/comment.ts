import { Component, Input } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { SteeemActionsProvider }  from 'providers/steeem-actions/steeem-actions';
import { UtilProvider } from 'providers/util/util';

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
  public util: UtilProvider) {
   
  }

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

    this.steemActions.dispatch_vote(author, permlink, weight).then(data => {
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
        }

        else {
          this.comment.vote = false;
        }
      }
    }).catch(err => {console.log(err); this.is_voting = false});
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
