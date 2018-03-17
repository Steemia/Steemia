import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, App, ViewController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { PostsRes } from 'models/models';
import { SteemiaProvider } from 'providers/steemia/steemia';
import { SteeemActionsProvider }  from 'providers/steeem-actions/steeem-actions';
import { SteemConnectProvider } from 'providers/steemconnect/steemconnect';
import { Subject } from 'rxjs/Subject';
import { AlertsProvider } from 'providers/alerts/alerts';
import { ERRORS } from '../../../constants/constants';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  private slice: number = 15;
  private is_more: boolean = true;

  private author: string;
  private permlink: string;
  private comments: Array<any> = [];
  private is_loading = true;
  private is_voting: boolean = false;
  private logged_in: boolean = false;
  private username: string = '';
  private no_content: boolean = false;

  private chatBox: string = '';

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private app: App,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private alerts: AlertsProvider,
    private steemia: SteemiaProvider,
    private steemActions: SteeemActionsProvider,
    public loadingCtrl: LoadingController,
    private steemConnect: SteemConnectProvider) {
  }

  ionViewDidLoad() {
    this.permlink = this.navParams.get('permlink');
    this.author = this.navParams.get('author');

    try {
      this.username = (this.steemConnect.user_object as any).user;
    }
    catch (e) {}
    

    this.zone.runOutsideAngular(() => {
      this.load_comments();
    });
    
  }

  /**
   * Method to load the comments of the post
   * @param action 
   */
  private load_comments(action?: string): void {
    this.steemia.dispatch_comments({
      url: this.permlink,
      limit: 50,
      current_user: this.username
    }).then((comments: PostsRes) => {

      // Check if the action is to refresh. If so, we need to 
      // reinitialize all the data after initializing the query
      // to avoid the data to dissapear
      if (action === "refresh") {
        this.reinitialize();
      }

      if (comments.results.length < 1) {
        this.no_content = true;
      }

      if (this.slice > comments.results.length) {
        this.is_more = false;
      }
      
      this.comments = comments.results.reverse();

      // Set the loading spinner to false
      this.is_loading = false;

      // Tell Angular that changes were made since we detach the auto check
      this.cdr.detectChanges();
    });
  }

  /**
   * Infinite scroll to load more comments
   * @param infiniteScroll 
   */
  private load_more(infiniteScroll) {
    setTimeout(() => {
      this.slice += 5;
      if (this.slice > this.comments.length) {
        this.is_more = false;
      }
      infiniteScroll.complete();
      
    }, 1000);
  }

  /**
   * Reinitialize comments state
   */
  private reinitialize() {
    this.no_content = false;
    this.comments = [];
  }

  /**
   * Dispatch a comment to the current post
   */
  private comment() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.steemActions.dispatch_comment(this.author, this.permlink, this.chatBox).then(res => {
      
      if (res) {
        this.chatBox = '';
        this.zone.runOutsideAngular(() => {
          this.load_comments('refresh');
        });
      }
    }).then(() => {

      loading.dismiss();

    }).catch(e => {

      let include = e.error_description.includes(ERRORS.COMMENT_INTERVAL.error);
      if (include) {
        loading.dismiss();
        setTimeout(() => {
          this.alerts.display_alert('COMMENT_INTERVAL');
        }, 500);
      }
    });
  }

  private dismiss() {
    this.viewCtrl.dismiss();
  }

}
