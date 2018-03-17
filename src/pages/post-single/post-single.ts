import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PostsRes } from 'models/models';
import marked from 'marked';
import { postSinglePage } from './post-single.template';
import { AuthorProfilePage } from '../../pages/author-profile/author-profile';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SteeemActionsProvider } from 'providers/steeem-actions/steeem-actions';
import { Subject } from 'rxjs/Subject';
import { AlertsProvider } from 'providers/alerts/alerts';
import { ERRORS } from '../../constants/constants';
import { SteemiaLogProvider } from 'providers/steemia-log/steemia-log';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-post-single',
  template: postSinglePage
})
export class PostSinglePage {

  private post: any;
  private is_voting: boolean = false;
  private comments: Array<any> = [];
  private is_loading: boolean = true;
  private is_logged_in: boolean = false;
  private profile: any;


  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private zone: NgZone,
    private cdr: ChangeDetectorRef,
    public navCtrl: NavController,
    public navParams: NavParams,
    private steemia: SteemiaProvider,
    private alerts: AlertsProvider,
    public loadingCtrl: LoadingController,
    private steemActions: SteeemActionsProvider,
    private steemiaLog: SteemiaLogProvider) { }

  ionViewDidLoad() {
    this.post = this.navParams.get('post');

    this.post.full_body = marked(this.post.full_body, {
      gfm: true,
      tables: true,
      smartLists: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartypants: false
    });

    this.zone.runOutsideAngular(() => {
      this.load_comments();
    });

  }

  ionViewDidLeave() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private load_comments(action?: string) {
    this.steemia.dispatch_comments({
      url: this.post.url,
      limit: 15,
      current_user: "steemia-io"
    }).then((comments: PostsRes) => {

      // Check if the action is to refresh. If so, we need to 
      // reinitialize all the data after initializing the query
      // to avoid the data to dissapear
      if (action === "refresh") {
        this.reinitialize();
      }
      this.comments = comments.results;

      // Set the loading spinner to false
      this.is_loading = false

      // Tell Angular that changes were made since we detach the auto check
      this.cdr.detectChanges();
    });
  }

  private reinitialize() {
    this.comments = [];
  }

  /**
   * Method to open author profile page
   */
  private openProfile(): void {
    this.navCtrl.push(AuthorProfilePage, {
      author: this.post.author
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

    this.steemActions.dispatch_vote('post', author, permlink, weight).then(data => {
      if (data) {

        // Catch if the user is not logged in and display an alert
        if (data === 'not-logged') {
          this.alerts.display_alert('NOT_LOGGED_IN');
          this.is_voting = false; // remove the spinner
          return;
        }

        this.is_voting = false;

        if (weight > 0) {
          this.post.vote = true;
        }

        else {
          this.post.vote = false;
        }

        //this.refreshPost();
      }
    }).catch(err => { console.log(err); this.is_voting = false });
  }

  private reblog() {

    let loading = this.loadingCtrl.create({
      content: 'Hang on while we reblog this post 😎'
    });
    loading.present();
    this.steemActions.dispatch_reblog(this.post.author, this.post.url).then(data => {
      let msg = data;
      console.log(data)

      msg = msg.toString();
      if (data) {

        // Catch if the user is not logged in and display an alert
        if (data === 'not-logged') {
          loading.dismiss();
          setTimeout(() => {
            this.alerts.display_alert('NOT_LOGGED_IN');
          }, 500);
          return;
        }

        // Otherwise, it was reblogged correctly
        else {
          loading.dismiss();
          this.steemiaLog.log_reblog()
          setTimeout(() => {
            this.alerts.display_alert('REBLOGGED_CORRECTLY');
          }, 500);
        }
      }
    }).catch(e => {

      let include = e.error_description.includes(ERRORS.DUPLICATE_REBLOG.error);
      if (include) {
        loading.dismiss();
        setTimeout(() => {
          this.alerts.display_alert('ALREADY_REBLOGGED');
        }, 500);
      }
    });
  }

  private share() {
    this.steemActions.dispatch_share(this.post.url).then(res => {
      console.log(res)
    })
  }

}
