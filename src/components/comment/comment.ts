import { Component, Input } from '@angular/core';
import { App,
         AlertController,
         NavController, 
         ActionSheetController, 
         LoadingController, 
         ToastController, 
         PopoverController,
         ModalController } from 'ionic-angular';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { UtilProvider } from 'providers/util/util';
import { Clipboard } from '@ionic-native/clipboard';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { AlertsProvider } from 'providers/alerts/alerts';
import { SharedServiceProvider } from 'providers/shared-service/shared-service';
import { TranslateService } from '@ngx-translate/core';

/**
 * @author Jayser Mendez
 * @version 0.0.1
 */

@Component({
  selector: 'render-comment',
  templateUrl: 'comment.html'
})
export class CommentComponent {

  @Input('comment') comment: any;
  private is_voting: boolean = false;
  private current_user: string = '';

  constructor(private app: App,
    private alerts: AlertsProvider,
    private steemActions: SteeemActionsProvider,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private service: SharedServiceProvider,
    private clipboard: Clipboard,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private steemConnect: SteemConnectProvider,
    private actionSheet: ActionSheetController,
    private steemiaProvider: SteemiaProvider,
    private util: UtilProvider) {

    this.current_user = (this.steemConnect.user_temp as any).user;
    
  }

  /**
   * Method to open the voting-slider popover
   */
  presentPopover(event) {
    let popover = this.popoverCtrl.create('VotingSliderPage');
    popover.present({
      ev: event
    });

    popover.onDidDismiss(data => {
      if (data) {
        this.castVote(this.comment.author, this.comment.url, data.weight);
      }
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

      // If it is an upvote
      if (weight > 0) {
        this.comment.vote = true;
      }

      // Else, it is a unvote
      else {
        this.comment.vote = false;
      }

      if (data === 'Correct') {
        this.refresh_comment();
      }
    });
  }

  /**
   * Method to cast a flag
   * @param i 
   * @param author 
   * @param permlink 
   * @param weight 
   */
  private castFlag(author: string, permlink: string, weight: number = -10000): void {
    let loading = this.loadingCtrl.create({
      content: this.translate.instant('generic_messages.flagging')
    });
    loading.present();
    this.steemActions.dispatch_vote('comment', author, permlink, weight).then(data => {

      loading.dismiss();
      // Catch if the user is not logged in and display an alert
      if (data == 'not-logged') {
        return;
      }

      else if (data === 'Correct') {
        this.toastCtrl.create({
          message: this.translate.instant('generic_messages.flag_correct')
        });

        this.refresh_comment();
      }

      else if (data === 'flag-error') {
        setTimeout(() => {
          this.alerts.display_alert('FLAG_ERROR');
        }, 200);

      }
    });
  }

  private refresh_comment(): void {
    this.steemiaProvider.dispatch_comment_single(this.comment.author, this.comment.url).then(data => {
      this.comment.net_votes = (data as any).net_votes;
      this.comment.pending_payout_value = parseFloat((data as any).pending_payout_value);
      this.comment.body = (data as any).body;
    });
  }

  /**
   * Method to open author profile page
   * @param {String} author: author of the post
   */
  private openProfile(author: string): void {
    if (this.steemConnect.user_object !== undefined) {
      if ((this.steemConnect.user_object as any).user == author) {
        this.app.getRootNav().push('ProfilePage', {
          author: (this.steemConnect.user_object as any).user
        });
      }
      else {
        this.app.getActiveNavs()[0].push('AuthorProfilePage', {
          author: author
        });
      }
    }
    else {
      this.app.getActiveNavs()[0].push('AuthorProfilePage', {
        author: author
      });
    }
    
  }

  /**
   * Method to show actionSheet for options
   */
  private show_options(): void {

    let options = {
      title: 'Options',
      buttons: [
        {
          text: this.translate.instant('modals.comments.options.copy'),
          icon: 'md-clipboard',
          role: 'destructive',
          handler: () => {
            this.clipboard.copy(this.comment.body);
          }
        },
        {
          text: this.translate.instant('modals.comments.options.flag'),
          icon: 'flag',
          handler: () => {
            this.castFlag(this.comment.author, this.comment.url);
          }
        },
        {
          text: this.translate.instant('modals.comments.options.cancel'),
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    }

    if (this.current_user === this.comment.author) {
      options.buttons.unshift({
        text: this.translate.instant('modals.comments.options.edit'),
        icon: 'md-create',
        handler: () => {
          let editModal = this.modalCtrl.create('EditCommentPage', { comment: this.comment}, { cssClass:"full-modal" });
          editModal.present();

          editModal.onDidDismiss((data) => {
            if (data) {
              this.refresh_comment();
            }
          });
        }
      });
    }

    let actionSheet = this.actionSheet.create(options);

    actionSheet.present();

  }

  /**
   * Method to reply a comment
   */
  private reply() {
    let replies = this.modalCtrl.create('ReplyCommentPage');
    replies.present();

    replies.onDidDismiss((data) => {
      if (data) {
        let loading = this.loadingCtrl.create({
          content: this.translate.instant('generic_messages.please_wait')
        });
        loading.present();
        this.steemActions.dispatch_reply(this.comment.author, this.comment.permlink, data.reply).then(res => {
          console.log(res)
          if (res === 'not-logged') {
            this.show_prompt(loading, 'NOT_LOGGED_IN');
            return;
          }
  
          else if (res === 'Correct') {
            this.service.reply_status.next(true);
            loading.dismiss();
          }
  
          else if (res === 'COMMENT_INTERVAL') {
            this.show_prompt(loading, 'COMMENT_INTERVAL');
          }
        })
        this.service.reply_status.next(true);
      }
    });
  }

  private show_prompt(loader, msg) {
    loader.dismiss();
    setTimeout(() => {
      this.alerts.display_alert(msg);
    }, 500);
  }

}
